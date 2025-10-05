import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { DataSource } from 'typeorm';
import { MoneyConversionService } from '../money_conversion/money_conversion.service';

describe('WalletService', () => {
  let service: WalletService;
  let mockDataSource: any;

  const mockMoneyConversionService = {
    convertMoney: jest.fn(),
  };

  beforeEach(async () => {
    mockDataSource = {
      transaction: jest.fn().mockImplementation((cb) =>
        cb({
          getRepository: jest.fn().mockReturnValue({
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            insert: jest.fn(),
          }),
        }),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: MoneyConversionService,
          useValue: mockMoneyConversionService,
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
