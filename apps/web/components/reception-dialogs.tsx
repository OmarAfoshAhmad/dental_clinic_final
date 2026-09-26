'use client';
import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query';
import { useEffect,useState } from 'react';
import { api } from '@/lib/api';
import { useReceptionStore } from '@/store/reception-store';
import { AppearanceSettings } from './appearance-settings';
import { Button } from './ui/button';
import { Modal } from './ui/modal';

export function ReceptionDialogs(){
 const id=useReceptionStore(s=>s.selectedPatientId),dialog=useReceptionStore(s=>s.dialog),close=useReceptionStore(s=>s.closeDialog),select=useReceptionStore(s=>s.setSelectedPatientId);
 const qc=useQueryClient();const patient=useQuery({queryKey:['patient',id],queryFn:()=>api.patients.get(id!),enabled:!!id&&dialog==='edit'});
 const [edit,setEdit]=useState({fullName:'',phone:'',address:''});useEffect(()=>{if(patient.data)setEdit({fullName:patient.data.fullName,phone:patient.data.phone,address:patient.data.address??''})},[patient.data]);
 const update=useMutation({mutationFn:()=>api.patients.update(id!,edit),onSuccess:()=>{qc.invalidateQueries({queryKey:['patients']});close()}});
 const remove=useMutation({mutationFn:()=>api.patients.remove(id!),onSuccess:()=>{select(null);qc.invalidateQueries({queryKey:['patients']});close()}});
 const [appointment,setAppointment]=useState({scheduledAt:'',notes:''});const book=useMutation({mutationFn:()=>api.patients.appointment(id!,appointment),onSuccess:()=>{setAppointment({scheduledAt:'',notes:''});close()}});
 const visits=useQuery({queryKey:['visits',id],queryFn:()=>api.patients.visits(id!),enabled:!!id&&dialog==='visits'});
 return <>
 <AppearanceSettings open={dialog==='settings'} onClose={close}/>
 <Modal open={dialog==='edit'} title="تعديل بيانات المريض" onClose={close} footer={<><Button variant="secondary" onClick={close}>إلغاء</Button><Button onClick={()=>update.mutate()} disabled={update.isPending}>حفظ التعديلات</Button></>}>
  <div className="dialogForm"><label><span>الاسم الكامل</span><input value={edit.fullName} onChange={e=>setEdit({...edit,fullName:e.target.value})}/></label><label><span>رقم الهاتف</span><input dir="ltr" value={edit.phone} onChange={e=>setEdit({...edit,phone:e.target.value})}/></label><label className="span2"><span>العنوان</span><input value={edit.address} onChange={e=>setEdit({...edit,address:e.target.value})}/></label></div>
 </Modal>
 <Modal open={dialog==='appointment'} title="حجز موعد جديد" onClose={close} footer={<><Button variant="secondary" onClick={close}>إلغاء</Button><Button onClick={()=>book.mutate()} disabled={!appointment.scheduledAt||book.isPending}>تأكيد الحجز</Button></>}>
  <div className="dialogForm"><label className="span2"><span>التاريخ والوقت</span><input type="datetime-local" value={appointment.scheduledAt} onChange={e=>setAppointment({...appointment,scheduledAt:e.target.value})}/></label><label className="span2"><span>ملاحظات</span><textarea rows={4} value={appointment.notes} onChange={e=>setAppointment({...appointment,notes:e.target.value})}/></label></div>
 </Modal>
 <Modal open={dialog==='visits'} title="سجل زيارات المريض" onClose={close}><div className="visitsList">{visits.isLoading?'جارٍ التحميل...':visits.data?.length?visits.data.map(v=><article key={v.id}><strong>{new Date(v.visitedAt).toLocaleString('ar-LY')}</strong><span>{v.clinic?.name??'بدون عيادة'} — {v.doctor?.name??'بدون طبيب'}</span><small>{v.notes||'لا توجد ملاحظات'}</small></article>):'لا توجد زيارات مسجلة لهذا المريض.'}</div></Modal>
 <Modal open={dialog==='delete'} title="حذف ملف المريض" onClose={close} width="460px" footer={<><Button variant="secondary" onClick={close}>إلغاء</Button><Button variant="danger" onClick={()=>remove.mutate()} disabled={remove.isPending}>تأكيد الحذف</Button></>}><p className="confirmText">سيتم حذف ملف المريض وما يرتبط به من قائمة الانتظار والمواعيد. لا يمكن التراجع عن العملية.</p></Modal>
 </>;
}
