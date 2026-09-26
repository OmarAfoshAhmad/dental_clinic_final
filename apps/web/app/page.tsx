'use client';
import { useState } from 'react';
import { Header } from '@/components/header';
import { PatientForm } from '@/components/patient-form';
import { PatientsTable } from '@/components/patients-table';
import { QuickActions } from '@/components/quick-actions';
import { QueueTable } from '@/components/queue-table';
import { StatusFooter } from '@/components/status-footer';
import { ReceptionDialogs } from '@/components/reception-dialogs';
export default function HomePage(){const[search,setSearch]=useState('');return <main className="appShell"><Header onSearch={setSearch}/><div className="dashboard"><section className="receptionColumn"><PatientForm/></section><section className="recordsColumn"><PatientsTable search={search}/><QuickActions/><QueueTable/></section></div><StatusFooter/><ReceptionDialogs/></main>}
