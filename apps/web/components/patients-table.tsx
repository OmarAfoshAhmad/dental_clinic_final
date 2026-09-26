'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Eye, Pencil, Trash2, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { useReceptionStore } from '@/store/reception-store';

export function PatientsTable({ search }: { search: string }) {
  const selected = useReceptionStore((state) => state.selectedPatientId);
  const select = useReceptionStore((state) => state.setSelectedPatientId);
  const open = useReceptionStore((state) => state.openDialog);
  const { data = [], isLoading } = useQuery({
    queryKey: ['patients', search],
    queryFn: () => api.patients.list(search),
  });

  const action = (patientId: string, dialog: 'visits' | 'edit' | 'delete') => {
    select(patientId);
    open(dialog);
  };

  return (
    <section className="card patientsCard">
      <div className="sectionHeading compactHeading">
        <div><Users size={16} /><b>ملفات المرضى</b></div>
        <strong className="patientCount">إجمالي المرضى : <span>{data.length}</span></strong>
      </div>

      <div className="tableWrap">
        <table className="dentalTable">
          <thead>
            <tr>
              <th>م</th><th>رقم الملف</th><th>الاسم</th><th>رقم الهاتف</th><th>العيادة</th>
              <th>الطبيب</th><th>العمر</th><th>العنوان</th><th>آخر زيارة</th><th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={10}>جارٍ التحميل...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={10} className="emptyCell">لا توجد سجلات مرضى بعد</td></tr>
            ) : data.map((patient, index) => (
              <tr
                key={patient.id}
                className={selected === patient.id ? 'selected' : ''}
                onClick={() => select(patient.id)}
              >
                <td>{index + 1}</td>
                <td className="fileNumber">{patient.fileNumber}</td>
                <td><b>{patient.fullName}</b></td>
                <td dir="ltr">{patient.phone}</td>
                <td>{patient.clinic?.name ?? '-'}</td>
                <td>{patient.doctor?.name ?? '-'}</td>
                <td>{patient.age ?? '-'}</td>
                <td>{patient.address ?? '-'}</td>
                <td dir="ltr">{patient.latestVisit ? new Date(patient.latestVisit.visitedAt).toISOString().slice(0, 10) : '-'}</td>
                <td>
                  <div className="rowActions">
                    <button type="button" aria-label="عرض الزيارات" onClick={(e) => { e.stopPropagation(); action(patient.id, 'visits'); }}><Eye size={12} /></button>
                    <button type="button" aria-label="تعديل" className="editButton" onClick={(e) => { e.stopPropagation(); action(patient.id, 'edit'); }}><Pencil size={12} /></button>
                    <button type="button" aria-label="حذف" className="deleteButton" onClick={(e) => { e.stopPropagation(); action(patient.id, 'delete'); }}><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination" aria-label="التنقل بين الصفحات">
        <button type="button"><ChevronRight size={11} /></button>
        <button type="button" className="activePage">1</button>
        <button type="button">2</button><button type="button">3</button><button type="button">4</button><button type="button">5</button>
        <button type="button"><ChevronLeft size={11} /></button>
      </div>
    </section>
  );
}
