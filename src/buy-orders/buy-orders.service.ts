import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateBuyOrderDto } from './dto/create-buy-order.dto';
import { UpdateBuyOrderDto } from './dto/update-buy-order.dto';
import { BuyOrder } from './entities/buy-order.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { getTotalPrice } from './utils/getTotalPrice';
import { CreateNewCommentDto } from './dto/create-new-comment.dto';

@Injectable()
export class BuyOrdersService {
  constructor(
    @InjectModel(BuyOrder.name) private buyOrderModel: Model<BuyOrder>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createBuyOrderDto: CreateBuyOrderDto) {
    // Verify if createUser exists
    const createUser = this.userModel.findOne({
      email: createBuyOrderDto.createUser.email,
    });
    if (!createUser)
      throw new InternalServerErrorException(
        `User with email '${createBuyOrderDto.createUser.email}' not found.`,
      );

    // Verify if managerResponsible exists

    const managerResponsible = this.userModel.findOne({
      email: createBuyOrderDto.managerResponsible.email,
    });
    if (!managerResponsible)
      throw new InternalServerErrorException(
        `User with email '${createBuyOrderDto.managerResponsible.email}' not found.`,
      );

    const newBuyOrder = new this.buyOrderModel({
      ...createBuyOrderDto,
      updatedAt: new Date(),
      createdAt: new Date(),
      isApproved: false,
      totalPrice: getTotalPrice(createBuyOrderDto.items),
      createUser: createUser,
      managerResponsible: managerResponsible,
      isActive: true,
    });

    await newBuyOrder.save();
    return newBuyOrder;
  }

  async findAll() {
    return await this.buyOrderModel.find().exec();
  }

  async findOne(id: string) {
    return await this.buyOrderModel.findById(id).exec();
  }

  async update(id: string, updateBuyOrderDto: UpdateBuyOrderDto) {
    // Verify if id exists
    const buyOrder = await this.buyOrderModel.findById(id);
    if (!buyOrder)
      throw new InternalServerErrorException(
        `BuyOrder with id '${id}' not found.`,
      );

    // Verify if userCreater is the same of updateBuyOrderDto
    const userCreater = await this.userModel.findById(
      updateBuyOrderDto.createUser,
    );
    if (!userCreater)
      throw new InternalServerErrorException(
        `User with email '${updateBuyOrderDto.createUser.email}' not found.`,
      );

    if (buyOrder.createUser !== userCreater)
      throw new NotAcceptableException(
        `The current user is not the creator of this buyOrder.`,
      );

    // Update the buyOrder
    const updatedBuyOrder = await this.buyOrderModel.findByIdAndUpdate(
      id,
      updateBuyOrderDto,
      { new: true },
    );
    return updatedBuyOrder;
  }

  async remove(id: string) {
    // Verify if id is valid
    const buyOrder = await this.buyOrderModel.findById(id);
    if (!buyOrder)
      throw new InternalServerErrorException(
        `BuyOrder with id '${id}' not found.`,
      );

    // Verify if userCreater is the same of updateBuyOrderDto
    const userCreater = await this.userModel.findById(buyOrder.createUser);
    if (!userCreater)
      throw new InternalServerErrorException(
        `User with email '${buyOrder.createUser.email}' not found.`,
      );

    if (buyOrder.createUser !== userCreater)
      throw new NotAcceptableException(
        `The current user is not the creator of this buyOrder.`,
      );

    // Delete the buyOrder
    await this.buyOrderModel.findByIdAndDelete(id);
    return buyOrder;
  }

  async desactive(id: string) {
    // Verify if id is valid
    const buyOrder = await this.buyOrderModel.findById(id);
    if (!buyOrder)
      throw new InternalServerErrorException(
        `BuyOrder with id '${id}' not found.`,
      );

    buyOrder.isActive = false;
    buyOrder.updatedAt = new Date();
    await buyOrder.save();
    return buyOrder;
  }

  async addNewComment(id: string, createNewCommentDto: CreateNewCommentDto) {
    // Verify if id is valid
    const buyOrder = await this.buyOrderModel.findById(id);
    if (!buyOrder)
      throw new InternalServerErrorException(
        `BuyOrder with id '${id}' not found.`,
      );

    // Add the new comment in to comments list in buy order
    buyOrder.comments.push({ ...createNewCommentDto, createdAt: new Date() });
    buyOrder.updatedAt = new Date();
    await buyOrder.save();
    return buyOrder;
  }

  async approve(id: string, user: User) {
    // Verify if id is valid
    const buyOrder = await this.buyOrderModel.findById(id);
    if (!buyOrder)
      throw new InternalServerErrorException(
        `BuyOrder with id '${id}' not found.`,
      );

    // Verify if user userReceived is the same of the manager responsible of buy order
    const userReceived = await this.userModel.findOne({ email: user.email });
    if (!userReceived)
      throw new InternalServerErrorException(
        `User with email '${user.email}' not found.`,
      );

    if (buyOrder.managerResponsible !== userReceived)
      throw new NotAcceptableException(
        `The current user is not the manager responsible of this buyOrder.`,
      );

    buyOrder.isApproved = true;
    buyOrder.updatedAt = new Date();
    await buyOrder.save();
    return buyOrder;
  }
}
