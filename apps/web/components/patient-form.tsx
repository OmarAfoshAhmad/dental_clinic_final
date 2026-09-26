'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ban, ChevronDown, RadioTower, Save, Send, UserPen, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import {
  patientSchema,
  visitSchema,
  type PatientFormInput,
  type VisitFormInput,
} from '@/schemas/patient';

const visitTypeLabels: Record<VisitFormInput['type'], string> = {
  NEW_CONSULTATION: 'كشف جديد',
  REVIEW: 'مراجعة',
  FOLLOW_UP: 'متابعة علاج',
  EMERGENCY: 'طوارئ',
  RADIOLOGY: 'أشعة',
  DIRECT_PROCEDURE: 'إجراء مباشر',
  CONSULTATION: 'استشارة',
};

function getAge(birthDate?: string) {
  if (!birthDate) return '';
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return '';

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDelta = today.getMonth() - birth.getMonth();

  if (
    monthDelta < 0 ||
    (monthDelta === 0 && today.getDate() < birth.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? String(age) : '';
}

export function PatientForm() {
  const queryClient = useQueryClient();

  const [visit, setVisit] = useState<VisitFormInput>({
    clinicCode: 'general',
    doctorCode: 'khaled',
    type: 'NEW_CONSULTATION',
    notes: '',
  });

  const [medicalFlags, setMedicalFlags] = useState({
    none: true,
    hypertension: false,
    diabetes: false,
    heart: false,
    other: false,
  });

  const [referralSource, setReferralSource] = useState('');
  const [radiology, setRadiology] = useState({
    referredClinic: '',
    referredDoctor: '',
    requestedProcedure: '',
  });

  const form = useForm<PatientFormInput>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      fullName: '',
      birthDate: '',
      gender: 'FEMALE',
      phone: '',
      secondaryPhone: '',
      address: '',
    },
  });

  const birthDate = form.watch('birthDate');
  const age = useMemo(() => getAge(birthDate), [birthDate]);

  const resetForm = () => {
    form.reset();
    setMedicalFlags({
      none: true,
      hypertension: false,
      diabetes: false,
      heart: false,
      other: false,
    });
    setReferralSource('');
    setRadiology({
      referredClinic: '',
      referredDoctor: '',
      requestedProcedure: '',
    });
  };

  const savePatient = useMutation({
    mutationFn: (data: PatientFormInput) => api.patients.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      resetForm();
    },
  });

  const saveAndStartVisit = useMutation({
    mutationFn: async (data: PatientFormInput) => {
      const visitValidation = visitSchema.parse(visit);
      const patient = await api.patients.create(data);

      await api.visits.create({
        patientId: patient.id,
        ...visitValidation,
      });

      return patient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      resetForm();
    },
  });

  const isBusy = savePatient.isPending || saveAndStartVisit.isPending;
  const showRadiology = visit.type === 'RADIOLOGY';

  const toggleMedicalFlag = (key: keyof typeof medicalFlags) => {
    if (key === 'none') {
      setMedicalFlags({
        none: true,
        hypertension: false,
        diabetes: false,
        heart: false,
        other: false,
      });
      return;
    }

    setMedicalFlags((current) => ({
      ...current,
      none: false,
      [key]: !current[key],
    }));
  };

  return (
    <section className="card formCard">
      <div className="sectionHeading">
        <div><UserPen size={16} /><b>بيانات المريض</b></div>
        <strong><Users size={17} />واجهة الاستقبال</strong>
      </div>

      <form
        className="patientForm"
        onSubmit={form.handleSubmit((data) => savePatient.mutate(data))}
      >
        <label className="field fullField">
          <span>الاسم الكامل <em>*</em></span>
          <input {...form.register('fullName')} />
          {form.formState.errors.fullName && (
            <small className="fieldError">{form.formState.errors.fullName.message}</small>
          )}
        </label>

        <div className="birthGenderRow fullField">
          <label className="field birthField">
            <span>تاريخ الميلاد</span>
            <input type="date" {...form.register('birthDate')} />
          </label>

          <label className="field ageField">
            <span>العمر</span>
            <input value={age} readOnly tabIndex={-1} />
          </label>

          <div className="field genderField">
            <span>الجنس</span>
            <div className="radioGroup">
              <label><input type="radio" value="FEMALE" {...form.register('gender')} /> أنثى</label>
              <label><input type="radio" value="MALE" {...form.register('gender')} /> ذكر</label>
            </div>
          </div>
        </div>

        <label className="field">
          <span>رقم الهاتف <em>*</em></span>
          <input dir="ltr" {...form.register('phone')} />
          {form.formState.errors.phone && (
            <small className="fieldError">{form.formState.errors.phone.message}</small>
          )}
        </label>

        <label className="field">
          <span>هاتف إضافي</span>
          <input dir="ltr" {...form.register('secondaryPhone')} />
        </label>

        <label className="field fullField">
          <span>العنوان</span>
          <input {...form.register('address')} placeholder="اليرموك" />
        </label>

        <div className="visitSection fullField">
          <div className="visitSectionTitle">
            <strong>بيانات الزيارة الحالية</strong>
            <small>هذه البيانات تخص الزيارة ولا تغيّر ملف المريض.</small>
          </div>

          <div className="visitFields">
            <label className="field">
              <span>نوع الزيارة</span>
              <div className="selectWrap">
                <select
                  value={visit.type}
                  onChange={(event) =>
                    setVisit({
                      ...visit,
                      type: event.target.value as VisitFormInput['type'],
                    })
                  }
                >
                  {Object.entries(visitTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <ChevronDown size={13} />
              </div>
            </label>

            <label className="field">
              <span>العيادة</span>
              <div className="selectWrap">
                <select
                  value={visit.clinicCode}
                  onChange={(event) =>
                    setVisit({ ...visit, clinicCode: event.target.value })
                  }
                >
                  <option value="general">الأسنان العام</option>
                  <option value="ortho">تقويم الأسنان</option>
                  <option value="surgery">جراحة الفم</option>
                  <option value="children">الأطفال</option>
                  <option value="care">العناية</option>
                </select>
                <ChevronDown size={13} />
              </div>
            </label>

            <label className="field">
              <span>الطبيب</span>
              <div className="selectWrap">
                <select
                  value={visit.doctorCode}
                  onChange={(event) =>
                    setVisit({ ...visit, doctorCode: event.target.value })
                  }
                >
                  <option value="khaled">د. خالد</option>
                  <option value="abdulkader">د. عبد القادر</option>
                  <option value="ahmed">د. أحمد</option>
                  <option value="samira">د. سميرة</option>
                </select>
                <ChevronDown size={13} />
              </div>
            </label>

            <label className="field">
              <span>ملاحظات الزيارة</span>
              <input
                value={visit.notes ?? ''}
                onChange={(event) =>
                  setVisit({ ...visit, notes: event.target.value })
                }
              />
            </label>
          </div>
        </div>

        <div className="chronicBox fullField">
          <span>الأمراض المزمنة:</span>
          <label>
            <input
              type="checkbox"
              checked={medicalFlags.none}
              onChange={() => toggleMedicalFlag('none')}
            />
            لا يوجد
          </label>
          <label>
            <input
              type="checkbox"
              checked={medicalFlags.hypertension}
              onChange={() => toggleMedicalFlag('hypertension')}
            />
            ضغط الدم
          </label>
          <label>
            <input
              type="checkbox"
              checked={medicalFlags.diabetes}
              onChange={() => toggleMedicalFlag('diabetes')}
            />
            السكري
          </label>
          <label>
            <input
              type="checkbox"
              checked={medicalFlags.heart}
              onChange={() => toggleMedicalFlag('heart')}
            />
            أمراض القلب
          </label>
          <label>
            <input
              type="checkbox"
              checked={medicalFlags.other}
              onChange={() => toggleMedicalFlag('other')}
            />
            أخرى
          </label>
        </div>

        <label className="field fullField">
          <span>كيفية الوصول إلى المركز</span>
          <input
            value={referralSource}
            onChange={(event) => setReferralSource(event.target.value)}
            placeholder="مثال: توصية طبيب، إعلان، صديق..."
          />
        </label>

        {showRadiology && (
          <div className="radiologyBox fullField">
            <div className="radiologyTitle">
              <span><RadioTower size={15} />بيانات الأشعة</span>
              <small>تظهر فقط عند اختيار نوع الزيارة: أشعة</small>
            </div>

            <div className="radiologyGrid">
              <label className="field">
                <span>مرسل من عيادة</span>
                <input
                  value={radiology.referredClinic}
                  onChange={(event) =>
                    setRadiology({
                      ...radiology,
                      referredClinic: event.target.value,
                    })
                  }
                />
              </label>

              <label className="field">
                <span>مرسل من طبيب</span>
                <input
                  value={radiology.referredDoctor}
                  onChange={(event) =>
                    setRadiology({
                      ...radiology,
                      referredDoctor: event.target.value,
                    })
                  }
                />
              </label>

              <label className="field fullField">
                <span>الإجراء المطلوب</span>
                <input
                  value={radiology.requestedProcedure}
                  onChange={(event) =>
                    setRadiology({
                      ...radiology,
                      requestedProcedure: event.target.value,
                    })
                  }
                />
              </label>
            </div>
          </div>
        )}

        <div className="formActions receptionReferenceActions fullField">
          <button
            className="primaryAction"
            type="button"
            disabled={isBusy}
            onClick={form.handleSubmit((data) => saveAndStartVisit.mutate(data))}
          >
            <Send size={15} />
            حفظ كشف جديد وبدء زيارة
          </button>

          <button
            className="secondaryAction"
            type="submit"
            disabled={isBusy}
          >
            <Save size={15} />
            حفظ الملف فقط
          </button>

          <button
            className="dangerAction"
            type="button"
            disabled={isBusy}
            title="سيتم تنفيذ منطق الاستثناء في فرع مستقل"
          >
            <Ban size={14} />
            حالة قديم استثنائها
          </button>
        </div>

        {(savePatient.isError || saveAndStartVisit.isError) && (
          <p className="fieldError fullField">
            تعذر تنفيذ العملية. راجع البيانات واتصال الخادم.
          </p>
        )}
      </form>
    </section>
  );
}
