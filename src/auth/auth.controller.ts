import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in-dto.dto';
import { Public } from './publicKey.metadata';
import { TokenValidateDto } from './dto/token-validate-dto.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res() response) {
    const data = await this.authService.signIn(signInDto);
    response
      .status(200)
      .cookie('jwt-orders-auth-token', data.access_token)
      .send(data);
  }

  @Public()
  @Post('validate')
  async validate(@Body() tokenValidateDto: TokenValidateDto) {
    return this.authService.validate(tokenValidateDto.token);
  }
}
