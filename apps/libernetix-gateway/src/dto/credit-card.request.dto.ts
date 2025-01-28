import {
  IsBooleanString,
  IsCreditCard, IsDate, IsDefined,
  IsNotEmpty, IsNotEmptyObject,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches, Max, Min, ValidateNested,
} from 'class-validator';
import { ValidationErrors } from '../errors/validation.errors';
import { Expose, plainToClass, Transform, Type } from 'class-transformer';

export class CreditCardExpiresDto {


  @IsNumberString()
  @IsNotEmpty()
  @Length(2, 2, { message: ValidationErrors.INVALID_EXPIRATION_DATE })
  mm: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(2, 2, { message: ValidationErrors.INVALID_EXPIRATION_DATE })
  yy: string;

  @IsDate({ message: ValidationErrors.INVALID_EXPIRATION_DATE })
  @IsNotEmpty({ message: ValidationErrors.INVALID_EXPIRATION_DATE })
  get expirationDate(): Date {
    const date = new Date(0);
    date.setFullYear(2000 + parseInt(this.yy, 10));
    date.setMonth(parseInt(this.mm, 10) - 1);
    return date > new Date() ? date : undefined;
  }

}

export class CreditCardRequestDto {

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z' .-]+$/, { message: ValidationErrors.INVALID_CARDHOLDER_NAME })
  @Length(1, 45, { message: ValidationErrors.INVALID_CARDHOLDER_NAME })
  @Expose({name: 'cardholder_name'})
  cardholderName: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(16, 19, { message: ValidationErrors.INVALID_CARD_NUMBER })
  @Expose({name: 'card_number'})
  cardNumber: string;

  @IsDefined({ message: ValidationErrors.INVALID_EXPIRATION_DATE})
  @Transform(({ value }) => {
    if (!value || typeof value !== 'string') {
      return undefined;
    }
    const [mm, yy] = value.split('/');
    return plainToClass(CreditCardExpiresDto, {mm, yy});
  })
  @ValidateNested()
  @Type(() => CreditCardExpiresDto)
  expires: CreditCardExpiresDto;

  @IsNumberString()
  @IsNotEmpty()
  @Length(3, 4, { message: ValidationErrors.INVALID_CVC })
  cvc: string;

  @IsOptional()
  @IsString()
  @IsBooleanString()
  @Transform(({ value }) => value === 'true' ? 'on' : undefined)
  @Expose({ name: 'remember_card' })
  remember?: string;

}
