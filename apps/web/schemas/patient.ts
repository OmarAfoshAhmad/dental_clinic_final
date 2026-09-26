import { z } from 'zod';

export const patientSchema = z.object({
  fullName: z.string().min(3, 'الاسم مطلوب'),
  birthDate: z.string().optional(),
  gender: z.enum(['FEMALE', 'MALE']),
  phone: z.string().min(9, 'رقم الهاتف غير صحيح'),
  secondaryPhone: z.string().optional(),
  address: z.string().optional(),
  clinicId: z.string().min(1, 'اختر العيادة'),
  doctorId: z.string().min(1, 'اختر الطبيب'),
});

export type PatientFormInput = z.infer<typeof patientSchema>;
