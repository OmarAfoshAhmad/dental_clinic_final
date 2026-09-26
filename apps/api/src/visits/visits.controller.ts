import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import {
  createVisitSchema,
  type CreateVisitInput,
} from './visit.schema.js';
import { VisitsService } from './visits.service.js';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createVisitSchema)) input: CreateVisitInput,
  ) {
    return this.visitsService.create(input);
  }

  @Get('patient/:patientId')
  listForPatient(@Param('patientId') patientId: string) {
    return this.visitsService.listForPatient(patientId);
  }
}
