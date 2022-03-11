import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class DefineAttendancePresenceQrCodeDTO {
  @ApiProperty()
  @IsString()
  @Length(1, 32)
  @IsNotEmpty()
  code: string;
}
