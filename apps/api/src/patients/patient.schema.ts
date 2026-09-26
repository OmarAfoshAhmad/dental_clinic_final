import { z } from 'zod';

export const createPatientSchema = z.object({
  fullName: z.string().min(3),
  birthDate: z.string().optional().or(z.literal('')),
  gender: z.enum(['FEMALE', 'MALE']),
  phone: z.string().min(9),
  secondaryPhone: z.string().optional(),
  address: z.string().optional(),
  clinicId: z.string().min(1),
  doctorId: z.string().min(1),
});
export type CreatePatientInput = z.infer<typeof createPatientSchema>;
