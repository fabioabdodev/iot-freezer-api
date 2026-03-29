import { IsNotEmpty, IsString } from 'class-validator';

export class GetCrossSellOpportunityDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;
}
