'use client';

import { useAuth } from '@/hooks/useAuth';

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

interface EmployeeCardProps {
  employee: Employee;
}

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  const { theme } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';
  const isDark = theme === 'dark';

  const getPhotoUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  const initials = employee.fullName?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div 
      className="overflow-hidden transition-all hover:-translate-y-0.5 rounded-lg"
      style={{ 
        backgroundColor: 'var(--bg-surface)', 
        border: '1px solid var(--border-standard)'
      }}
    >
      <div className="p-4 flex items-center gap-4">
        <div 
          className="w-16 h-16 rounded-full shrink-0 overflow-hidden flex items-center justify-center"
          style={{ background: isDark ? 'linear-gradient(135deg, #5e6ad2 0%, #4a5590 100%)' : 'linear-gradient(135deg, #5e6ad2 0%, #7170ff 100%)' }}
        >
          {employee.photoUrl ? (
            <img 
              src={getPhotoUrl(employee.photoUrl)} 
              alt={employee.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-medium text-white">
              {initials}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 
              className="font-medium truncate" 
              style={{ color: 'var(--text-primary)' }}
              title={employee.fullName}
            >
              {employee.fullName}
            </h3>
            <span 
              className={`w-2 h-2 rounded-full shrink-0 ${employee.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}
            />
          </div>
          <p className="text-sm truncate" style={{ color: '#7170ff' }}>
            {employee.position}
          </p>
          <p className="text-xs mt-1 truncate" style={{ color: 'var(--text-muted)' }}>
            {employee.department}
          </p>
        </div>
      </div>
    </div>
  );
}