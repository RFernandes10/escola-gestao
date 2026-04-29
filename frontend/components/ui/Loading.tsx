'use client';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  text?: string;
}

export default function Loading({ text = 'Carregando...' }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-10 h-10 text-brand animate-spin" />
      {text && <p className="mt-4 text-text-muted text-sm">{text}</p>}
    </div>
  );
}