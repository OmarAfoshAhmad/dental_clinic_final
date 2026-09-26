import { Injectable,NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { AppointmentInput,CreatePatientInput,UpdatePatientInput } from './patient.schema.js';
@Injectable()
export class PatientsService{
 constructor(private readonly prisma:PrismaService){}
 private include={clinic:true,doctor:true} as const;
 list(search:string){return this.prisma.patient.findMany({where:search?{OR:[{fullName:{contains:search,mode:'insensitive'}},{phone:{contains:search}},...(Number.isFinite(Number(search))?[{fileNumber:Number(search)}]:[])]}:undefined,include:this.include,orderBy:{updatedAt:'desc'},take:50}).then(rows=>rows.map(p=>({...p,age:p.birthDate?Math.floor((Date.now()-p.birthDate.getTime())/31557600000):null})))}
 async get(id:string){const p=await this.prisma.patient.findUnique({where:{id},include:this.include});if(!p)throw new NotFoundException('Patient not found');return {...p,age:p.birthDate?Math.floor((Date.now()-p.birthDate.getTime())/31557600000):null}}
 async create(input:CreatePatientInput){const clinic=await this.ensureClinic(input.clinicId);const doctor=await this.ensureDoctor(input.doctorId,clinic.id);return this.prisma.patient.create({data:{fullName:input.fullName,birthDate:input.birthDate?new Date(input.birthDate):null,gender:input.gender,phone:input.phone,secondaryPhone:input.secondaryPhone||null,address:input.address||null,clinicId:clinic.id,doctorId:doctor.id},include:this.include})}
 update(id:string,input:UpdatePatientInput){return this.prisma.patient.update({where:{id},data:input,include:this.include})}
 remove(id:string){return this.prisma.patient.delete({where:{id}})}
 async book(id:string,input:AppointmentInput){const p=await this.prisma.patient.findUnique({where:{id}});if(!p)throw new NotFoundException('Patient not found');return this.prisma.appointment.create({data:{patientId:id,clinicId:p.clinicId,doctorId:p.doctorId,scheduledAt:new Date(input.scheduledAt),notes:input.notes||null}})}
 visits(id:string){return this.prisma.visit.findMany({where:{patientId:id},include:{clinic:true,doctor:true},orderBy:{visitedAt:'desc'},take:50})}
 private async ensureClinic(code:string){const names:Record<string,string>={general:'الأسنان العام',ortho:'تقويم الأسنان',surgery:'جراحة الفم',children:'الأطفال',care:'العناية'};return this.prisma.clinic.upsert({where:{code},update:{},create:{code,name:names[code]??code}})}
 private async ensureDoctor(code:string,clinicId:string){const names:Record<string,string>={khaled:'د. خالد',abdulkader:'د. عبد القادر',ahmed:'د. أحمد',samira:'د. سميرة'};return this.prisma.doctor.upsert({where:{code},update:{clinicId},create:{code,name:names[code]??code,clinicId}})}
}
