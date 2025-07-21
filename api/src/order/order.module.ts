import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { OrderUpdatesGateway } from '../websocket/order-updates.gateway';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [PrismaModule, forwardRef(() => WebsocketModule)],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: 'OrderUpdatesGateway',
      useFactory: (gateway: OrderUpdatesGateway) => gateway,
      inject: [OrderUpdatesGateway],
    },
  ],
  exports: [OrderService],
})
export class OrderModule {}
