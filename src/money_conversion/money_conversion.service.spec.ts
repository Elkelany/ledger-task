import { Test, TestingModule } from '@nestjs/testing';
import { MoneyConversionService } from './money_conversion.service';

describe('MoneyConversionService', () => {
  let service: MoneyConversionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoneyConversionService],
    }).compile();

    service = module.get<MoneyConversionService>(MoneyConversionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
