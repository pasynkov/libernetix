import {
  IsCreditCard, IsDefined,
  IsEmail,
  IsInt,
  IsISO4217CurrencyCode, IsNotEmpty, IsNotEmptyObject, IsObject,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ClientRequestDto } from './client.request.dto';
import { CreditCardRequestDto } from './credit-card.request.dto';
import { ValidationErrors } from '../errors/validation.errors';
import { Type } from 'class-transformer';

export class PurchaseRequestDto {


  @IsDefined({ message: ValidationErrors.CURRENCY_IS_EMPTY})
  @IsISO4217CurrencyCode({
    message: ValidationErrors.INVALID_ISO4217_CURRENCY_CODE,
  })
  currency: string;

  @IsDefined({ message: ValidationErrors.AMOUNT_IS_EMPTY})
  @IsInt()
  @Min(1)
  amount: number;

  @IsDefined({ message: ValidationErrors.CLIENT_IS_EMPTY})
  @ValidateNested()
  @Type(() => ClientRequestDto)
  client: ClientRequestDto;

  @IsDefined({ message: ValidationErrors.CARD_IS_EMPTY})
  @ValidateNested()
  @Type(() => CreditCardRequestDto)
  card: CreditCardRequestDto;

}
