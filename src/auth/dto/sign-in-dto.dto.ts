import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    title: 'E-mail',
    type: String,
  })
  email: string;

  @ApiProperty({
    title: 'Password',
    type: String,
  })
  password: string;
}
