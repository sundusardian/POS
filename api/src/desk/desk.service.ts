import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeskDto } from './dto/create-desk.dto';
import { UpdateDeskDto } from './dto/update-desk.dto';
import { Prisma } from '@prisma/client';
import { BranchService } from '../branch/branch.service';
import { QRCodeGenerationService } from './qrcode.service';

@Injectable()
export class DeskService {
  constructor(
    private prisma: PrismaService,
    private branchService: BranchService,
    private qrCodeService: QRCodeGenerationService,
  ) {}

  async findAll(): Promise<Prisma.DeskGetPayload<{ include: { branch: true } }>[]> {
    return this.prisma.desk.findMany({
      include: {
        branch: true,
      },
    });
  }

  async findByBranch(branchId: string): Promise<Prisma.DeskGetPayload<{ include: { branch: true } }>[]> {
    // Verify branch exists
    await this.branchService.findOne(branchId);
    
    return this.prisma.desk.findMany({
      where: { branchId },
      include: {
        branch: true,
      },
    });
  }

  async findOne(id: string): Promise<Prisma.DeskGetPayload<{ include: { branch: true } }>> {
    const desk = await this.prisma.desk.findUnique({
      where: { id },
      include: {
        branch: true,
      },
    });

    if (!desk) {
      throw new NotFoundException(`Desk with ID ${id} not found`);
    }

    return desk;
  }

  async create(createDeskDto: CreateDeskDto): Promise<Prisma.DeskGetPayload<{ include: { branch: true } }>> {
    // Verify branch exists
    await this.branchService.findOne(createDeskDto.branchId);
    
    // Generate QR code if not provided
    if (!createDeskDto.qrCode) {
      const qrCodeData = `desk:${createDeskDto.number}:branch:${createDeskDto.branchId}`;
      createDeskDto.qrCode = await this.qrCodeService.generateQRCode(qrCodeData);
    }

    return this.prisma.desk.create({
      data: createDeskDto,
      include: {
        branch: true,
      },
    });
  }

  async update(id: string, updateDeskDto: UpdateDeskDto): Promise<Prisma.DeskGetPayload<{ include: { branch: true } }>> {
    // Check if desk exists
    await this.findOne(id);
    
    // If branch ID is being updated, verify the new branch exists
    if (updateDeskDto.branchId) {
      await this.branchService.findOne(updateDeskDto.branchId);
    }

    // If desk number is being updated, regenerate QR code
    if (updateDeskDto.number) {
      const desk = await this.findOne(id);
      const qrCodeData = `desk:${updateDeskDto.number}:branch:${updateDeskDto.branchId || desk.branchId}`;
      updateDeskDto.qrCode = await this.qrCodeService.generateQRCode(qrCodeData);
    }

    return this.prisma.desk.update({
      where: { id },
      data: updateDeskDto,
      include: {
        branch: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    // Check if desk exists
    await this.findOne(id);
    
    await this.prisma.desk.delete({
      where: { id },
    });
  }

  async regenerateQRCode(id: string): Promise<Prisma.DeskGetPayload<{ include: { branch: true } }>> {
    const desk = await this.findOne(id);
    const qrCodeData = `desk:${desk.number}:branch:${desk.branchId}`;
    const qrCode = await this.qrCodeService.generateQRCode(qrCodeData);
    
    return this.prisma.desk.update({
      where: { id },
      data: { qrCode },
      include: {
        branch: true,
      },
    });
  }
}
