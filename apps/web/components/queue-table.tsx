'use client';

import { useQuery } from '@tanstack/react-query';
import { Eye, UsersRound } from 'lucide-react';
import { api } from '@/lib/api';

const labels = { WAITING: 'في الانتظار', WITH_DOCTOR: 'عند الطبيب', IN_CLINIC: 'داخل العيادة', TREASURY: 'إرسال الخزينة' } as const;

export function QueueTable() {
  const { data = [], isLoading } = useQuery({ queryKey: ['queue'], queryFn: api.queue.list, refetchInterval: 15_000 });
  return (
    <section className="card queueCard">
      <div className="sectionHeading compactHeading"><div><UsersRound size={15} /><b>المرضى الموجودون حالياً في العيادة</b></div><small>تحديث تلقائي</small></div>
      <div className="tableWrap"><table className="dentalTable"><thead><tr><th>م</th><th>رقم الملف</th><th>اسم المريض</th><th>العيادة</th><th>الطبيب</th><th>وقت الوصول</th><th>الحالة</th><th>إجراءات</th></tr></thead><tbody>
        {isLoading ? <tr><td colSpan={8}>جارٍ التحميل...</td></tr> : data.length === 0 ? <tr><td colSpan={8} className="emptyCell">لا يوجد مرضى في قائمة الانتظار حالياً</td></tr> : data.map((entry, index) => (
          <tr key={entry.id}><td>{index + 1}</td><td className="fileNumber">{entry.patient.fileNumber}</td><td><b>{entry.patient.fullName}</b></td><td>{entry.clinic?.name ?? '-'}</td><td>{entry.doctor?.name ?? '-'}</td><td dir="ltr">{new Date(entry.arrivedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</td><td><span className={`status ${entry.status.toLowerCase()}`}>{labels[entry.status]}</span></td><td><button className="viewAction" type="button" aria-label="عرض"><Eye size={12} /></button></td></tr>
        ))}
      </tbody></table></div>
    </section>
  );
}
