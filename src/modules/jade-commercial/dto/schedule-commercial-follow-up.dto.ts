import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ScheduleCommercialFollowUpDto {
  @IsString()
  @IsNotEmpty()
  leadPhone: string;

  @IsOptional()
  @IsString()
  leadName?: string;

  @IsOptional()
  @IsString()
  interestTopic?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsDateString()
  nextContactAt?: string;

  @IsOptional()
  @IsString()
  offerType?: string;

  @IsOptional()
  @IsString()
  followUpStage?: string;
}
