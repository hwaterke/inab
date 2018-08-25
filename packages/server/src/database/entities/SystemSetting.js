import {Column, CreateDateColumn, Entity, UpdateDateColumn} from 'typeorm'

@Entity()
export class SystemSetting {
  @Column('varchar', {primary: true})
  name = undefined

  @Column('varchar')
  value = undefined

  @CreateDateColumn()
  created_at = undefined

  @UpdateDateColumn()
  updated_at = undefined
}
