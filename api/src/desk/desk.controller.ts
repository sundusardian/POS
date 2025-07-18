import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { DeskService } from './desk.service';
import { CreateDeskDto } from './dto/create-desk.dto';
import { UpdateDeskDto } from './dto/update-desk.dto';

@Controller('desks')
export class DeskController {
  constructor(private readonly deskService: DeskService) {}

  @Get()
  async findAll() {
    return this.deskService.findAll();
  }

  @Get('branch/:branchId')
  async findByBranch(@Param('branchId') branchId: string) {
    return this.deskService.findByBranch(branchId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.deskService.findOne(id);
  }

  @Post()
  async create(@Body() createDeskDto: CreateDeskDto) {
    return this.deskService.create(createDeskDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDeskDto: UpdateDeskDto) {
    return this.deskService.update(id, updateDeskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.deskService.remove(id);
  }

  @Post(':id/regenerate-qrcode')
  async regenerateQRCode(@Param('id') id: string) {
    return this.deskService.regenerateQRCode(id);
  }
}
