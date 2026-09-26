'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useReceptionStore } from '@/store/reception-store';
import { AppearanceSettings } from './appearance-settings';
import { Button } from './ui/button';
import { Modal } from './ui/modal';

const visitTypeLabels: Record<string, string> = {
  NEW_CONSULTATION: 'كشف جديد',
  REVIEW: 'مراجعة',
  FOLLOW_UP: 'متابعة علاج',
  EMERGENCY: 'طوارئ',
  RADIOLOGY: 'أشعة',
  DIRECT_PROCEDURE: 'إجراء مباشر',
  CONSULTATION: 'استشارة',
};

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

export function ReceptionDialogs() {
  const id = useReceptionStore((state) => state.selectedPatientId);
  const dialog = useReceptionStore((state) => state.dialog);
  const close = useReceptionStore((state) => state.closeDialog);
  const select = useReceptionStore((state) => state.setSelectedPatientId);
  const queryClient = useQueryClient();

  const patient = useQuery({
    queryKey: ['patient', id],
    queryFn: () => api.patients.get(id!),
    enabled: Boolean(id) && dialog === 'edit',
  });

  const [edit, setEdit] = useState({
    fullName: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (patient.data) {
      setEdit({
        fullName: patient.data.fullName,
        phone: patient.data.phone,
        address: patient.data.address ?? '',
      });
    }
  }, [patient.data]);

  const update = useMutation({
    mutationFn: () => api.patients.update(id!, edit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      close();
    },
  });

  const remove = useMutation({
    mutationFn: () => api.patients.remove(id!),
    onSuccess: () => {
      select(null);
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      close();
    },
  });

  const [appointment, setAppointment] = useState({
    scheduledAt: '',
    notes: '',
  });

  const book = useMutation({
    mutationFn: () => api.patients.appointment(id!, appointment),
    onSuccess: () => {
      setAppointment({ scheduledAt: '', notes: '' });
      close();
    },
  });

  const visits = useQuery({
    queryKey: ['visits', id],
    queryFn: () => api.visits.listForPatient(id!),
    enabled: Boolean(id) && dialog === 'visits',
  });

  return (
    <>
      <AppearanceSettings open={dialog === 'settings'} onClose={close} />

      <Modal
        open={dialog === 'edit'}
        title="تعديل بيانات المريض"
        onClose={close}
        footer={
          <>
            <Button variant="secondary" onClick={close}>إلغاء</Button>
            <Button onClick={() => update.mutate()} disabled={update.isPending}>حفظ التعديلات</Button>
          </>
        }
      >
        <div className="dialogForm">
          <label><span>الاسم الكامل</span><input value={edit.fullName} onChange={(event) => setEdit({ ...edit, fullName: event.target.value })} /></label>
          <label><span>رقم الهاتف</span><input dir="ltr" value={edit.phone} onChange={(event) => setEdit({ ...edit, phone: event.target.value })} /></label>
          <label className="span2"><span>العنوان</span><input value={edit.address} onChange={(event) => setEdit({ ...edit, address: event.target.value })} /></label>
        </div>
      </Modal>

      <Modal
        open={dialog === 'appointment'}
        title="حجز موعد جديد"
        onClose={close}
        footer={
          <>
            <Button variant="secondary" onClick={close}>إلغاء</Button>
            <Button onClick={() => book.mutate()} disabled={!appointment.scheduledAt || book.isPending}>تأكيد الحجز</Button>
          </>
        }
      >
        <div className="dialogForm">
          <label className="span2"><span>التاريخ والوقت</span><input type="datetime-local" value={appointment.scheduledAt} onChange={(event) => setAppointment({ ...appointment, scheduledAt: event.target.value })} /></label>
          <label className="span2"><span>ملاحظات</span><textarea rows={4} value={appointment.notes} onChange={(event) => setAppointment({ ...appointment, notes: event.target.value })} /></label>
        </div>
      </Modal>

      <Modal open={dialog === 'visits'} title="سجل زيارات المريض" onClose={close}>
        <div className="visitsList">
          {visits.isLoading
            ? 'جارٍ التحميل...'
            : visits.data?.length
              ? visits.data.map((visit) => (
                  <article key={visit.id}>
                    <strong>{new Date(visit.visitedAt).toLocaleString('ar-LY')}</strong>
                    <span>{visitTypeLabels[visit.type] ?? visit.type} · {visitStatusLabels[visit.status] ?? visit.status}</span>
                    <span>{visit.clinic?.name ?? 'بدون عيادة'} — {visit.doctor?.name ?? 'بدون طبيب'}</span>
                    <small>{visit.notes || 'لا توجد ملاحظات'}</small>
                  </article>
                ))
              : 'لا توجد زيارات مسجلة لهذا المريض.'}
        </div>
      </Modal>

      <Modal
        open={dialog === 'delete'}
        title="حذف ملف المريض"
        onClose={close}
        width="460px"
        footer={
          <>
            <Button variant="secondary" onClick={close}>إلغاء</Button>
            <Button variant="danger" onClick={() => remove.mutate()} disabled={remove.isPending}>تأكيد الحذف</Button>
          </>
        }
      >
        <p className="confirmText">يسمح النظام بالحذف فقط إذا لم يكن للمريض أي زيارات أو مواعيد أو حركة تشغيلية سابقة.</p>
        {remove.isError && (
          <p className="fieldError">
            لا يمكن حذف هذا المريض لأنه مرتبط بسجل تشغيلي. استخدم الأرشفة عندما تتوفر في ميزة مستقلة.
          </p>
        )}
      </Modal>
    </>
  );
}
