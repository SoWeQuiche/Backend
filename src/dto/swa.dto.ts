import { ApiProperty } from '@nestjs/swagger';
// import { IsEmail, IsNotEmpty } from 'class-validator';

class SwaUserNameDTO {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

class SwaUserDTO {
  @ApiProperty()
  name: SwaUserNameDTO;
  @ApiProperty()
  email: string;
}

class SwaAuthorizationDTO {
  @ApiProperty()
  // // @IsNotEmpty()
  code: string;

  @ApiProperty()
  // @IsNotEmpty()
  id_token: string;
}

export class SwaDTO {
  @ApiProperty()
  authorization: SwaAuthorizationDTO;

  @ApiProperty()
  user: SwaUserDTO;
}
