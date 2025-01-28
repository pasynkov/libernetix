import { IsEmail, IsInt, IsOptional, Min } from 'class-validator';
import { ValidationErrors } from '../errors/validation.errors';

export class ClientRequestDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsInt()
  @Min(0, { message: ValidationErrors.INVALID_SCREEN_WIDTH })
  screen_width?: number = 1920;

  @IsOptional()
  @IsInt()
  @Min(0, { message: ValidationErrors.INVALID_SCREEN_HEIGHT })
  screen_height?: number = 1080;
}
