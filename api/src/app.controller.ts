import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}



  @Get('websocket-test')
  @Public()
  getWebSocketTest(@Res() res: Response) {
    return res.sendFile(join(__dirname, '../public/websocket-test.html'));
  }

  @Get('test')
  @Public()
  getTest() {
    return {
      message: 'POS API is running!',
      timestamp: new Date().toISOString(),
      endpoints: {
        api: '/api/docs',
        websocketTest: '/websocket-test.html',
        swagger: '/api/docs'
      }
    };
  }
}
