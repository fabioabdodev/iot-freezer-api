import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]{3,50}$/)
  id: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]{3,50}$/)
  clientId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minTemperature?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxTemperature?: number;
}
