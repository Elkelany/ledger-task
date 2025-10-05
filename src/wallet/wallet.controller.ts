import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  ParseEnumPipe,
  ParseFloatPipe,
  Post,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateTransactionDto } from './createTransactionDto';
import { DuplicateTransactionError, InsufficientFundsError } from './errors';

export enum TransactionType {
  Credit = 'credit',
  Debit = 'debit',
}

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('/transaction')
  async createTransaction(
    @Body('transactionId') transactionId: string,
    @Body('type', new ParseEnumPipe(TransactionType)) type: TransactionType,
    @Body('amount', ParseFloatPipe) amount: number,
    @Body('currency') currency: string,
  ) {
    try {
      return await this.walletService.createTransaction(
        new CreateTransactionDto(transactionId, type, amount, currency),
      );
    } catch (e) {
      if (e instanceof InsufficientFundsError) {
        throw new HttpException(
          'Insufficient balance',
          HttpStatus.PAYMENT_REQUIRED,
        );
      } else if (e instanceof DuplicateTransactionError) {
        throw new HttpException('Duplicate transaction', HttpStatus.CONFLICT);
      } else {
        throw e;
      }
    }
  }
}
