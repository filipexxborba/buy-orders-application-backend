import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../../@types/UserRoleEnum.type';

@Schema()
export class User {

  @Prop()
  name: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    enum: Object.values(UserRole),
  })
  role: UserRole;

  @Prop()
  imageUri: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isActive: boolean;

  @Prop()
  refreshToken: string;

  @Prop()
  refreshTokenExpiresAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
