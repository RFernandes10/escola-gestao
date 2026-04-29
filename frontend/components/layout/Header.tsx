'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-blue-600">Escola Gestão</h1>
          <nav className="flex gap-4">
            <a href="/dashboard" className="text-gray-600 hover:text-blue-600">
              Funcionários
            </a>
            {user?.role === 'DIRECTOR' && (
              <a href="/admin" className="text-gray-600 hover:text-blue-600">
                Admin
              </a>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.name}</span>
          <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}