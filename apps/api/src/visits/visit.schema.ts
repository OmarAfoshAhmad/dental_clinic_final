import { z } from 'zod';

export const visitTypes = [
  'NEW_CONSULTATION',
  'REVIEW',
  'FOLLOW_UP',
  'EMERGENCY',
  'RADIOLOGY',
  'DIRECT_PROCEDURE',
  'CONSULTATION',
] as const;

export const createVisitSchema = z.object({
  patientId: z.string().min(1),
  clinicCode: z.string().min(1),
  doctorCode: z.string().min(1),
  type: z.enum(visitTypes),
  notes: z.string().trim().max(1000).optional(),
});

export type CreateVisitInput = z.infer<typeof createVisitSchema>;
