// import { ApiProperty } from '@nestjs/swagger';
// import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDTO {
  // @ApiProperty()
  // @IsNotEmpty()
  // @IsEmail()
  mail: string;
  firstname: string;
  lastname: string;

  // @ApiProperty()
  // @IsNotEmpty()
  password: string;
}
