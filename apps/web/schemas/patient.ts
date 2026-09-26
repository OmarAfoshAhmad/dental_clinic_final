import { z } from 'zod';

export const patientSchema = z.object({
  fullName: z.string().trim().min(3, 'الاسم مطلوب'),
  birthDate: z.string().optional(),
  gender: z.enum(['FEMALE', 'MALE']),
  phone: z.string().trim().min(9, 'رقم الهاتف غير صحيح'),
  secondaryPhone: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

export const visitSchema = z.object({
  clinicCode: z.string().min(1, 'اختر العيادة'),
  doctorCode: z.string().min(1, 'اختر الطبيب'),
  type: z.enum([
    'NEW_CONSULTATION',
    'REVIEW',
    'FOLLOW_UP',
    'EMERGENCY',
    'RADIOLOGY',
    'DIRECT_PROCEDURE',
    'CONSULTATION',
  ]),
  notes: z.string().trim().max(1000).optional(),
});

export type PatientFormInput = z.infer<typeof patientSchema>;
export type VisitFormInput = z.infer<typeof visitSchema>;
