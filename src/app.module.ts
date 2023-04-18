import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BuyOrdersModule } from './buy-orders/buy-orders.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/buy-orders'),
    AuthModule,
    UserModule,
    BuyOrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
