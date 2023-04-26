import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in-dto.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}


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

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
      isActive: user.isActive,
    };

    return { access_token: this.jwtService.sign(payload) };
  }
}
