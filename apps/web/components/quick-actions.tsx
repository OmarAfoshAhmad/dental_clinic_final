'use client';

import { CalendarCheck, FileText, Pencil, Search, Trash2, WalletCards, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useReceptionStore } from '@/store/reception-store';

const terminalVisitStatuses = new Set(['COMPLETED', 'CANCELLED', 'NO_SHOW']);

export function QuickActions() {
  const selected = useReceptionStore((state) => state.selectedPatientId);
  const open = useReceptionStore((state) => state.openDialog);

  const { data: patient } = useQuery({
    queryKey: ['patient', selected],
    queryFn: () => api.patients.get(selected!),
    enabled: Boolean(selected),
  });

  const hasActiveVisit = Boolean(
    patient?.latestVisit && !terminalVisitStatuses.has(patient.latestVisit.status),
  );

  return (
    <div className="middleGrid liveQuickActions">
      <section className="card quickCard">
        <div className="quickHeader">
          <label className="quickSearch">
            <Search size={12} />
            <input placeholder="البحث في المرضى بالاسم أو رقم الملف أو رقم الجوال ..." />
          </label>
          <strong>إجراءات سريعة <Zap size={14} /></strong>
        </div>

        <div className="quickGrid">
          <button disabled={!selected} onClick={() => open('edit')}>
            <Pencil size={14} />
            تعديل البيانات
          </button>

          <button disabled={!selected} onClick={() => open('appointment')}>
            <CalendarCheck size={14} />
            حجز موعد
          </button>

          <button disabled={!selected} onClick={() => open('visits')}>
            <FileText size={14} />
            عرض الزيارات
          </button>

          <button
            disabled
            title={hasActiveVisit
              ? 'سيُفعل بعد ربط التحويل للخزينة بالزيارة الحالية'
              : 'لا توجد زيارة فعالة للمريض'}
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
            <span>الحالة الحالية</span>
            <strong>{patient.latestVisit.status}</strong>
          </div>
        )}
      </section>
    </div>
  );
}
