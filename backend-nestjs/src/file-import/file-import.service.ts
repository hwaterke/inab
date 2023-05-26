import {ConfigService} from '@nestjs/config'
import {Injectable} from '@nestjs/common'
import * as fs from 'node:fs'
import * as nodePath from 'node:path'
import {z} from 'zod'
import {BankAccountService} from '../bank-accounts/bank-account.service'
import {PayeeService} from '../payees/payee.service'
import {CategoryService} from '../categories/category.service'

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

@Injectable()
export class FileImportService {
  constructor(
    private configService: ConfigService,
    private bankAccountService: BankAccountService,
    private payeeService: PayeeService,
    private categoryService: CategoryService
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

    // Stop if path provided is not a folder
    const stat = await fs.promises.lstat(importFolder)
    if (!stat.isDirectory()) {
      return
    }

    console.log(`Importing files in folder: ${importFolder}`)

    for await (const d of await fs.promises.opendir(importFolder)) {
      const entry = nodePath.join(importFolder, d.name)
      if (!d.isDirectory()) {
        const ext = nodePath.extname(d.name).toLowerCase()

        if (ext === '.json') {
          await this.importJsonFile(entry)
        }
        // TODO CSV import
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
}
