import { Injectable } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './createTransactionDto';
import { DuplicateTransactionError, InsufficientFundsError } from './errors';
import { DataSource } from 'typeorm';
import { Balance } from './entities/balance.entity';
import {
  currencyEGP,
  MoneyConversionService,
} from '../money_conversion/money_conversion.service';

@Injectable()
export class WalletService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly moneyConversionService: MoneyConversionService,
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    return await this.dataSource.transaction(async (manager) => {
      const balanceRepo = manager.getRepository(Balance);
      const transactionRepo = manager.getRepository(Transaction);

      const existingTransaction = await transactionRepo.findOne({
        where: { transactionId: createTransactionDto.transactionId },
      });

      if (existingTransaction) {
        throw new DuplicateTransactionError();
      }

      let balance = await balanceRepo.findOne({
        where: { id: 1 },
        lock: { mode: 'pessimistic_write' },
      });

      if (!balance) {
        balance = balanceRepo.create({ id: 1, amount: '0.00' });
        await balanceRepo.save(balance);
      }

      let amount = createTransactionDto.amount;
      let currency = createTransactionDto.currency;

      if (createTransactionDto.currency != currencyEGP) {
        amount = this.moneyConversionService.convertMoney(
          createTransactionDto.amount,
          createTransactionDto.currency,
          currencyEGP,
        );

        currency = currencyEGP;
      }

      if (amount < 0 && Math.abs(amount) > parseFloat(balance.amount)) {
        throw new InsufficientFundsError();
      }

      const transaction = transactionRepo.create({
        transactionId: createTransactionDto.transactionId,
        type: createTransactionDto.type,
        amount: amount.toFixed(2),
        currency: currency,
        createdAt: new Date(),
      });

      await transactionRepo.insert(transaction);

      balance.amount = (
        parseFloat(transaction.amount) + parseFloat(balance.amount)
      ).toFixed(2);

      await balanceRepo.save(balance);

      return transaction;
    });
  }
}
