'use client';
import { useState } from 'react';
import { getApiInstance } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Users, LogOut, UserCheck, FileText, Brain, BarChart3, FilePlus, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AIReportsPage() {
  const { user, logout, theme } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [report, setReport] = useState('');

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const api = getApiInstance();
      const res = await api.get('/api/ai/summarize');
      setSummary(res.data.summary);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Erro ao gerar resumo');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const api = getApiInstance();
      const res = await api.get('/api/ai/analyze');
      setAnalysis(res.data.analysis);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Erro ao analisar');
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    setLoading(true);
    try {
      const api = getApiInstance();
      const res = await api.get('/api/ai/report');
      setReport(res.data.report);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
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
              <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Users className="w-4 h-4" />
                Funcionários
              </button>
              {user?.role === 'DIRECTOR' && (
                <button onClick={() => router.push('/admin')} className="flex items-center gap-2 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <UserCheck className="w-4 h-4" />
                  RH
                </button>
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
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="w-8 h-8" style={{ color: '#7170ff' }} />
          <h1 className="text-2xl font-medium" style={{ color: 'var(--text-primary)' }}>Relatórios IA</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handleSummarize}
            disabled={loading}
            className="p-4 rounded-lg flex items-center gap-4 transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-standard)' }}
          >
            <Brain className="w-10 h-10" style={{ color: '#7170ff' }} />
            <div className="text-left">
              <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Resumo IA</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Gere um resumo executivo da equipe</p>
            </div>
          </button>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="p-4 rounded-lg flex items-center gap-4 transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-standard)' }}
          >
            <BarChart3 className="w-10 h-10" style={{ color: '#7170ff' }} />
            <div className="text-left">
              <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Análise de Dados</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Insights e recomendações da equipe</p>
            </div>
          </button>

          <button
            onClick={handleReport}
            disabled={loading}
            className="p-4 rounded-lg flex items-center gap-4 transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-standard)' }}
          >
            <FileText className="w-10 h-10" style={{ color: '#7170ff' }} />
            <div className="text-left">
              <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Relatório Completo</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Gere um relatório detalhado</p>
            </div>
          </button>
        </div>

        {loading && <Loading text="Gerando com IA..." />}

        {summary && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Brain className="w-5 h-5" style={{ color: '#7170ff' }} />
              Resumo Executivo
            </h2>
            <div 
              className="p-6 rounded-lg"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-standard)' }}
            >
              {summary.split('\n').map((line, i) => (
                line.trim() ? <p key={i} className="mb-2" style={{ color: 'var(--text-secondary)' }}>{line}</p> : <br key={i} />
              ))}
            </div>
          </div>
        )}

        {analysis && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <BarChart3 className="w-5 h-5" style={{ color: '#7170ff' }} />
              Análise e Recomendações
            </h2>
            <div 
              className="p-6 rounded-lg"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-standard)' }}
            >
              {analysis.split('\n').map((line, i) => (
                line.trim() ? <p key={i} className="mb-2" style={{ color: 'var(--text-secondary)' }}>{line}</p> : <br key={i} />
              ))}
            </div>
          </div>
        )}

        {report && (
          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <FilePlus className="w-5 h-5" style={{ color: '#7170ff' }} />
              Relatório Completo
            </h2>
            <div 
              className="p-6 rounded-lg overflow-auto"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-standard)' }}
            >
              <pre className="whitespace-pre-wrap text-sm" style={{ color: 'var(--text-secondary)' }}>
                {report}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}