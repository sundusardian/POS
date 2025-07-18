import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '../auth/enums/role.enum';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Roles(Role.ADMIN, Role.MANAGER)
  @Get()
  async findAll() {
    return this.staffService.findAll();
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post()
  async create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(id, updateStaffDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.staffService.remove(id);
  }
}
