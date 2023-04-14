import { ApiProperty } from '@nestjs/swagger';
import { Comment } from 'src/@types/Comment.type';
import { Item } from 'src/@types/Item.type';
import { User } from 'src/user/entities/user.entity';

export class CreateBuyOrderDto {
  @ApiProperty({
    title: 'Items list',
    description: 'Items list of the buy order',
    type: Array<Item>,
  })
  items: Item[];

  @ApiProperty({
    title: 'Create user',
    description: 'Create user of the buy order',
    type: User,
  })
  createUser: User;

  @ApiProperty({
    title: 'Manager responsible',
    description: 'Manager responsible of the buy order',
    type: User,
  })
  managerResponsible: User;

  @ApiProperty({
    title: 'Comments',
    description: 'Comments of the buy order',
    type: Array<Comment>,
  })
  comments: Comment[];
}
