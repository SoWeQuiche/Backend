import { ApiProperty } from '@nestjs/swagger';
// import { IsEmail, IsNotEmpty } from 'class-validator';

export class SwaDto {
  @ApiProperty()
  // @IsNotEmpty()
  code: string;

  @ApiProperty()
  // @IsNotEmpty()
  id_token: string;
}
