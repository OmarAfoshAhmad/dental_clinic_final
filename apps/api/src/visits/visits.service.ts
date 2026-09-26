import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateVisitInput } from './visit.schema.js';

const CLINIC_NAMES: Record<string, string> = {
  general: 'الأسنان العام',
  ortho: 'تقويم الأسنان',
  surgery: 'جراحة الفم',
  children: 'الأطفال',
  care: 'العناية',
};

const DOCTOR_NAMES: Record<string, string> = {
  khaled: 'د. خالد',
  abdulkader: 'د. عبد القادر',
  ahmed: 'د. أحمد',
  samira: 'د. سميرة',
};

@Injectable()
export class VisitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateVisitInput) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: input.patientId },
      select: { id: true },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const clinic = await this.ensureClinic(input.clinicCode);
    const doctor = await this.ensureDoctor(input.doctorCode, clinic.id);

    if (doctor.clinicId !== clinic.id) {
      throw new BadRequestException('Doctor does not belong to selected clinic');
    }

    return this.prisma.visit.create({
      data: {
        patientId: input.patientId,
        clinicId: clinic.id,
        doctorId: doctor.id,
        type: input.type,
        status: 'REGISTERED',
        notes: input.notes || null,
      },
      include: {
        patient: true,
        clinic: true,
        doctor: true,
      },
    });
  }

  listForPatient(patientId: string) {
    return this.prisma.visit.findMany({
      where: { patientId },
      include: { clinic: true, doctor: true },
      orderBy: { visitedAt: 'desc' },
      take: 50,
    });
  }

  private ensureClinic(code: string) {
    return this.prisma.clinic.upsert({
      where: { code },
      update: {},
      create: {
        code,
        name: CLINIC_NAMES[code] ?? code,
      },
    });
  }

  private ensureDoctor(code: string, clinicId: string) {
    return this.prisma.doctor.upsert({
      where: { code },
      update: { clinicId },
      create: {
        code,
        name: DOCTOR_NAMES[code] ?? code,
        clinicId,
      },
    });
  }
}
