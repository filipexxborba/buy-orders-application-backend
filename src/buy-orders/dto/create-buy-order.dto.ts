import { Comment } from 'src/@types/Comment.type';
import { Item } from 'src/@types/Item.type';
import { User } from 'src/user/entities/user.entity';

export class CreateBuyOrderDto {
  items: Item[];
  createUser: User;
  managerResponsible: User;
  comments: Comment[];
}
