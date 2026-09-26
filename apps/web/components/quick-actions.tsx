'use client';
import { CalendarCheck,Check,Coins,FileText,Info,Pencil,Search,Trash2,Zap } from 'lucide-react';
import { useReceptionStore } from '@/store/reception-store';
export function QuickActions(){
 const selected=useReceptionStore(s=>s.selectedPatientId);const open=useReceptionStore(s=>s.openDialog);
 const disabled=!selected;
 return <div className="middleGrid"><section className="card quickCard"><div className="quickHeader"><label className="quickSearch"><Search size={12}/><input placeholder="البحث في المرضى بالاسم أو رقم الملف أو رقم الجوال ..."/></label><strong>إجراءات سريعة <Zap size={14}/></strong></div>
 <div className="quickGrid"><button disabled={disabled} onClick={()=>open('edit')}><Pencil size={14}/>تعديل البيانات</button><button disabled={disabled} onClick={()=>open('appointment')}><CalendarCheck size={14}/>حجز موعد</button><button disabled={disabled} onClick={()=>open('visits')}><FileText size={14}/>عرض الزيارات</button><button disabled={disabled}><Coins size={14}/>الخزينة</button><button disabled={disabled} className="dangerText" onClick={()=>open('delete')}><Trash2 size={14}/>حذف</button></div></section>
 <section className="financeGrid"><div className="noDebtCard"><span><Check size={15}/></span><b>لا توجد مديونية</b></div><div className="debtCard"><div className="debtTitle"><span><Coins size={14}/></span><b>المديونية الحالية</b></div><small>تظهر حسب المريض المحدد</small><strong>{selected?'0 دينار':'—'}</strong><div className="debtActions"><button type="button" disabled={!selected}>تحويل للخزينة للسداد</button><span><Info size={11}/></span></div></div></section></div>
}
