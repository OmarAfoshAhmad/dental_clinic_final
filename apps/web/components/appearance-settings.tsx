'use client';
import { useEffect,useState } from 'react';
import { Button } from './ui/button';
import { Modal } from './ui/modal';

const defaults={primary:'#0284c7',primaryDark:'#0369a1',surface:'#ffffff',page:'#e5edf5',radius:'10',density:'compact',fontScale:'100'};
type Theme=typeof defaults;
const key='dental-theme-v1';
function applyTheme(t:Theme){
  const r=document.documentElement.style;
  r.setProperty('--brand',t.primary);r.setProperty('--brand-dark',t.primaryDark);r.setProperty('--surface',t.surface);r.setProperty('--page-bg',t.page);
  r.setProperty('--radius',`${t.radius}px`);r.setProperty('--font-scale',`${Number(t.fontScale)/100}`);
  document.documentElement.dataset.density=t.density;
}
export function AppearanceSettings({open,onClose}:{open:boolean;onClose:()=>void}){
  const [theme,setTheme]=useState<Theme>(defaults);
  useEffect(()=>{const saved=localStorage.getItem(key);const t=saved?{...defaults,...JSON.parse(saved)}:defaults;setTheme(t);applyTheme(t)},[]);
  const update=<K extends keyof Theme>(k:K,v:Theme[K])=>{const t={...theme,[k]:v};setTheme(t);applyTheme(t)};
  const save=()=>{localStorage.setItem(key,JSON.stringify(theme));onClose()};
  const reset=()=>{setTheme(defaults);applyTheme(defaults);localStorage.removeItem(key)};
  return <Modal open={open} title="إعدادات الهوية البصرية" onClose={onClose} width="760px" footer={<><Button variant="ghost" onClick={reset}>استعادة الافتراضي</Button><Button onClick={save}>حفظ الإعدادات</Button></>}>
    <div className="settingsGrid">
      <label className="settingsField"><span>اللون الأساسي</span><input type="color" value={theme.primary} onChange={e=>update('primary',e.target.value)}/></label>
      <label className="settingsField"><span>اللون الأساسي الداكن</span><input type="color" value={theme.primaryDark} onChange={e=>update('primaryDark',e.target.value)}/></label>
      <label className="settingsField"><span>لون البطاقات</span><input type="color" value={theme.surface} onChange={e=>update('surface',e.target.value)}/></label>
      <label className="settingsField"><span>خلفية النظام</span><input type="color" value={theme.page} onChange={e=>update('page',e.target.value)}/></label>
      <label className="settingsField"><span>استدارة العناصر: {theme.radius}px</span><input type="range" min="4" max="18" value={theme.radius} onChange={e=>update('radius',e.target.value)}/></label>
      <label className="settingsField"><span>حجم الخط: {theme.fontScale}%</span><input type="range" min="90" max="115" value={theme.fontScale} onChange={e=>update('fontScale',e.target.value)}/></label>
      <label className="settingsField fullSetting"><span>كثافة الواجهة</span><select value={theme.density} onChange={e=>update('density',e.target.value)}><option value="compact">مضغوط</option><option value="comfortable">مريح</option></select></label>
    </div>
    <div className="themePreview"><div className="previewTitle">معاينة المكونات</div><div className="previewRow"><Button>زر أساسي</Button><Button variant="secondary">زر ثانوي</Button><Button variant="danger">حذف</Button><span className="status waiting">في الانتظار</span></div></div>
  </Modal>;
}
