import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SwaUserNameDTO {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;
}

class SwaUserDTO {
  @ApiProperty()
  @Type(() => SwaUserNameDTO)
  @ValidateNested()
  name: SwaUserNameDTO;

  @ApiProperty()
  @IsEmail()
  email: string;
}

class SwaAuthorizationDTO {
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  id_token: string;
}

export class SwaDTO {
  @ApiProperty()
  @Type(() => SwaAuthorizationDTO)
  @ValidateNested()
  authorization: SwaAuthorizationDTO;

  @ApiProperty()
  @Type(() => SwaUserDTO)
  @ValidateNested()
  user: SwaUserDTO;
}
