import { ApiProperty } from '@nestjs/swagger';
// import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateOrganizationDTO {
  @ApiProperty()
  // @IsNotEmpty()
  // @IsEmail()
  name: string;
}
