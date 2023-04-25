import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { BuyOrdersService } from './buy-orders.service';
import { CreateBuyOrderDto } from './dto/create-buy-order.dto';
import { UpdateBuyOrderDto } from './dto/update-buy-order.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesUploadDto } from './dto/file-upload-dto.dto';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './utils/filesManipulations';

@ApiBearerAuth()
@ApiTags('Buy Orders')
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

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FilesUploadDto,
  })
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    return response;
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
