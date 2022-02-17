import { ApiProperty } from '@nestjs/swagger';

export class SwaIdToken {
  @ApiProperty()
  iss: string;

  @ApiProperty()
  aud: string;

  @ApiProperty()
  exp: number;

  @ApiProperty()
  iat: number;

  @ApiProperty()
  sub: string;

  @ApiProperty()
  c_hash: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  email_verified: string;

  @ApiProperty()
  auth_time: number;

  @ApiProperty()
  nonce_supported: boolean;
}
