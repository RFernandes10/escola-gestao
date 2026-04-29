'use client';
import { useEffect, useState } from 'react';
import { getApiInstance } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import Loading from '@/components/ui/Loading';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { ArrowLeft, Mail, Phone, Calendar, Building, Briefcase, UserCheck, LogOut, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Employee {
  id: string;
  fullName: string;
  cpf: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  admissionDate: string;
  photoUrl?: string;
  status: string;
}

export default function EmployeeDetail() {
  const { user, logout, theme } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const isDark = theme === 'dark';

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

  useEffect(() => {
    const fetchEmployee = async () => {
      const id = params.id as string;
      if (!id) return;
      
      try {
        const api = getApiInstance();
        const res = await api.get(`/employees/${id}`);
        setEmployee(res.data.data || res.data);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || 'Erro ao carregar funcionário');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [params.id, router]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const getPhotoUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${apiUrl}${url}`;
  };

  const formatCPF = (cpf: string) => {
    if (!cpf) return '-';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  if (loading) {
    return <Loading text="Carregando detalhes..." />;
  }

  if (!employee) {
    return null;
  }

  const initials = employee.fullName?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div style={{ backgroundColor: 'var(--bg-marketing)', minHeight: '100vh' }}>
      <header style={{ backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border-subtle)' }} className="sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={() => router.push('/dashboard')} className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <ArrowLeft className="w-4 h-4" />
              Funcionários
            </button>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user?.name}</span>
            <button onClick={() => { logout(); router.push('/login'); }} className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div 
            className="rounded-xl overflow-hidden"
            style={{ 
              backgroundColor: 'var(--bg-surface)', 
              border: '1px solid var(--border-standard)' 
            }}
          >
            <div className="flex">
              <div className="w-32 h-32 shrink-0 relative" style={{ background: isDark ? 'linear-gradient(135deg, #5e6ad2 0%, #4a5590 100%)' : 'linear-gradient(135deg, #5e6ad2 0%, #7170ff 100%)' }}>
                {employee.photoUrl ? (
                  <img src={getPhotoUrl(employee.photoUrl) || ''} alt={employee.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                    {initials}
                  </div>
                )}
                <div 
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ 
                    backgroundColor: employee.status === 'ACTIVE' ? '#10b981' : '#ef4444',
                    color: 'white',
                    border: '3px solid var(--bg-surface)'
                  }}
                >
                  {employee.status === 'ACTIVE' ? 'A' : 'I'}
                </div>
              </div>
              
              <div className="flex-1 p-5">
                <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {employee.fullName}
                </h1>
                <p className="text-sm font-medium mb-3" style={{ color: '#7170ff' }}>
                  {employee.position}
                </p>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Building className="w-3.5 h-3.5" />
                  {employee.department}
                  <span>•</span>
                  <Calendar className="w-3.5 h-3.5" />
                  Desde {formatDate(employee.admissionDate)}
                </div>
              </div>
            </div>
            
            <div className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="p-5 grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Informações Pessoais</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                      <div>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>CPF</p>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatCPF(employee.cpf)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                      <div>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Telefone</p>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{employee.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Contato</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                      <div>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Email</p>
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{employee.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {user?.role === 'DIRECTOR' && (
              <div className="p-4 border-t flex justify-end" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  onClick={() => router.push(`/admin?edit=${employee.id}`)}
                  className="px-4 py-2 rounded-md font-medium text-sm text-white"
                  style={{ backgroundColor: '#5e6ad2' }}
                >
                  Editar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}