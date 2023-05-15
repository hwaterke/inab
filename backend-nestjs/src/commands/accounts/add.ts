import {Command, Flags} from '@oclif/core'
import {NestFactory} from '@nestjs/core'
import {AppModule} from '../../app.module'
import {BankAccountService} from '../../bank-accounts/bank-account.service'

export default class Add extends Command {
  static description = 'add a bank account'

  static flags = {
    name: Flags.string({
      required: true,
      char: 'n',
      description: 'name of the bank account',
    }),
    iban: Flags.string({
      required: true,
      description: 'iban of the bank account',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Add)

    const app = await NestFactory.createApplicationContext(AppModule)
    const accountsService = app.get(BankAccountService)

    await accountsService.create({
      name: flags.name,
      iban: flags.iban,
    })

    this.log('Bank account created')
  }
}
