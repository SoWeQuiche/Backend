import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class MailDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  mail: string;
}
