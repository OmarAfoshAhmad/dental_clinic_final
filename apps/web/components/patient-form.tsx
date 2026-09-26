'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ban, ChevronDown, Coins, RadioTower, Send, UserPen, Users } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { patientSchema, type PatientFormInput } from '@/schemas/patient';

function getAge(birthDate?: string) {
  if (!birthDate) return '';
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age >= 0 ? String(age) : '';
}

export function PatientForm() {
  const queryClient = useQueryClient();
  const form = useForm<PatientFormInput>({
    resolver: zodResolver(patientSchema),
    defaultValues: { fullName: '', birthDate: '', gender: 'FEMALE', phone: '', secondaryPhone: '', address: '', clinicId: 'general', doctorId: 'khaled' },
  });
  const birthDate = form.watch('birthDate');
  const age = useMemo(() => getAge(birthDate), [birthDate]);
  const mutation = useMutation({
    mutationFn: api.patients.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['patients'] }); form.reset(); },
  });

  return (
    <section className="card formCard">
      <div className="sectionHeading">
        <div><UserPen size={16} /><b>بيانات المريض</b></div>
        <strong><Users size={17} />واجهة الاستقبال</strong>
      </div>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="patientForm">
        <label className="field fullField"><span>الاسم الكامل <em>*</em></span><input {...form.register('fullName')} />{form.formState.errors.fullName && <small className="fieldError">{form.formState.errors.fullName.message}</small>}</label>
        <div className="birthGenderRow fullField">
          <label className="field birthField"><span>تاريخ الميلاد</span><input type="date" {...form.register('birthDate')} /></label>
          <label className="field ageField"><span>العمر</span><input value={age} readOnly tabIndex={-1} /></label>
          <div className="field genderField"><span>الجنس</span><div className="radioGroup"><label><input type="radio" value="FEMALE" {...form.register('gender')} /> أنثى</label><label><input type="radio" value="MALE" {...form.register('gender')} /> ذكر</label></div></div>
        </div>
        <label className="field"><span>رقم الهاتف <em>*</em></span><input dir="ltr" {...form.register('phone')} />{form.formState.errors.phone && <small className="fieldError">{form.formState.errors.phone.message}</small>}</label>
        <label className="field"><span>هاتف إضافي</span><input dir="ltr" {...form.register('secondaryPhone')} /></label>
        <label className="field fullField"><span>العنوان</span><div className="selectWrap"><input {...form.register('address')} placeholder="اليرموك" /><ChevronDown size={13} /></div></label>
        <label className="field"><span>العيادة <em>*</em></span><div className="selectWrap"><select {...form.register('clinicId')}><option value="general">الأسنان العام</option><option value="ortho">تقويم الأسنان</option><option value="surgery">جراحة الفم</option><option value="children">الأطفال</option><option value="care">العناية</option></select><ChevronDown size={13} /></div></label>
        <label className="field"><span>الطبيب <em>*</em></span><div className="selectWrap"><select {...form.register('doctorId')}><option value="khaled">د. خالد</option><option value="abdulkader">د. عبد القادر</option><option value="ahmed">د. أحمد</option><option value="samira">د. سميرة</option></select><ChevronDown size={13} /></div></label>
        <div className="chronicBox fullField"><span>الأمراض المزمنة:</span><label><input type="checkbox" defaultChecked /> لا يوجد</label><label><input type="checkbox" /> ضغط الدم</label><label><input type="checkbox" /> السكري</label><label><input type="checkbox" /> أمراض القلب</label><label><input type="checkbox" /> أخرى</label></div>
        <label className="field fullField"><input placeholder="كيفية الوصول الى المركز" /></label>
        <div className="radiologyBox fullField">
          <div className="radiologyTitle"><span><RadioTower size={15} />بيانات الأشعة</span><small>(تظهر فقط لعيادات الأشعة)</small></div>
          <div className="radiologyGrid"><label className="field"><span>مرسل من عيادة</span><select><option /></select></label><label className="field"><span>مرسل من طبيب</span><select><option /></select></label><label className="field fullField"><input placeholder="الإجراء المطلوب" /></label></div>
        </div>
        <div className="formActions fullField">
          <button className="primaryAction" disabled={mutation.isPending}><Send size={15} />{mutation.isPending ? 'جارٍ الحفظ...' : 'حفظ كشف جديد وإرسال للطبيب'}</button>
          <button className="secondaryAction" type="button"><Coins size={15} />إرسال الخزينة (أشعة)</button>
          <button className="dangerAction" type="button"><Ban size={14} />حالة قديم استثنائها</button>
        </div>
        {mutation.isError && <p className="fieldError fullField">تعذر حفظ المريض. تأكد من تشغيل الـ API وقاعدة البيانات.</p>}
      </form>
    </section>
  );
}
