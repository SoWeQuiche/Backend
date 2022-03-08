import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, ValidateIf } from 'class-validator';

export class TimeSlotDTO {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  @ValidateIf((val) => new Date(val.endDate) > new Date(val.startDate))
  startDate: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  @ValidateIf((val) => new Date(val.endDate) < new Date(val.startDate))
  endDate: string;
}
