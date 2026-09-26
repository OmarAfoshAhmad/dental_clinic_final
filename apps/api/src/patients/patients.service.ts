import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreatePatientInput } from './patient.schema.js';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  list(search: string) {
    return this.prisma.patient.findMany({
      where: search ? { OR: [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        ...(Number.isFinite(Number(search)) ? [{ fileNumber: Number(search) }] : []),
      ] } : undefined,
      include: { clinic: true, doctor: true },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    }).then(rows => rows.map(p => ({ ...p, age: p.birthDate ? Math.floor((Date.now()-p.birthDate.getTime())/31557600000) : null })));
  }

  async create(input: CreatePatientInput) {
    const clinic = await this.ensureClinic(input.clinicId);
    const doctor = await this.ensureDoctor(input.doctorId, clinic.id);
    return this.prisma.patient.create({
      data: {
        fullName: input.fullName,
        birthDate: input.birthDate ? new Date(input.birthDate) : null,
        gender: input.gender,
        phone: input.phone,
        secondaryPhone: input.secondaryPhone || null,
        address: input.address || null,
        clinicId: clinic.id,
        doctorId: doctor.id,
      },
      include: { clinic: true, doctor: true },
    });
  }

  private async ensureClinic(code: string) {
    const names: Record<string,string> = { general: 'الأسنان العام', ortho: 'تقويم الأسنان', surgery: 'جراحة الفم', children: 'الأطفال', care: 'العناية' };
    return this.prisma.clinic.upsert({ where: { code }, update: {}, create: { code, name: names[code] ?? code } });
  }

  private async ensureDoctor(code: string, clinicId: string) {
    const names: Record<string,string> = { khaled: 'د. خالد', abdulkader: 'د. عبد القادر', ahmed: 'د. أحمد', samira: 'د. سميرة' };
    return this.prisma.doctor.upsert({ where: { code }, update: { clinicId }, create: { code, name: names[code] ?? code, clinicId } });
  }
}
