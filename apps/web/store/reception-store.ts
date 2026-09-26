import { create } from 'zustand';
export type ReceptionDialog='edit'|'appointment'|'visits'|'delete'|'settings'|null;
type ReceptionState={
  selectedPatientId:string|null;
  dialog:ReceptionDialog;
  setSelectedPatientId:(id:string|null)=>void;
  openDialog:(dialog:Exclude<ReceptionDialog,null>)=>void;
  closeDialog:()=>void;
};
export const useReceptionStore=create<ReceptionState>((set)=>({
  selectedPatientId:null,dialog:null,
  setSelectedPatientId:(selectedPatientId)=>set({selectedPatientId}),
  openDialog:(dialog)=>set({dialog}),
  closeDialog:()=>set({dialog:null}),
}));
