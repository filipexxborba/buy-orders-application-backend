import { ApiProperty } from '@nestjs/swagger';

export class TokenValidateDto {
  @ApiProperty({
    title: 'Token',
    type: String,
  })
  token: string;
}
