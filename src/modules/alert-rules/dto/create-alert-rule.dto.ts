import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateAlertRuleDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]{3,50}$/)
  clientId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]{3,50}$/)
  deviceId?: string;

  @IsString()
  @IsNotEmpty()
  sensorType: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minValue?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxValue?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  cooldownMinutes?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  toleranceMinutes?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  enabled?: boolean;
}
