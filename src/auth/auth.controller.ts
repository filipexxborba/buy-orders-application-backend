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
      .cookie('jwt-orders-auth-refresh-token', data.refresh_token)
      .send(data);
  }

  @Public()
  @Post('validate')
  async validate(@Body() tokenValidateDto: TokenValidateDto) {
    return this.authService.validateJWTToken(tokenValidateDto.token);
  }

  @Public()
  @Post('refresh-token')
  async validateRefreshToken(
    @Body() tokenValidateDto: TokenValidateDto,
    @Res() response,
  ) {
    const data = await this.authService.validateRefreshToken(
      tokenValidateDto.token,
      tokenValidateDto.refreshToken,
    );
    response
      .status(200)
      .cookie('jwt-orders-auth-token', data.access_token)
      .cookie('jwt-orders-auth-refresh-token', data.refresh_token)
      .send(data);
  }

  @Public()
  @Get('logout')
  async logout(@Res() response) {
    response
      .status(200)
      .cookie('jwt-orders-auth-token', '0')
      .cookie('jwt-orders-auth-refresh-token', '0')
      .send({ message: 'Logged out successfully' });
  }
}
