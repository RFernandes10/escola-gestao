'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Toaster, toast } from 'react-hot-toast';
import { Mail, Lock, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Toaster />
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#5e6ad2] rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">E</span>
          </div>
          <h1 className="text-2xl font-medium tracking-tight mb-1">
            Escola Gestão
          </h1>
          <p className="text-[color:var(--text-tertiary)]">Faça login para continuar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 rounded-lg" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-md"
                  style={{ 
                    backgroundColor: 'var(--bg-marketing)', 
                    border: '1px solid var(--border-standard)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-md"
                  style={{ 
                    backgroundColor: 'var(--bg-marketing)', 
                    border: '1px solid var(--border-standard)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-md font-medium text-white transition-all"
              style={{ backgroundColor: '#5e6ad2' }}
            >
              <LogIn className="w-5 h-5" />
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}