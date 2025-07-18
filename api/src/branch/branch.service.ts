import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BranchService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Prisma.BranchGetPayload<{}>[]> {
    return this.prisma.branch.findMany({
      include: {
        desks: true,
      },
    });
  }

  async findOne(id: string): Promise<Prisma.BranchGetPayload<{ include: { desks: true } }>> {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        desks: true,
      },
    });

    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }

    return branch;
  }

  async create(createBranchDto: CreateBranchDto): Promise<Prisma.BranchGetPayload<{}>> {
    return this.prisma.branch.create({
      data: createBranchDto,
    });
  }

  async update(id: string, updateBranchDto: UpdateBranchDto): Promise<Prisma.BranchGetPayload<{}>> {
    // Check if branch exists
    await this.findOne(id);

    return this.prisma.branch.update({
      where: { id },
      data: updateBranchDto,
    });
  }

  async remove(id: string): Promise<void> {
    const branch = await this.findOne(id);
    
    // Check if branch has desks
    if (branch.desks && branch.desks.length > 0) {
      throw new ConflictException('Cannot delete branch with associated desks');
    }
    
    await this.prisma.branch.delete({
      where: { id },
    });
  }
}
