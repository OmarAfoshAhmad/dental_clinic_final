export type Patient = {
  id: string;
  fileNumber: number;
  fullName: string;
  phone: string;
  age: number | null;
  address: string | null;
  clinic: { id: string; name: string } | null;
  doctor: { id: string; name: string } | null;
  updatedAt: string;
};

export type QueueEntry = {
  id: string;
  arrivedAt: string;
  status: 'WAITING' | 'WITH_DOCTOR' | 'IN_CLINIC' | 'TREASURY';
  patient: Patient;
  clinic: { id: string; name: string } | null;
  doctor: { id: string; name: string } | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'حدث خطأ في الاتصال بالخادم');
  }

  return response.json() as Promise<T>;
}

export const api = {
  patients: {
    list: (search = '') => request<Patient[]>(`/patients?search=${encodeURIComponent(search)}`),
    create: (data: unknown) => request<Patient>('/patients', { method: 'POST', body: JSON.stringify(data) }),
  },
  queue: {
    list: () => request<QueueEntry[]>('/queue'),
  },
};
