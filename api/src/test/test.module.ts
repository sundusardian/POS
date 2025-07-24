import { Module, forwardRef } from '@nestjs/common';
import { TestController } from './test.controller';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [forwardRef(() => OrderModule)],
  controllers: [TestController],
  exports: [],
})
export class TestModule {}
