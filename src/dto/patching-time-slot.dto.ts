import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { TimeSlotDTO } from './time-slot.dto';

export class PatchingTimeSlotDTO extends TimeSlotDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  groupdId: string;
}
