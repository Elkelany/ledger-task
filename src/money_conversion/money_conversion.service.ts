import { Injectable } from '@nestjs/common';

export const currencyEGP = 'EGP';

@Injectable()
export class MoneyConversionService {
  convertMoney(amount: number, from: string, to: string): number {
    if (from == currencyEGP) {
      return amount / 10;
    } else if (to == currencyEGP) {
      return amount * 10;
    } else {
      return amount;
    }
  }
}
