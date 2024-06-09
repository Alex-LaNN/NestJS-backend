import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export class AbstractEntity<T> {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number

  //@PrimaryColumn({ type: 'varchar', length: 255 })
  @Column({ type: 'varchar', length: 255 })
  @Index()
  url: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  edited: Date

  get createdIso(): string {
    return this.created.toISOString()
  }

  get editedIso(): string {
    return this.edited.toISOString()
  }
}
