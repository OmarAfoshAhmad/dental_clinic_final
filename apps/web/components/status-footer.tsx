'use client';

import { useQuery } from '@tanstack/react-query';
import { Check, Clock3, LogIn, Send } from 'lucide-react';
import { api, type QueueEntry } from '@/lib/api';

const presentation = {
  IN_CLINIC: { label: 'دخول العيادة', tone: 'sky', icon: LogIn },
  WITH_DOCTOR: { label: 'عند الطبيب', tone: 'indigo', icon: Clock3 },
  WAITING: { label: 'في الانتظار', tone: 'emerald', icon: Check },
  TREASURY: { label: 'إرسال للخزينة', tone: 'amber', icon: Send },
} as const;

function formatTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value));
}

export function StatusFooter() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['queue'],
    queryFn: api.queue.list,
    refetchInterval: 15_000,
  });

  const items = [...data]
    .sort((a, b) => new Date(b.arrivedAt).getTime() - new Date(a.arrivedAt).getTime())
    .slice(0, 4);

  return (
    <footer className="statusFooter">
      <div className="statusFooterLabel">
        <Clock3 size={14} />
        <b>آخر الحالات المحدثة</b>
      </div>

      <div className="statusFeed">
        {isLoading ? (
          <span className="statusFeedEmpty">جارٍ تحميل الحالات...</span>
        ) : items.length === 0 ? (
          <span className="statusFeedEmpty">لا توجد حالات محدثة حالياً</span>
        ) : (
          items.map((item: QueueEntry) => {
            const config = presentation[item.status];
            const Icon = config.icon;

            return (
              <div className={`statusItem ${config.tone}`} key={item.id}>
                <span className="statusIcon"><Icon size={12} /></span>
                <div>
                  <small>{config.label}</small>
                  <b>{item.patient.fullName}</b>
                </div>
                <time>{formatTime(item.arrivedAt)}</time>
              </div>
            );
          })
        )}
      </div>
    </footer>
  );
}
