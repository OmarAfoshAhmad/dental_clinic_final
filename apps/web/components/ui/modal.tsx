'use client';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
export function Modal({open,title,onClose,children,footer,width='640px'}:{open:boolean;title:string;onClose:()=>void;children:ReactNode;footer?:ReactNode;width?:string}){
  if(!open)return null;
  return <div className="modalBackdrop" role="presentation" onMouseDown={onClose}>
    <section className="modalPanel" style={{maxWidth:width}} role="dialog" aria-modal="true" onMouseDown={e=>e.stopPropagation()}>
      <header className="modalHeader"><strong>{title}</strong><button type="button" onClick={onClose} aria-label="إغلاق"><X size={17}/></button></header>
      <div className="modalBody">{children}</div>
      {footer&&<footer className="modalFooter">{footer}</footer>}
    </section>
  </div>;
}
