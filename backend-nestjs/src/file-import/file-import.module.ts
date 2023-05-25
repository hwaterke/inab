import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {FileImportService} from './file-import.service'
import {BankAccountsModule} from '../bank-accounts/bank-accounts.module'
import {PayeesModule} from '../payees/payees.module'

@Module({
  imports: [ConfigModule, BankAccountsModule, PayeesModule],
  providers: [FileImportService],
})
export class FileImportModule {}
