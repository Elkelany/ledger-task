import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Balance {
  @PrimaryGeneratedColumn()
  id: number = 1;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: string;
}
