import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Comment } from 'src/@types/Comment.type';
import { Item } from 'src/@types/Item.type';
import { User } from 'src/user/entities/user.entity';

@Schema()
export class BuyOrder {
  @Prop()
  isApproved: boolean;

  @Prop()
  items: Item[];

  @Prop()
  totalPrice: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  createUser: User;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  managerResponsible: User;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  comments: Comment[];

  @Prop()
  isActive: boolean;
}

export const BuyOrderSchema = SchemaFactory.createForClass(BuyOrder);
