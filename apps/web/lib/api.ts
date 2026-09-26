export type Patient = {
  id: string;
  fileNumber: number;
  fullName: string;
  phone: string;
  secondaryPhone?: string | null;
  birthDate?: string | null;
  gender: 'FEMALE' | 'MALE';
  age: number | null;
  address: string | null;
  clinic: { id: string; name: string } | null;
  doctor: { id: string; name: string } | null;
  updatedAt: string;
  latestVisit?: { id: string; type: VisitType; status: VisitStatus; visitedAt: string } | null;
};

export type VisitType =
  | 'NEW_CONSULTATION'
  | 'REVIEW'
  | 'FOLLOW_UP'
  | 'EMERGENCY'
  | 'RADIOLOGY'
  | 'DIRECT_PROCEDURE'
  | 'CONSULTATION';

export type VisitStatus =
  | 'REGISTERED'
  | 'ARRIVED'
  | 'WAITING'
  | 'CALLED'
  | 'WITH_DOCTOR'
  | 'PROCEDURE_REQUIRED'
  | 'SENT_TO_TREASURY'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'RETURN_TO_DOCTOR'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type Visit = {
  id: string;
  type: VisitType;
  status: VisitStatus;
  visitedAt: string;
  notes: string | null;
  clinic: { id?: string; name: string } | null;
  doctor: { id?: string; name: string } | null;
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
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error((await response.text()) || 'حدث خطأ في الاتصال بالخادم');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  patients: {
    list: (search = '') =>
      request<Patient[]>(`/patients?search=${encodeURIComponent(search)}`),
    get: (id: string) => request<Patient>(`/patients/${id}`),
    create: (data: unknown) =>
      request<Patient>('/patients', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: unknown) =>
      request<Patient>(`/patients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    remove: (id: string) =>
      request<void>(`/patients/${id}`, { method: 'DELETE' }),
    appointment: (id: string, data: unknown) =>
      request(`/patients/${id}/appointments`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  visits: {
    create: (data: unknown) =>
      request<Visit>('/visits', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    listForPatient: (patientId: string) =>
      request<Visit[]>(`/visits/patient/${patientId}`),
  },
  queue: {
    list: () => request<QueueEntry[]>('/queue'),
    send: (patientId: string, status: 'IN_CLINIC' | 'TREASURY') =>
      request<QueueEntry>('/queue', {
        method: 'POST',
        body: JSON.stringify({ patientId, status }),
      }),
  },
};
