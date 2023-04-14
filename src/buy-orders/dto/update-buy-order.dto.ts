import { PartialType } from '@nestjs/mapped-types';
import { CreateBuyOrderDto } from './create-buy-order.dto';

export class UpdateBuyOrderDto extends PartialType(CreateBuyOrderDto) {}
