import { User } from 'src/user/entities/user.entity';

export class CreateNewCommentDto {
  content: string;
  createUser: User;
}
