import { z } from 'zod';

export const createPatientSchema = z.object({
  fullName: z.string().trim().min(3),
  birthDate: z.string().optional().or(z.literal('')),
  gender: z.enum(['FEMALE', 'MALE']),
  phone: z.string().trim().min(9),
  secondaryPhone: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

export const updatePatientSchema = z.object({
  fullName: z.string().trim().min(3).optional(),
  phone: z.string().trim().min(9).optional(),
  address: z.string().trim().optional(),
});

export const appointmentSchema = z.object({
  scheduledAt: z.string().min(1),
  notes: z.string().optional(),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
