import { Module } from '@nestjs/common';
import { BuyOrdersService } from './buy-orders.service';
import { BuyOrdersController } from './buy-orders.controller';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { BuyOrder, BuyOrderSchema } from './entities/buy-order.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: BuyOrder.name, schema: BuyOrderSchema },
    ]),
  ],
  controllers: [BuyOrdersController],
  providers: [BuyOrdersService],
})
export class BuyOrdersModule {}
