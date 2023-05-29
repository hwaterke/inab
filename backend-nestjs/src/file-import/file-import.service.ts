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
      const ext = nodePath.extname(entry).toLowerCase()

      if (ext === '.json') {
        await this.importJsonFile(entry)
      }
      if (ext === '.csv') {
        await this.importCsvFile(entry)
      }
    }
  }

  private async importJsonFile(path: string) {
    console.log(`Importing file: ${path}`)

    const rawdata = await fs.promises.readFile(path, {encoding: 'utf8'})
    const data = JSON.parse(rawdata)

    // Validate JSON

    try {
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

  private async importCsvFile(path: string) {
    console.log(`Importing file: ${path}`)

    // Name is expected to be <IBAN>-<anything>.csv
    // The iban is extracted from the name and used to find the account.
    const basename = nodePath.basename(path)
    const iban = basename.split('-')[0].toUpperCase().trim()
    const account = await this.bankAccountService.findOneByIban(iban)

    if (!account) {
      console.log(`Account with IBAN ${iban} not found`)
      return
    }

    const workbook = XLSX.readFile(path, {raw: true})
    const data: Record<string, string | undefined>[] = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
      {
        blankrows: false,
        skipHidden: false,
      }
    )

    // Trim and remove double spaces
    const cleanedData = data.map((row) =>
      mapValues(row, (value) => {
        if (typeof value === 'string') {
          return value.replace(/\s+/g, ' ').trim()
        }
        return value
      })
    )

    // TODO Add logic to use the right extractor.
    const extractor: TransactionExtractor = IngExtractor

    for (const row of cleanedData) {
      const transactionData = extractor.convert(row)
      if (!isNil(transactionData)) {
        // Check via hash if the transaction already exists
        const hashExists = await this.transactionService.hashAlreadyExists(
          account.uuid,
          transactionData.hash
        )

        if (hashExists) {
          // TODO swap two lines belows
          // continue
          console.log({hash: transactionData.hash})
          throw new Error('HASH CONFLICT')
        } else {
          await this.transactionService.create({
            ...transactionData,
            bankAccountUuid: account.uuid,
          })
        }
      }
    }
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
