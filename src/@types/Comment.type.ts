import { User } from 'src/user/entities/user.entity';

export type Comment = {
  content: string;
  createdAt: Date;
  createUser: User;
};
