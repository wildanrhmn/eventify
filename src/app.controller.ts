import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  async checkConnection(): Promise<string> {
    try {
      await this.appService.onModuleInit();
      return 'Database connection established successfully';
    } catch (error) {
      throw new Error('Failed to establish database connection: ' + error.message);
    }
  }
}
