import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApplySolutionDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  solutionKey: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsBoolean()
  @IsOptional()
  includeRecommended?: boolean;
}
