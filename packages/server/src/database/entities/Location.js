import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm'
import {Payee} from './Payee'

@Entity()
export class Location {
  @ManyToOne(() => Payee, payee => payee.locations, {
    nullable: false,
    primary: true,
  })
  payee = undefined

  @Column('float', {primary: true})
  latitude = undefined

  @Column('float', {primary: true})
  longitude = undefined

  @CreateDateColumn() created_at = undefined

  @UpdateDateColumn() updated_at = undefined
}
