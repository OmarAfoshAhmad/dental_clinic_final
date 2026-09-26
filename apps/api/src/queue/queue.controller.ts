import { Body,Controller,Get,Post } from '@nestjs/common';
import { QueueService } from './queue.service.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { sendQueueSchema,type SendQueueInput } from './queue.schema.js';
@Controller('queue')
export class QueueController{constructor(private readonly queue:QueueService){}@Get()list(){return this.queue.list()}@Post()send(@Body(new ZodValidationPipe(sendQueueSchema))input:SendQueueInput){return this.queue.send(input)}}
