'use client';

import {
  CalendarCheck,
  CheckCircle2,
  FileText,
  Pencil,
  Trash2,
  WalletCards,
  Zap,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useReceptionStore } from '@/store/reception-store';

const visitStatusLabels: Record<string, string> = {
  REGISTERED: 'مسجلة',
  ARRIVED: 'وصل',
  WAITING: 'في الانتظار',
  CALLED: 'تم النداء',
  WITH_DOCTOR: 'عند الطبيب',
  PROCEDURE_REQUIRED: 'بحاجة لإجراء',
  SENT_TO_TREASURY: 'مرسل للخزينة',
  PAYMENT_PENDING: 'بانتظار السداد',
  PAID: 'تم السداد',
  RETURN_TO_DOCTOR: 'عائد للطبيب',
  COMPLETED: 'مكتملة',
  CANCELLED: 'ملغاة',
  NO_SHOW: 'لم يحضر',
};

export function QuickActions() {
  const selected = useReceptionStore((state) => state.selectedPatientId);
  const open = useReceptionStore((state) => state.openDialog);

  const { data: patient } = useQuery({
    queryKey: ['patient', selected],
    queryFn: () => api.patients.get(selected!),
    enabled: Boolean(selected),
  });

  return (
    <div className="middleGrid refinedQuickGrid">
      <section className="card debtSummaryCard" aria-label="حالة المديونية">
        <span className="debtSummaryIcon">
          <CheckCircle2 size={18} />
        </span>

        <div className="debtSummaryContent">
          <strong>المديونية</strong>
          <b>لا توجد مديونية مسجلة</b>
          <small>سيتم ربطها بالمسار المالي عند تنفيذ ميزة الخزينة.</small>
        </div>
      </section>

      <section className="card quickCard liveQuickActions">
        <div className="quickHeader">
          <strong>إجراءات سريعة <Zap size={14} /></strong>
          <small className="quickContext">
            {selected
              ? patient?.fullName ?? 'جارٍ تحميل المريض...'
              : 'اختر مريضًا من الجدول'}
          </small>
        </div>

        <div className="quickGrid compactQuickGrid">
          <button disabled={!selected} onClick={() => open('edit')}>
            <Pencil size={14} />
            تعديل البيانات
          </button>

          <button
            disabled
            title="سيتم تفعيل الحجز بعد اكتمال ربط الموعد بالعيادة والطبيب"
          >
            <CalendarCheck size={14} />
            حجز موعد
          </button>

          <button disabled={!selected} onClick={() => open('visits')}>
            <FileText size={14} />
            عرض الزيارات
          </button>

          <button
            disabled
            title="سيتم تفعيل الخزينة بعد إنشاء المسار المالي المرتبط بالزيارة"
          >
            <WalletCards size={14} />
            الخزينة
          </button>

          <button
            disabled={!selected}
            className="dangerText"
            onClick={() => open('delete')}
          >
            <Trash2 size={14} />
            حذف
          </button>
        </div>

        {selected && patient?.latestVisit && (
          <div className="selectedVisitState">
            <span>آخر زيارة</span>
            <strong>
              {visitStatusLabels[patient.latestVisit.status] ??
                patient.latestVisit.status}
            </strong>
          </div>
        )}
      </section>
    </div>
  );
}
