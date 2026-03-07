import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsNotEmpty, Matches } from 'class-validator';

export class UpdateDeviceDto {
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
