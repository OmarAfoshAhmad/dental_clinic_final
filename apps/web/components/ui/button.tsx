'use client';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary'|'secondary'|'danger'|'ghost';
export function Button({variant='primary',icon,children,className='',...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:Variant;icon?:ReactNode}){
  return <button {...props} className={`uiButton ${variant} ${className}`}>{icon}{children}</button>;
}
