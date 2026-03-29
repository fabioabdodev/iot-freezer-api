import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpsertSalesLeadDto {
  @IsString()
  @IsNotEmpty()
  leadPhone: string;

  @IsOptional()
  @IsString()
  leadName?: string;

  @IsOptional()
  @IsBoolean()
  isClient?: boolean;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  interestTopic?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
