import { UserRole } from 'src/@types/UserRoleEnum.type';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  imageUri: string;
}
