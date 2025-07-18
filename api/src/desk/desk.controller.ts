import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '../auth/enums/role.enum';
import { DeskService } from './desk.service';
import { CreateDeskDto } from './dto/create-desk.dto';
import { UpdateDeskDto } from './dto/update-desk.dto';

@Controller('desks')
export class DeskController {
  constructor(private readonly deskService: DeskService) {}

  @Public()
  @Get()
  async findAll() {
    return this.deskService.findAll();
  }

  @Get('branch/:branchId')
  async findByBranch(@Param('branchId') branchId: string) {
    return this.deskService.findByBranch(branchId);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.deskService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post()
  async create(@Body() createDeskDto: CreateDeskDto) {
    return this.deskService.create(createDeskDto);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDeskDto: UpdateDeskDto) {
    return this.deskService.update(id, updateDeskDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.deskService.remove(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post(':id/regenerate-qr')
  async regenerateQrCode(@Param('id') id: string) {
    return this.deskService.regenerateQRCode(id);
  }
}
