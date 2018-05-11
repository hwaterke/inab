import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid') uuid = undefined

  @Column('varchar') name = undefined

  @CreateDateColumn() created_at = undefined

  @UpdateDateColumn() updated_at = undefined
}
