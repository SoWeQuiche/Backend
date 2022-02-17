import { ApiProperty } from '@nestjs/swagger';
// import { IsEmail, IsNotEmpty } from 'class-validator';

export class SwaDTO {
  @ApiProperty()
  // // @IsNotEmpty()
  code: string;

  @ApiProperty()
  // @IsNotEmpty()
  id_token: string;

  @ApiProperty()
  // @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  // @IsNotEmpty()
  lastname: string;
}
