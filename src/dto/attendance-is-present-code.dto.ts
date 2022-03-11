import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class DefineAttendancePresenceCodeDTO {
  @ApiProperty()
  @IsString()
  @Length(6, 6)
  @IsNotEmpty()
  code: string;
}
