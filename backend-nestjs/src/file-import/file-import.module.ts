import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {FileImportService} from './file-import.service'
import {BankAccountsModule} from '../bank-accounts/bank-accounts.module'
import {PayeesModule} from '../payees/payees.module'
import {CategoriesModule} from '../categories/categories.module'

@Module({
  imports: [ConfigModule, BankAccountsModule, PayeesModule, CategoriesModule],
  providers: [FileImportService],
})
export class FileImportModule {}
