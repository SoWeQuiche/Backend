import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NameDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
