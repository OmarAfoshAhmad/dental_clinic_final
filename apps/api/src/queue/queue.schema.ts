import { z } from 'zod';export const sendQueueSchema=z.object({patientId:z.string().min(1),status:z.enum(['IN_CLINIC','TREASURY'])});export type SendQueueInput=z.infer<typeof sendQueueSchema>;
