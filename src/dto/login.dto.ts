import { ApiProperty } from '@nestjs/swagger';
// import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @ApiProperty()
  // @IsNotEmpty()
  // @IsEmail()
  mail: string;

  @ApiProperty()
  // @IsNotEmpty()
  password: string;
}
