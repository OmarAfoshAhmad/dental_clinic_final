import { Body,Controller,Delete,Get,HttpCode,Param,Patch,Post,Query } from '@nestjs/common';
import { PatientsService } from './patients.service.js';
import { appointmentSchema,createPatientSchema,updatePatientSchema,type AppointmentInput,type CreatePatientInput,type UpdatePatientInput } from './patient.schema.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
@Controller('patients')
export class PatientsController{
 constructor(private readonly patients:PatientsService){}
 @Get() list(@Query('search')search=''){return this.patients.list(search)}
 @Get(':id') get(@Param('id')id:string){return this.patients.get(id)}
 @Post() create(@Body(new ZodValidationPipe(createPatientSchema))input:CreatePatientInput){return this.patients.create(input)}
 @Patch(':id') update(@Param('id')id:string,@Body(new ZodValidationPipe(updatePatientSchema))input:UpdatePatientInput){return this.patients.update(id,input)}
 @Delete(':id') @HttpCode(204) remove(@Param('id')id:string){return this.patients.remove(id)}
 @Post(':id/appointments') appointment(@Param('id')id:string,@Body(new ZodValidationPipe(appointmentSchema))input:AppointmentInput){return this.patients.book(id,input)}
 @Get(':id/visits') visits(@Param('id')id:string){return this.patients.visits(id)}
}
