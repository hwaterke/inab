import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {BankAccount} from './entities/bank-account.entity'
import {BankAccountService} from './bank-account.service'

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount])],
  providers: [BankAccountService],
})
export class BankAccountsModule {}
