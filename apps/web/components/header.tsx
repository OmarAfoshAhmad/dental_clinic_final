'use client';
import { Bell,CalendarDays,Clock3,Search,Settings,Stethoscope,UserRound } from 'lucide-react';
import { useEffect,useMemo,useState } from 'react';
import { useReceptionStore } from '@/store/reception-store';
function formatArabicDate(date:Date){return new Intl.DateTimeFormat('ar-LY',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(date)}
export function Header({onSearch}:{onSearch:(value:string)=>void}){
 const [value,setValue]=useState('');const [now,setNow]=useState(()=>new Date());const openDialog=useReceptionStore(s=>s.openDialog);
 useEffect(()=>{const id=window.setInterval(()=>setNow(new Date()),30000);return()=>clearInterval(id)},[]);
 const dateLabel=useMemo(()=>formatArabicDate(now),[now]);const timeLabel=useMemo(()=>new Intl.DateTimeFormat('en-US',{hour:'2-digit',minute:'2-digit'}).format(now),[now]);
 return <header className="topbar"><div className="brand"><span className="brandIcon"><Stethoscope size={24}/></span><div><strong>عيادة دنتال</strong><small>نظام إدارة العيادة</small></div></div>
 <div className="topCenter"><span className="badge"><CalendarDays size={14}/>{dateLabel}</span><span className="badge"><Clock3 size={14}/>{timeLabel}</span><label className="searchBox"><Search size={15}/><input value={value} onChange={e=>{setValue(e.target.value);onSearch(e.target.value)}} placeholder="البحث بالاسم أو رقم الملف أو رقم الجوال ..."/></label></div>
 <div className="userArea"><button className="notificationButton settingsButton" type="button" title="إعدادات المظهر" onClick={()=>openDialog('settings')}><Settings size={17}/></button><button className="notificationButton" type="button"><Bell size={18}/><span>3</span></button><div className="userIdentity"><span className="avatar"><UserRound size={17}/></span><div><b>أحمد مدير النظام</b><small>موظف الاستقبال</small></div></div></div></header>
}
