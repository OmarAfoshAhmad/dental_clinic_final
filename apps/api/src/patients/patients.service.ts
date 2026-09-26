import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type {
  AppointmentInput,
  CreatePatientInput,
  UpdatePatientInput,
} from './patient.schema.js';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = { clinic: true, doctor: true } as const;

  async list(search: string) {
    const rows = await this.prisma.patient.findMany({
      where: search
        ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search } },
              ...(Number.isFinite(Number(search))
                ? [{ fileNumber: Number(search) }]
                : []),
            ],
          }
        : undefined,
      include: this.include,
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });

    return rows.map((patient) => ({
      ...patient,
      age: patient.birthDate ? this.calculateAge(patient.birthDate) : null,
    }));
  }

  async get(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: this.include,
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return {
      ...patient,
      age: patient.birthDate ? this.calculateAge(patient.birthDate) : null,
    };
  }

  create(input: CreatePatientInput) {
    return this.prisma.patient.create({
      data: {
        fullName: input.fullName,
        birthDate: input.birthDate ? new Date(input.birthDate) : null,
        gender: input.gender,
        phone: input.phone,
        secondaryPhone: input.secondaryPhone || null,
        address: input.address || null,
      },
      include: this.include,
    });
  }

  update(id: string, input: UpdatePatientInput) {
    return this.prisma.patient.update({
      where: { id },
      data: input,
      include: this.include,
    });
  }

  remove(id: string) {
    return this.prisma.patient.delete({ where: { id } });
  }

  async book(id: string, input: AppointmentInput) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.prisma.appointment.create({
      data: {
        patientId: id,
        clinicId: patient.clinicId,
        doctorId: patient.doctorId,
        scheduledAt: new Date(input.scheduledAt),
        notes: input.notes || null,
      },
    });
  }

  visits(id: string) {
    return this.prisma.visit.findMany({
      where: { patientId: id },
      include: { clinic: true, doctor: true },
      orderBy: { visitedAt: 'desc' },
      take: 50,
    });
  }

  private calculateAge(birthDate: Date) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDelta = today.getMonth() - birthDate.getMonth();

    if (
      monthDelta < 0 ||
      (monthDelta === 0 && today.getDate() < birthDate.getDate())
    ) {
      age -= 1;
    }

    return age;
  }
}
