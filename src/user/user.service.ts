import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userConstants } from './user.constants';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto) {
    // Verify email is unique
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user)
      throw new InternalServerErrorException(
        `Email: '${createUserDto.email}' is already in use.`,
      );

    const hashPassword = await bcrypt.hash(
      createUserDto.password,
      userConstants.saltOrRounds,
    );

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    });

    await newUser.save();
    return newUser;
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findOne(id: string) {
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // verify id is valid
    const user = await this.userModel.findById(id);
    if (!user)
      throw new InternalServerErrorException(`User with id '${id}' not found.`);

    // verify in updateUserDto has password to bcrypt again
    if (updateUserDto.password)
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        userConstants.saltOrRounds,
      );

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );

    return updatedUser;
  }

  async desactive(id: string) {
    // verify id is valid
    const user = await this.userModel.findById(id);
    if (!user)
      throw new InternalServerErrorException(`User with id '${id}' not found.`);

    user.isActive = false;
    await user.save();
    return user;
  }

  async remove(id: string) {
    // verify id is valid
    const user = await this.userModel.findById(id);
    if (!user)
      throw new InternalServerErrorException(`User with id '${id}' not found.`);

    await this.userModel.findByIdAndRemove(id);
    return user;
  }
}
