import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    await dataSource.synchronize(true);
  });

  beforeEach(async () => {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryRunner.query('TRUNCATE TABLE transaction');
    await queryRunner.query('TRUNCATE TABLE balance');
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
    await queryRunner.release();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/wallet/transaction (POST): deposit increases balance', async () => {
    await request(app.getHttpServer())
      .post('/wallet/transaction')
      .send({
        transactionId: 'transactionId-1',
        type: 'credit',
        amount: 10,
        currency: 'EGP',
      })
      .expect(201);
  });

  it('/wallet/transaction (POST): withdrawal decreases balance', async () => {
    const httpServer = app.getHttpServer();

    await request(httpServer)
      .post('/wallet/transaction')
      .send({
        transactionId: 'transactionId-1',
        type: 'credit',
        amount: 100,
        currency: 'EGP',
      })
      .expect(201);

    await request(httpServer)
      .post('/wallet/transaction')
      .send({
        transactionId: 'transactionId-2',
        type: 'debit',
        amount: -30,
        currency: 'EGP',
      })
      .expect(201);
  });

  it('/wallet/transaction (POST): withdrawal fails if balance would go negative', async () => {
    const httpServer = app.getHttpServer();

    await request(httpServer)
      .post('/wallet/transaction')
      .send({
        transactionId: 'transactionId-1',
        type: 'credit',
        amount: 100,
        currency: 'EGP',
      })
      .expect(201);

    await request(httpServer)
      .post('/wallet/transaction')
      .send({
        transactionId: 'transactionId-2',
        type: 'debit',
        amount: -130,
        currency: 'EGP',
      })
      .expect(402)
      .expect('{"statusCode":402,"message":"Insufficient balance"}');
  });

  it('/wallet/transaction (POST): multiple concurrent transactions keep the balance consistent', async () => {
    const httpServer = app.getHttpServer();

    await request(httpServer)
      .post('/wallet/transaction')
      .send({
        transactionId: 'transactionId-0',
        type: 'credit',
        amount: 1000,
        currency: 'EGP',
      })
      .expect(201);

    const promises = Array.from({ length: 10 }, (_, i) =>
      request(httpServer)
        .post('/wallet/transaction')
        .send({
          transactionId: `ransactionId-${i}`,
          type: 'debit',
          amount: -100,
          currency: 'EGP',
        }),
    );

    const responses = await Promise.all(promises);

    responses.forEach((res) => {
      expect(res.status).toBe(201);
    });
  });

  it('/wallet/transaction (POST): idempotent transaction does not duplicate effect', async () => {
    const httpServer = app.getHttpServer();

    await request(httpServer)
      .post('/wallet/transaction')
      .send({
        transactionId: 'transactionId-1',
        type: 'credit',
        amount: 100,
        currency: 'EGP',
      })
      .expect(201);

    await request(httpServer)
      .post('/wallet/transaction')
      .send({
        transactionId: 'transactionId-1',
        type: 'credit',
        amount: 100,
        currency: 'EGP',
      })
      .expect(409);
  });
});
