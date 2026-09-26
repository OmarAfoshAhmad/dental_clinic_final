import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class QueueService {
  constructor(private readonly prisma: PrismaService) {}
  list(){ return this.prisma.queueEntry.findMany({ include:{ patient:{ include:{ clinic:true, doctor:true } }, clinic:true, doctor:true }, orderBy:{ arrivedAt:'asc' }, take:50 }); }
}
