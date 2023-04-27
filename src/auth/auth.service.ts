import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in-dto.dto';
import { JwtService } from '@nestjs/jwt';
import { authConstants } from './auth.constants';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  generateRefreshToken(): { randomHash: string; newTempHashExpiresAt: Date } {
    const randomHash = randomBytes(64).toString('base64');
    const newTempHashExpiresAt = new Date();
    newTempHashExpiresAt.setDate(newTempHashExpiresAt.getDate() + 5);

    return { randomHash, newTempHashExpiresAt };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findByEmail(signInDto.email);
    if (!user)
      throw new InternalServerErrorException(
        `User with email '${signInDto.email}' not found.`,
      );
    const passwordIsMatch = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!passwordIsMatch)
      throw new UnauthorizedException('Invalid credentials, please try again.');

    const { randomHash, newTempHashExpiresAt } = this.generateRefreshToken();

    user.refreshToken = randomHash;
    user.refreshTokenExpiresAt = newTempHashExpiresAt;

    await user.save();

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
      isActive: user.isActive,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: randomHash,
      payload,
    };
  }

  async validateJWTToken(token: string) {
    try {
      const verify = await this.jwtService.verify(token);
      return verify;
    } catch (error) {
      throw new UnauthorizedException({ ...error });
    }
  }

  async validateRefreshToken(jwtToken: string, refreshToken: string) {
    try {
      const verify = await this.jwtService.verify(jwtToken);
      const user = await this.userService.findOne(verify.id);

      if (!user) throw new UnauthorizedException();
      if (user.refreshToken !== refreshToken) throw new UnauthorizedException();

      const refreshTokenValidate = new Date(user.refreshTokenExpiresAt);
      const now = new Date();

      if (now > refreshTokenValidate) throw new UnauthorizedException();

      const { randomHash, newTempHashExpiresAt } = this.generateRefreshToken();
      user.refreshToken = randomHash;
      user.refreshTokenExpiresAt = newTempHashExpiresAt;
      await user.save();

      const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
        isActive: user.isActive,
      };

      return {
        access_token: this.jwtService.sign(payload),
        refresh_token: randomHash,
      };
    } catch (error) {
      throw new UnauthorizedException({ ...error });
    }
  }
}
