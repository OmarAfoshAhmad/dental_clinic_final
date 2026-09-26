import { Controller, Get } from '@nestjs/common';
import { QueueService } from './queue.service.js';

@Controller('queue')
export class QueueController {
  constructor(private readonly queue: QueueService) {}
  @Get() list(){ return this.queue.list(); }
}
