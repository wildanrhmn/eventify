import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      const isConnected = this.dataSource.isInitialized;
      if (isConnected) {
        this.logger.log('Database connection established successfully');
      } else {
        this.logger.error('Database connection failed');
      }
    } catch (error) {
      this.logger.error('Error checking database connection:', error);
    }
  }
}
