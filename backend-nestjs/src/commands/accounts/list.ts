import {Command} from '@oclif/core'
import {NestFactory} from '@nestjs/core'
import {AppModule} from '../../app.module'
import {BankAccountService} from '../../bank-accounts/bank-account.service'

export default class List extends Command {
  static description = 'list bank accounts'

  public async run(): Promise<void> {
    const app = await NestFactory.createApplicationContext(AppModule)
    const accountsService = app.get(BankAccountService)
    this.log('Accounts: ', await accountsService.findAll())
  }
}
