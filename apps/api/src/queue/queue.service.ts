import { Injectable,NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { SendQueueInput } from './queue.schema.js';
@Injectable()
export class QueueService{constructor(private readonly prisma:PrismaService){}list(){return this.prisma.queueEntry.findMany({include:{patient:{include:{clinic:true,doctor:true}},clinic:true,doctor:true},orderBy:{arrivedAt:'asc'},take:50})}
 async send(input:SendQueueInput){const p=await this.prisma.patient.findUnique({where:{id:input.patientId}});if(!p)throw new NotFoundException('Patient not found');return this.prisma.queueEntry.create({data:{patientId:p.id,clinicId:p.clinicId,doctorId:p.doctorId,status:input.status},include:{patient:{include:{clinic:true,doctor:true}},clinic:true,doctor:true}})}
}
