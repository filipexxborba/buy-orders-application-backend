import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BuyOrdersModule } from './buy-orders/buy-orders.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot('mongodb://localhost/buy-orders'),
    BuyOrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
