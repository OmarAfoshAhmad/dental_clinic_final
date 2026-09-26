import { Check, Clock3, LogIn, Send } from 'lucide-react';

const items = [
  { label: 'دخول العيادة', name: 'فاطمة خليل', time: '09:42', icon: LogIn, tone: 'sky' },
  { label: 'عند الطبيب', name: 'سارة محمد', time: '10:15', icon: Clock3, tone: 'indigo' },
  { label: 'في الانتظار', name: 'أمل ناصر', time: '10:40', icon: Check, tone: 'emerald' },
  { label: 'إرسال للخزينة', name: 'محمد علي', time: '11:05', icon: Send, tone: 'amber' },
] as const;

export function StatusFooter() {
  return (
    <footer className="statusFooter">
      <div className="statusFooterLabel"><Clock3 size={14} /><b>آخر الحالات المحدثة</b></div>
      <div className="statusFeed">
        {items.map((item) => {
          const Icon = item.icon;
          return <div className={`statusItem ${item.tone}`} key={item.label + item.name}><span className="statusIcon"><Icon size={12} /></span><div><small>{item.label}</small><b>{item.name}</b></div><time>{item.time}</time></div>;
        })}
      </div>
    </footer>
  );
}
