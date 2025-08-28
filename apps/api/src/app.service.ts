import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Project Starter Kit API - Ready to build amazing things!';
  }
}
