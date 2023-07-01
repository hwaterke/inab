import {ConfigService} from '@nestjs/config'
import {Injectable} from '@nestjs/common'
import * as fs from 'node:fs'
import * as nodePath from 'node:path'
import {z} from 'zod'
import {BankAccountService} from '../bank-accounts/bank-account.service'
import {PayeeService} from '../payees/payee.service'
import {CategoryService} from '../categories/category.service'
import * as XLSX from 'xlsx'
import {isNil, mapValues, sortBy} from 'remeda'
import {BankTransactionService} from '../transactions/bank-transaction.service'
import {TransactionExtractor} from './extractors/TransactionExtractor'
import {IngExtractor} from './extractors/IngExtractor'
import {N26Extractor} from './extractors/N26Extractor'
import {N26ApiExtractor} from './extractors/N26ApiExtractor'

const EXTRACTORS: TransactionExtractor[] = [
  IngExtractor,
  N26ApiExtractor,
  N26Extractor,
]

const JsonSchema = z.object({
  accounts: z.optional(
    z.array(
      z.object({
        name: z.string().min(1).trim(),
        iban: z.string().min(1).trim(),
      })
    )
  ),
  payees: z.optional(
    z.array(
      z.object({
        name: z.string().min(1).trim(),
      })
    )
  ),
  categoryGroups: z.optional(
    z.array(
      z.object({
        name: z.string().min(1).trim(),
        categories: z.array(
          z.object({
            name: z.string().min(1).trim(),
          })
        ),
      })
    )
  ),
})

/**
 * Returns true if the provided path is a directory
 */
const isDirectory = async (path: string) => {
  const stat = await fs.promises.lstat(path)
  return stat.isDirectory()
}

@Injectable()
export class FileImportService {
  constructor(
    private configService: ConfigService,
    private bankAccountService: BankAccountService,
    private payeeService: PayeeService,
    private categoryService: CategoryService,
    private transactionService: BankTransactionService
  ) {}

  async importFiles() {
    const importFolder = this.configService.get<string>('IMPORT_FOLDER')

    // Stop if not folder provided
    if (!importFolder) {
      return
    }

    // Stop if path provided does not exist
    if (!fs.existsSync(importFolder)) {
      return
    }

    const filesToImport = await this.findAllFilesIn(importFolder)

    if (filesToImport.length === 0) {
      // Nothing to import
      return
    }

    console.log(`Importing ${filesToImport.length} files`)

    const sortedFiles = sortBy(filesToImport, [
      (file) => nodePath.extname(file).toLowerCase(),
      'desc',
    ])

    for await (const entry of sortedFiles) {
      console.log(`Importing file: ${entry}`)
      await this.importFile(entry)
    }
  }

  private async importFile(path: string) {
    const ext = nodePath.extname(path).toLowerCase()

    // Transaction files expected to have name <IBAN>-<anything>.csv
    // The IBAN is extracted from the name and used to find the account.
    const basename = nodePath.basename(path)
    const iban = basename.split('-')[0].toUpperCase().trim()
    const account = await this.bankAccountService.findOneByIban(iban)

    if (!account) {
      // If it is a JSON file, let's assume it is a data file
      if (ext === '.json') {
        await this.importDataFile(path)
        return
      }
      console.log(`No account found for file: ${path}`)
      return
    }

    const transactions = await this.extractTransactionsFromFile(path)

    if (transactions === null) {
      console.log(`Could not extract transactions from file: ${path}`)
      return
    }

    const extractor: TransactionExtractor | undefined = EXTRACTORS.find(
      (extractor) => extractor.canHandle(transactions)
    )

    if (!extractor) {
      console.log(`No valid extractor found for ${path}`)
      return
    }

    let importedTransactionCount = 0
    const cache = new Map<string, number>()
    for (const row of transactions) {
      const transactionData = await extractor.convert(row, {
        bankAccountService: this.bankAccountService,
        cache,
      })

      if (!isNil(transactionData)) {
        if (
          !isNil(transactionData.transferBankAccountUuid) &&
          transactionData.amount > 0
        ) {
          // Ony import transfers if the amount is negative to avoid duplicates
          continue
        }

        // Check via hash if the transaction already exists
        const hashExists = await this.transactionService.hashAlreadyExists(
          account.uuid,
          transactionData.hash
        )

        if (!hashExists) {
          await this.transactionService.create({
            ...transactionData,
            bankAccountUuid: account.uuid,
          })
          importedTransactionCount++
        }
      }
    }
    console.log(`${importedTransactionCount} transactions imported`)
  }

  private async importDataFile(path: string) {
    const rawData = await fs.promises.readFile(path, {encoding: 'utf8'})
    const data = JSON.parse(rawData)

    try {
      // Validate JSON
      const result = JsonSchema.parse(data)

      // Accounts
      for (const account of result.accounts ?? []) {
        await this.bankAccountService.upsert(account)
      }

      // Payees
      for (const payee of result.payees ?? []) {
        await this.payeeService.upsert(payee)
      }

      // Categories
      for (const categoryGroup of result.categoryGroups ?? []) {
        const group = await this.categoryService.upsertGroup({
          name: categoryGroup.name,
        })

        for (const category of categoryGroup.categories) {
          await this.categoryService.upsert({
            name: category.name,
            categoryGroupUuid: group.uuid,
          })
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  private async extractTransactionsFromFile(
    path: string
  ): Promise<Record<string, any>[] | null> {
    const ext = nodePath.extname(path).toLowerCase()

    if (ext === '.json') {
      const rawData = await fs.promises.readFile(path, {encoding: 'utf8'})
      const data = JSON.parse(rawData)
      if (!Array.isArray(data)) {
        return null
      }
      return data
    }

    if (ext === '.csv') {
      const workbook = XLSX.readFile(path, {raw: true})
      const data: Record<string, string | undefined>[] =
        XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
          blankrows: false,
          skipHidden: false,
        })

      // Trim and remove double spaces
      const cleanedData = data.map((row) =>
        mapValues(row, (value) => {
          if (typeof value === 'string') {
            return value.replace(/\s+/g, ' ').trim()
          }
          return value
        })
      )

      return cleanedData
    }

    return null
  }

  private async findAllFilesIn(path: string): Promise<string[]> {
    const result: string[] = []

    const recurse = async (item: string) => {
      if (await isDirectory(item)) {
        for await (const d of await fs.promises.opendir(item)) {
          const entry = nodePath.join(item, d.name)

          await recurse(entry)
        }
      } else {
        result.push(item)
      }
    }

    if (!fs.existsSync(path)) {
      throw new Error(`${path} does not exist.`)
    }

    await recurse(path)

    return result
  }
}
