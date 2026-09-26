'use client';

import { Bell, CalendarDays, Clock3, Search, Stethoscope, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

function formatArabicDate(date: Date) {
  return new Intl.DateTimeFormat('ar-LY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function Header({ onSearch }: { onSearch: (value: string) => void }) {
  const [value, setValue] = useState('');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const dateLabel = useMemo(() => formatArabicDate(now), [now]);
  const timeLabel = useMemo(
    () => new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(now),
    [now],
  );

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brandIcon"><Stethoscope size={24} strokeWidth={2.2} /></span>
        <div>
          <strong>عيادة دنتال</strong>
          <small>نظام إدارة العيادة</small>
        </div>
      </div>
      <div className="topCenter">
        <span className="badge"><CalendarDays size={14} />{dateLabel}</span>
        <span className="badge"><Clock3 size={14} />{timeLabel}</span>
        <label className="searchBox">
          <Search size={15} />
          <input value={value} onChange={(event) => { const next = event.target.value; setValue(next); onSearch(next); }} placeholder="البحث بالاسم أو رقم الملف أو رقم الجوال ..." />
        </label>
      </div>
      <div className="userArea">
        <button className="notificationButton" type="button" aria-label="الإشعارات"><Bell size={18} /><span>3</span></button>
        <div className="userIdentity">
          <span className="avatar"><UserRound size={17} /></span>
          <div><b>أحمد مدير النظام</b><small>موظف الاستقبال</small></div>
        </div>
      </div>
    </header>
  );
}
