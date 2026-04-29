'use client';
import { useState } from 'react';
import api from '@/lib/api';

export default function EmployeeForm({ onSuccess }: { onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    if (file) form.set('photo', file);

    await api.post('/employees', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* inputs para fullName, position, etc. */}
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded" />}
      <button type="submit">Salvar</button>
    </form>
  );
}