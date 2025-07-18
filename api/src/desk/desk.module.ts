import { Module } from '@nestjs/common';
import { DeskService } from './desk.service';
import { DeskController } from './desk.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BranchModule } from '../branch/branch.module';
import { QRCodeGenerationService } from './qrcode.service';

@Module({
  imports: [PrismaModule, BranchModule],
  controllers: [DeskController],
  providers: [DeskService, QRCodeGenerationService],
  exports: [DeskService],
})
export class DeskModule {}
