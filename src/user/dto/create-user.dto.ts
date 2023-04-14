import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/@types/UserRoleEnum.type';

export class CreateUserDto {
  @ApiProperty({
    title: 'Name',
    description: 'Name of the user',
    type: String,
  })
  name: string;

  @ApiProperty({
    title: 'Email',
    description: 'Email of the user',
    type: String,
  })
  email: string;

  @ApiProperty({
    title: 'Password',
    description: 'Password of the user',
    type: String,
  })
  password: string;

  @ApiProperty({
    title: 'Role',
    description: 'Role of the user',
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty({
    title: 'Image URL',
    description: 'URL image of the user',
    type: String,
  })
  imageUri: string;
}
