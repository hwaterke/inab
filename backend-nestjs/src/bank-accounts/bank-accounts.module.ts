import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {BankAccount} from './entities/bank-account.entity'
import {BankAccountService} from './bank-account.service'
import {BankAccountsResolver} from './bank-accounts.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount])],
  providers: [BankAccountService, BankAccountsResolver],
  exports: [BankAccountService],
})
export class BankAccountsModule {}
