import { ApiProperty } from '@nestjs/swagger';

export class TokenValidateDto {
  @ApiProperty({
    title: 'Token',
    type: String,
  })
  token: string;

  @ApiProperty({
    title: 'Refresh Token',
    type: String,
  })
  refreshToken?: string;
}
