import { TransactionType } from './wallet.controller';

export class CreateTransactionDto {
  constructor(
    transactionId: string,
    type: TransactionType,
    amount: number,
    currency: string,
  ) {
    this.transactionId = transactionId;
    this.type = type;
    this.amount = amount;
    this.currency = currency;
  }

  transactionId: string;
  type: TransactionType;
  amount: number;
  currency: string;
}
