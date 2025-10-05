import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['transactionId'])
export class Transaction {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  transactionId: string;

  @Column({ type: 'enum', enum: ['debit', 'credit'] })
  type: 'debit' | 'credit';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: string;

  @Column({ type: 'char', length: 3 })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;
}
