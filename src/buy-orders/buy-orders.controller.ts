import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BuyOrdersService } from './buy-orders.service';
import { CreateBuyOrderDto } from './dto/create-buy-order.dto';
import { UpdateBuyOrderDto } from './dto/update-buy-order.dto';

@Controller('buy-orders')
export class BuyOrdersController {
  constructor(private readonly buyOrdersService: BuyOrdersService) {}

  @Post()
  create(@Body() createBuyOrderDto: CreateBuyOrderDto) {
    return this.buyOrdersService.create(createBuyOrderDto);
  }

  @Get()
  findAll() {
    return this.buyOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buyOrdersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBuyOrderDto: UpdateBuyOrderDto,
  ) {
    return this.buyOrdersService.update(id, updateBuyOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buyOrdersService.remove(id);
  }
}
