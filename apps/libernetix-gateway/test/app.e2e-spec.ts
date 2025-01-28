import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationErrors } from '../src/errors/validation.errors';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    await app.init();
  });

  it('Checks validation on POST /v1/purchase', async () => {
    await request(app.getHttpServer())
      .post('/v1/purchase')
      .send({
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual(expect.arrayContaining([
          ValidationErrors.AMOUNT_IS_EMPTY,
          ValidationErrors.CURRENCY_IS_EMPTY,
          ValidationErrors.CLIENT_IS_EMPTY,
          ValidationErrors.CARD_IS_EMPTY,
        ]));
      });

    await request(app.getHttpServer())
      .post('/v1/purchase')
      .send({
        client: {},
        card: {},
        amount: 1,
        currency: 'EUR',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual(expect.arrayContaining([
          ['card', ValidationErrors.INVALID_EXPIRATION_DATE].join('.'),
          ['card', ValidationErrors.INVALID_CARDHOLDER_NAME].join('.'),
          ['card', ValidationErrors.INVALID_CARD_NUMBER].join('.'),
          ['card', ValidationErrors.INVALID_CVC].join('.'),
          ['client', 'email must be an email'].join('.'),
        ]));

        expect(res.body.message).toEqual(expect.not.arrayContaining([
          ValidationErrors.AMOUNT_IS_EMPTY,
          ValidationErrors.CURRENCY_IS_EMPTY,
          ValidationErrors.CLIENT_IS_EMPTY,
          ValidationErrors.CARD_IS_EMPTY,
        ]));
      });

    await request(app.getHttpServer())
      .post('/v1/purchase')
      .send({
        client: {
          email: 'test@email.com',
        },
        card: {
          card_number: '1236123829381230'
        },
        amount: -1,
        currency: 'SOM',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual(expect.arrayContaining([
          ValidationErrors.INVALID_ISO4217_CURRENCY_CODE,
          ['card', ValidationErrors.INVALID_CARDHOLDER_NAME].join('.'),
          ['card', ValidationErrors.INVALID_CVC].join('.'),
          ['card', ValidationErrors.INVALID_EXPIRATION_DATE].join('.'),
        ]));

        expect(res.body.message).toEqual(expect.not.arrayContaining([
          ValidationErrors.AMOUNT_IS_EMPTY,
          ValidationErrors.CURRENCY_IS_EMPTY,
          ValidationErrors.CLIENT_IS_EMPTY,
          ValidationErrors.CARD_IS_EMPTY,
          ['card', ValidationErrors.INVALID_CARD_NUMBER].join('.'),
        ]));
      });

    await request(app.getHttpServer())
      .post('/v1/purchase')
      .send({
        client: {
          email: 'test@email.com',
        },
        card: {
          card_number: '1236123829381230',
          expires: '12/12',
          cardholder_name: 'Nikolay Pasynkov',
          cvc: '123',
        },
        amount: 2,
        currency: 'EUR',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual(expect.arrayContaining([
          ['card', 'expires', ValidationErrors.INVALID_EXPIRATION_DATE].join('.'),
        ]));

        expect(res.body.message).toEqual(expect.not.arrayContaining([
          ValidationErrors.INVALID_ISO4217_CURRENCY_CODE,
          ValidationErrors.AMOUNT_IS_EMPTY,
          ValidationErrors.CURRENCY_IS_EMPTY,
          ValidationErrors.CLIENT_IS_EMPTY,
          ValidationErrors.CARD_IS_EMPTY,
          ['card', ValidationErrors.INVALID_CARDHOLDER_NAME].join('.'),
        ]));
      });

    await request(app.getHttpServer())
      .post('/v1/purchase')
      .send({
        client: {
          email: 'test@email.com',
        },
        card: {
          card_number: '1236123829381230',
          expires: '12/24',
          cardholder_name: 'Nikolay Pasynkov',
          cvc: '123',
        },
        amount: 2,
        currency: 'EUR',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual(expect.arrayContaining([
          ['card', 'expires', ValidationErrors.INVALID_EXPIRATION_DATE].join('.'),
        ]));

        expect(res.body.message).toEqual(expect.not.arrayContaining([
          ValidationErrors.INVALID_ISO4217_CURRENCY_CODE,
          ValidationErrors.AMOUNT_IS_EMPTY,
          ValidationErrors.CURRENCY_IS_EMPTY,
          ValidationErrors.CLIENT_IS_EMPTY,
          ValidationErrors.CARD_IS_EMPTY,
          ['card', ValidationErrors.INVALID_CARDHOLDER_NAME].join('.'),
        ]));
      });
  });

  it('POST /v1/purchase', async () => {
    await request(app.getHttpServer())
      .post('/v1/purchase')
      .send({
        client: {
          email: 'test@email.com',
        },
        card: {
          card_number: '4444333322221111',
          expires: '12/25',
          cardholder_name: 'Nikolay Pasynkov',
          cvc: '123',
        },
        amount: 2,
        currency: 'EUR',
      })
      .expect(201)
      .expect(({ body }) => {
        console.log(body);
      });
  });

});
