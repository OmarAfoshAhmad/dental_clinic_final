import { z } from 'zod';
export const createPatientSchema=z.object({fullName:z.string().min(3),birthDate:z.string().optional().or(z.literal('')),gender:z.enum(['FEMALE','MALE']),phone:z.string().min(9),secondaryPhone:z.string().optional(),address:z.string().optional(),clinicId:z.string().min(1),doctorId:z.string().min(1)});
export const updatePatientSchema=z.object({fullName:z.string().min(3).optional(),phone:z.string().min(9).optional(),address:z.string().optional()});
export const appointmentSchema=z.object({scheduledAt:z.string().min(1),notes:z.string().optional()});
export type CreatePatientInput=z.infer<typeof createPatientSchema>;export type UpdatePatientInput=z.infer<typeof updatePatientSchema>;export type AppointmentInput=z.infer<typeof appointmentSchema>;
