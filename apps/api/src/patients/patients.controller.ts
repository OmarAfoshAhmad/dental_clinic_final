import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PatientsService } from './patients.service.js';
import { createPatientSchema, type CreatePatientInput } from './patient.schema.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patients: PatientsService) {}
  @Get() list(@Query('search') search = '') { return this.patients.list(search); }
  @Post() create(@Body(new ZodValidationPipe(createPatientSchema)) input: CreatePatientInput) { return this.patients.create(input); }
}
