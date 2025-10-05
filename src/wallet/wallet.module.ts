import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Balance } from './entities/balance.entity';
import { MoneyConversionModule } from '../money_conversion/money_conversion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Balance]),
    MoneyConversionModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
