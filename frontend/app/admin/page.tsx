'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getApiInstance } from '@/contexts/AuthContext';
import { formatPhone, formatDate, formatDateToISO, formatCPF, cleanCPF } from '@/hooks/useMask';
import { Search, Plus, Pencil, Trash2, LogOut, Users, UserCheck, X, Power, PowerOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Loading from '@/components/ui/Loading';

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

interface FormErrors {
  fullName?: string;
  cpf?: string;
  position?: string;
  department?: string;
  email?: string;
  phone?: string;
  admissionDate?: string;
}

export default function AdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    admissionDate: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome é obrigatório';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Nome deve ter pelo menos 3 caracteres';
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (formData.cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF inválido';
    }
    
    if (!formData.position.trim()) {
      newErrors.position = 'Cargo é obrigatório';
    }
    
    if (!formData.department) {
      newErrors.department = 'Departamento é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }
    
    if (!formData.admissionDate) {
      newErrors.admissionDate = 'Data de admissão é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'DIRECTOR') {
      router.push('/dashboard');
    } else {
      fetchEmployees();
    }
  }, [user, router]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const api = getApiInstance();
      const params = search ? `?search=${search}&limit=100` : '?limit=100';
      const res = await api.get(`/employees${params}`);
      setEmployees(res.data.data || res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Preencha todos os campos corretamente');
      return;
    }
    
    setSaving(true);
    try {
      const formDataToSend = new FormData();
      
      const formattedData = {
        ...formData,
        cpf: cleanCPF(formData.cpf),
        admissionDate: formatDateToISO(formData.admissionDate)
      };
      
      Object.entries(formattedData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (file) formDataToSend.append('photo', file);

      const api = getApiInstance();
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}`, formDataToSend);
        toast.success('Funcionário atualizado!');
      } else {
        await api.post('/employees', formDataToSend);
        toast.success('Funcionário cadastrado!');
      }

      setShowModal(false);
      resetForm();
      fetchEmployees();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Confirmar exclusão?')) {
      try {
        const api = getApiInstance();
        await api.delete(`/employees/${id}`);
        toast.success('Funcionário excluído!');
        fetchEmployees();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Erro ao excluir');
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? 'ativar' : 'inativar';
    
    if (confirm(`Confirmar ${action}?`)) {
      try {
        const api = getApiInstance();
        await api.patch(`/employees/${id}/status`, { status: newStatus });
        toast.success(newStatus === 'ACTIVE' ? 'Funcionário ativado!' : 'Funcionário inativado!');
        fetchEmployees();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Erro ao alterar status');
      }
    }
  };

  const openEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      fullName: emp.fullName,
      cpf: emp.cpf || '',
      position: emp.position,
      department: emp.department,
      email: emp.email,
      phone: emp.phone,
      admissionDate: emp.admissionDate?.split('T')[0] || '',
    });
    setErrors({});
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingEmployee(null);
    setFormData({
      fullName: '',
      cpf: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      admissionDate: '',
    });
    setErrors({});
    setFile(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-bg-marketing">
      <header className="bg-bg-panel border-b border-border-subtle sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-medium flex items-center gap-3 text-text-primary">
              <div className="w-8 h-8 bg-brand rounded-md flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              Escola Gestão
            </h1>
            <nav className="flex items-center gap-6">
              <a href="/dashboard" className="flex items-center gap-2 font-medium text-sm text-text-secondary">
                <Users className="w-4 h-4" />
                Funcionários
              </a>
              <a href="/ai" className="flex items-center gap-2 font-medium text-sm text-text-secondary">
                <UserCheck className="w-4 h-4" />
                Relatórios IA
              </a>
              {user?.role === 'DIRECTOR' && (
                <a href="/admin" className="text-accent flex items-center gap-2 font-medium text-sm">
                  <UserCheck className="w-4 h-4" />
                  RH
                </a>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">{user?.name}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-text-tertiary hover:text-red-400 px-3 py-2 rounded-md hover:bg-white/5 transition-colors">
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-medium tracking-tight text-text-primary">Gerenciar Equipe</h1>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-bg-surface border border-border-standard rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:shadow-focus"
              />
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.open((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api') + '/reports?token=' + localStorage.getItem('token'), '_blank')}
                className="flex items-center gap-2 px-3 py-2 bg-bg-surface border border-border-standard rounded-md font-medium text-sm text-text-secondary hover:text-text-primary transition-all"
                title="Exportar Excel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button>
              <button 
                onClick={() => window.open((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api') + '/reports/pdf?token=' + localStorage.getItem('token'), '_blank')}
                className="flex items-center gap-2 px-3 py-2 bg-bg-surface border border-border-standard rounded-md font-medium text-sm text-text-secondary hover:text-text-primary transition-all"
                title="Exportar PDF"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </button>
              <button 
                onClick={() => { resetForm(); setShowModal(true); }} 
                className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-accent-hover rounded-md font-medium text-white text-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Novo
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading text="Carregando funcionários..." />
        ) : (
          <div className="bg-bg-surface border border-border-standard rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-bg-elevated border-b border-border-subtle">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Nome</th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">CPF</th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Cargo</th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Departamento</th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-medium text-text-primary">{emp.fullName}</td>
                    <td className="px-5 py-4 text-text-secondary font-mono text-sm">{emp.cpf || '-'}</td>
                    <td className="px-5 py-4 text-text-secondary">{emp.position}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-brand/20 text-accent text-xs font-medium rounded-full">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        emp.status === 'ACTIVE' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {emp.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleToggleStatus(emp.id, emp.status)} 
                          className={`p-2 rounded-md transition-colors ${
                            emp.status === 'ACTIVE' 
                              ? 'text-text-tertiary hover:text-orange-400 hover:bg-orange-400/10' 
                              : 'text-text-tertiary hover:text-green-400 hover:bg-green-400/10'
                          }`}
                          title={emp.status === 'ACTIVE' ? 'Inativar' : 'Ativar'}
                        >
                          {emp.status === 'ACTIVE' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => openEdit(emp)} 
                          className="p-2 text-text-tertiary hover:text-accent hover:bg-accent/10 rounded-md transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(emp.id)} 
                          className="p-2 text-text-tertiary hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <Users className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-50" />
                      <p className="text-text-secondary">Nenhum funcionário cadastrado</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface border border-border-standard rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border-subtle">
              <h2 className="text-lg font-medium text-text-primary">
                {editingEmployee ? 'Editar' : 'Novo'} Funcionário
              </h2>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Nome Completo</label>
                <input 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })} 
                  className={`w-full px-4 py-3 bg-bg-marketing border rounded-md text-text-primary focus:outline-none focus:shadow-focus transition-all ${errors.fullName ? 'border-red-400' : 'border-border-standard'}`}
                />
                {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">CPF</label>
                <input 
                  name="cpf" 
                  value={formData.cpf} 
                  onChange={e => setFormData({ ...formData, cpf: formatCPF(e.target.value) })} 
                  placeholder="000.000.000-00"
                  className={`w-full px-4 py-3 bg-bg-marketing border rounded-md text-text-primary focus:outline-none focus:shadow-focus transition-all ${errors.cpf ? 'border-red-400' : 'border-border-standard'}`}
                />
                {errors.cpf && <p className="text-red-400 text-xs mt-1">{errors.cpf}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Cargo</label>
                <input 
                  name="position" 
                  value={formData.position} 
                  onChange={e => setFormData({ ...formData, position: e.target.value })} 
                  className={`w-full px-4 py-3 bg-bg-marketing border rounded-md text-text-primary focus:outline-none focus:shadow-focus transition-all ${errors.position ? 'border-red-400' : 'border-border-standard'}`}
                />
                {errors.position && <p className="text-red-400 text-xs mt-1">{errors.position}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Departamento</label>
                <select 
                  name="department" 
                  value={formData.department} 
                  onChange={e => setFormData({ ...formData, department: e.target.value })} 
                  className={`w-full px-4 py-3 bg-bg-marketing border rounded-md text-text-primary focus:outline-none focus:shadow-focus transition-all ${errors.department ? 'border-red-400' : 'border-border-standard'}`}
                >
                  <option value="">Selecione</option>
                  <option value="TI">TI</option>
                  <option value="Pedagógico">Pedagógico</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Secretaria">Secretaria</option>
                  <option value="Direção">Direção</option>
                </select>
                {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
                <input 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })} 
                  className={`w-full px-4 py-3 bg-bg-marketing border rounded-md text-text-primary focus:outline-none focus:shadow-focus transition-all ${errors.email ? 'border-red-400' : 'border-border-standard'}`}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Telefone</label>
                <input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={e => setFormData({ ...formData, phone: formatPhone(e.target.value) })} 
                  placeholder="(00) 00000-0000"
                  className={`w-full px-4 py-3 bg-bg-marketing border rounded-md text-text-primary focus:outline-none focus:shadow-focus transition-all ${errors.phone ? 'border-red-400' : 'border-border-standard'}`}
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Data de Admissão</label>
                <input 
                  name="admissionDate" 
                  type="date"
                  value={formData.admissionDate} 
                  onChange={e => setFormData({ ...formData, admissionDate: e.target.value })} 
                  className={`w-full px-4 py-3 bg-bg-marketing border rounded-md text-text-primary focus:outline-none focus:shadow-focus transition-all ${errors.admissionDate ? 'border-red-400' : 'border-border-standard'}`}
                />
                {errors.admissionDate && <p className="text-red-400 text-xs mt-1">{errors.admissionDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Foto</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setFile(e.target.files?.[0] || null)} 
                  className="w-full px-4 py-3 bg-bg-marketing border border-border-standard rounded-md text-text-primary focus:outline-none focus:shadow-focus"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-border-standard rounded-md text-text-secondary font-medium transition-colors hover:bg-bg-elevated"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-brand hover:bg-accent-hover rounded-md font-medium text-white transition-colors disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : editingEmployee ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}