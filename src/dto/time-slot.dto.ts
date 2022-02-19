import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class TimeSlotDTO {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}
