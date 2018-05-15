import bcrypt from 'bcrypt'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {Account} from './Account'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') uuid = undefined

  @Column('varchar', {unique: true})
  email = undefined

  @Column('varchar') password = undefined

  @Column('boolean', {default: false})
  is_admin = false

  @OneToMany(() => Account, account => account.user)
  accounts = undefined

  @CreateDateColumn() created_at = undefined

  @UpdateDateColumn() updated_at = undefined

  validatePassword(plainTextPassword) {
    return bcrypt.compare(plainTextPassword, this.password)
  }
}
