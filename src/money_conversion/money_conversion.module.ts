import { Module } from '@nestjs/common';
import { MoneyConversionService } from './money_conversion.service';

@Module({
  providers: [MoneyConversionService],
  exports: [MoneyConversionService],
})
export class MoneyConversionModule {}
