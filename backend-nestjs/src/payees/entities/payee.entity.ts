import {Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Payee {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string
}
