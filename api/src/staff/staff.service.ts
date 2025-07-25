import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    role: 'ADMIN' | 'MANAGER',
  ): Promise<Prisma.UserGetPayload<{}>[]> {
    const condition: Prisma.UserWhereInput = {
      role: Role.STAFF,
    };

    if (role === 'ADMIN') {
      condition.role = {
        in: [Role.ADMIN, Role.MANAGER, Role.STAFF],
      };
    }

    return this.prisma.user.findMany({
      where: condition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        primaryBranch: true,
      },
    });
  }

  async findOne(id: string): Promise<Prisma.UserGetPayload<{}>> {
    const staff = await this.prisma.user.findUnique({
      where: {
        id,
        role: Role.STAFF,
      },
      include: {
        primaryBranch: true,
      },
    });

    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }

    return staff;
  }

  async create(
    createStaffDto: CreateStaffDto,
  ): Promise<Prisma.UserGetPayload<{}>> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createStaffDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with email ${createStaffDto.email} already exists`,
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createStaffDto.password, 10);

    // Create the staff user
    return this.prisma.user.create({
      data: {
        name: createStaffDto.name,
        email: createStaffDto.email,
        password: hashedPassword,
        role: createStaffDto.role ? (Role[createStaffDto.role as keyof typeof Role] || Role.STAFF) : Role.STAFF,
        isActive: createStaffDto.isActive ?? true,
        ...(createStaffDto.primaryBranchId ? {
          primaryBranch: {
            connect: {
              id: createStaffDto.primaryBranchId,
            },
          },
        } : {}),
      },
    });
  }

  async update(
    id: string,
    updateStaffDto: UpdateStaffDto,
  ): Promise<Prisma.UserGetPayload<{}>> {
    // Check if staff exists
    await this.findOne(id);

    // If email is being updated, check if it already exists
    if (updateStaffDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateStaffDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(
          `User with email ${updateStaffDto.email} already exists`,
        );
      }
    }

    // Prepare update data
    const updateData: Prisma.UserUpdateInput = {
      name: updateStaffDto.name,
      email: updateStaffDto.email,
      isActive: updateStaffDto.isActive,
      primaryBranch: {
        connect: {
          id: updateStaffDto.primaryBranchId,
        },
      },
    };

    // If password is provided, hash it
    if (updateStaffDto.password) {
      updateData.password = await bcrypt.hash(updateStaffDto.password, 10);
    }

    // Update the staff user
    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<void> {
    // Check if staff exists
    await this.findOne(id);

    // Delete the staff user
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
