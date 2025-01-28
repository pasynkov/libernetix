import { IsEmail, IsInt, IsNumber, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';
import { ValidationErrors } from '../errors/validation.errors';
import { Expose } from 'class-transformer';

export class ClientRequestDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsInt()
  @Min(0, { message: ValidationErrors.INVALID_SCREEN_WIDTH })
  @Expose({ name: 'screen_width' })
  screenWidth?: number = 1920;

  @IsOptional()
  @IsInt()
  @Min(0, { message: ValidationErrors.INVALID_SCREEN_HEIGHT })
  @Expose({name: 'screen_height'})
  screenHeight?: number = 1080;

  @IsOptional()
  @IsString()
  @Length(5,5)
  @Matches('^[a-z]{2}-[A-Z]{2}$')
  language?: string;

  @IsOptional()
  @IsNumber()
  @Min(-720)
  @Max(840)
  @Expose({name: 'utf_offset'})
  utcOffset?: number;

  @IsString()
  @Length(1,100)
  success_route: string;

  @IsString()
  @Length(1,100)
  failed_route: string;
}
