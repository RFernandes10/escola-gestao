'use client';
import { useEffect, useState } from 'react';
import { getApiInstance } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import EmployeeCard from '@/components/employees/EmployeeCard';
import Loading from '@/components/ui/Loading';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Pagination from '@/components/ui/Pagination';
import { Search, Users, LogOut, UserCheck, X } from 'lucide-react';
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

export default function Dashboard() {
  const { user, logout, theme } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const api = getApiInstance();
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', '12');
      if (search) params.append('search', search);
      if (dept) params.append('department', dept);

      const res = await api.get(`/employees?${params}`);
      const data = res.data;
      
      if (data.data) {
        setEmployees(data.data);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || data.data.length);
      } else {
        setEmployees(data);
        setTotal(data.length);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, dept, page]);

  useEffect(() => {
    setPage(1);
  }, [search, dept]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const clearFilters = () => {
    setSearch('');
    setDept('');
  };

  const handleCardClick = (employee: Employee) => {
    router.push(`/employee/${employee.id}`);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-marketing)', minHeight: '100vh' }}>
      <header style={{ backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border-subtle)' }} className="sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-medium flex items-center gap-3">
              <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: '#5e6ad2' }}>
                <span className="text-white font-bold">E</span>
              </div>
              <span style={{ color: 'var(--text-primary)' }}>Escola Gestão</span>
            </h1>
            <nav className="flex items-center gap-6">
              <a href="/dashboard" className="flex items-center gap-2 font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                <Users className="w-4 h-4" />
                Funcionários
              </a>
              {user?.role === 'DIRECTOR' && (
                <a href="/admin" className="flex items-center gap-2 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <UserCheck className="w-4 h-4" />
                  RH
                </a>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user?.name}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm px-3 py-2 rounded-md transition-colors" style={{ color: 'var(--text-tertiary)' }}>
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-medium mb-6" style={{ color: 'var(--text-primary)' }}>Funcionários</h1>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-md"
              style={{ 
                backgroundColor: 'var(--bg-surface)', 
                border: '1px solid var(--border-standard)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={dept} 
              onChange={e => setDept(e.target.value)} 
              className="px-4 py-3 rounded-md"
              style={{ 
                backgroundColor: 'var(--bg-surface)', 
                border: '1px solid var(--border-standard)',
                color: 'var(--text-secondary)'
              }}
            >
              <option value="">Todos os dept</option>
              <option value="TI">TI</option>
              <option value="Pedagógico">Pedagógico</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Secretaria">Secretaria</option>
              <option value="Direção">Direção</option>
            </select>
            {(search || dept) && (
              <button 
                onClick={clearFilters}
                className="px-4 py-3 rounded-md flex items-center gap-2"
                style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {loading ? (
          <Loading text="Carregando funcionários..." />
        ) : employees.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
            <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>Nenhum funcionário encontrado</p>
            <p style={{ color: 'var(--text-muted)' }}>Tente ajustar sua busca ou adicionar novos colaboradores</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {employees.map(emp => (
              <div key={emp.id} onClick={() => handleCardClick(emp)} className="cursor-pointer">
                <EmployeeCard employee={emp} />
              </div>
            ))}
          </div>
        )}
        
        {!loading && totalPages > 1 && (
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={setPage} 
          />
        )}
        
        {!loading && employees.length > 0 && (
          <div className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Mostrando {employees.length} de {total} funcionário{total !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}