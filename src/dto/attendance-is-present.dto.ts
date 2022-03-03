import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class DefineAttendancePresenceDTO {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isPresent: boolean;
}
