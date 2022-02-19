import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { MailDTO } from './mail.dto';

export class LoginDTO extends MailDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
