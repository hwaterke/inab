import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {Payee} from './entities/payee.entity'
import {PayeeService} from './payee.service'
import {PayeesResolver} from './payees.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([Payee])],
  providers: [PayeeService, PayeesResolver],
  exports: [PayeeService],
})
export class PayeesModule {}
