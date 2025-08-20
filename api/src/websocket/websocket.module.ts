import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderUpdatesGateway } from './order-updates.gateway';
import { InventoryUpdatesGateway } from './inventory-updates.gateway';
import { StaffUpdatesGateway } from './staff-updates.gateway';
import { BranchUpdatesGateway } from './branch-updates.gateway';
import { DashboardUpdatesGateway } from './dashboard-updates.gateway';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'dev_secret_key_change_in_production',
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') || '1d' },
      }),
    }),
  ],
  providers: [
    OrderUpdatesGateway,
    InventoryUpdatesGateway,
    StaffUpdatesGateway,
    BranchUpdatesGateway,
    DashboardUpdatesGateway,
  ],
  exports: [
    OrderUpdatesGateway,
    InventoryUpdatesGateway,
    StaffUpdatesGateway,
    BranchUpdatesGateway,
    DashboardUpdatesGateway,
  ],
})
export class WebsocketModule {}
