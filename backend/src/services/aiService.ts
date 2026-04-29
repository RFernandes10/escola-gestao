import { VertexAI, Content, Part } from '@google-cloud/vertexai';
import { EmployeeService } from './employeeService';

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT || 'escola-gestao',
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
});

const model = 'gemini-2.0-flash-001';

export class AIService {
  private employeeService = new EmployeeService();

  private getTextFromResponse(response: any): string {
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      return 'Sem resposta da IA.';
    }
    const content = candidates[0].content;
    if (!content || !content.parts || content.parts.length === 0) {
      return 'Sem conteúdo na resposta.';
    }
    return content.parts.map((part: Part) => part.text || '').join('');
  }

  async summarizeEmployees(): Promise<string> {
    const result = await this.employeeService.list(1, 100);
    const employees = result.data;

    if (employees.length === 0) {
      return 'Nenhum funcionário cadastrado no sistema.';
    }

    const activeCount = employees.filter(e => e.status === 'ACTIVE').length;
    const inactiveCount = employees.length - activeCount;

    const byDepartment: Record<string, number> = {};
    employees.forEach(emp => {
      byDepartment[emp.department] = (byDepartment[emp.department] || 0) + 1;
    });

    const prompt = `
Você é um assistente administrativo da Escola Gestão. Com base nos dados abaixo, faça um resumo executivo em português do Brasil:

Total de funcionários: ${employees.length}
Ativos: ${activeCount}
Inativos: ${inactiveCount}

Por departamento:
${Object.entries(byDepartment).map(([dept, count]) => `- ${dept}: ${count} funcionário(s)`).join('\n')}

Liste os funcionários:
${employees.map(e => `- ${e.fullName} (${e.position}) - ${e.department} - ${e.status}`).join('\n')}

Forneça um resumo profissional em 3-4 parágrafos com Insights sobre a equipe.
    `;

    const generativeModel = vertexAI.preview.getGenerativeModel({
      model,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const resultAI = await generativeModel.generateContent(prompt);
    return this.getTextFromResponse(resultAI);
  }

  async analyzeData(): Promise<string> {
    const result = await this.employeeService.list(1, 100);
    const employees = result.data;

    if (employees.length === 0) {
      return 'Nenhum dado para analisar.';
    }

    const activeCount = employees.filter(e => e.status === 'ACTIVE').length;
    const inactiveCount = employees.length - activeCount;

    const byDepartment: Record<string, number> = {};
    employees.forEach(emp => {
      byDepartment[emp.department] = (byDepartment[emp.department] || 0) + 1;
    });

    const prompt = `
Você é um analista de dados RH. Analise os dados abaixo e forneça insights em português do Brasil:

**Estatísticas:**
- Total: ${employees.length} funcionários
- Ativos: ${activeCount} (${Math.round(activeCount/employees.length*100)}%)
- Inativos: ${inactiveCount} (${Math.round(inactiveCount/employees.length*100)}%)

**Por Departamento:**
${Object.entries(byDepartment).map(([dept, count]) => `- ${dept}: ${count} (${Math.round(count/employees.length*100)}%)`).join('\n')}

Forneça:
1. Uma análise breve da distribuição da equipe
2. Pontos de atenção (ex: desbalanceamento, turnover)
3.Recomendações para a gestão de pessoas
    `;

    const generativeModel = vertexAI.preview.getGenerativeModel({
      model,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const resultAI = await generativeModel.generateContent(prompt);
    return this.getTextFromResponse(resultAI);
  }

  async generateReport(): Promise<string> {
    const result = await this.employeeService.list(1, 100);
    const employees = result.data;

    if (employees.length === 0) {
      return 'Nenhum funcionário para gerar relatório.';
    }

    const activeCount = employees.filter(e => e.status === 'ACTIVE').length;
    const inactiveCount = employees.length - activeCount;

    const byDepartment: Record<string, number> = {};
    employees.forEach(emp => {
      byDepartment[emp.department] = (byDepartment[emp.department] || 0) + 1;
    });

    const prompt = `
Você é um assistente administrativo. Gere um relatório profissional em português do Brasil sobre a equipe da Escola:

# Relatório de Equipe

## Summary
- Total de funcionários: ${employees.length}
- Ativos: ${activeCount}
- Inativos: ${inactiveCount}

## Distribuição por Departamento
${Object.entries(byDepartment).map(([dept, count]) => `| ${dept} | ${count} | ${Math.round(count/employees.length*100)}% |`).join('\n')}

## Lista de Funcionários
${employees.map(e => `| ${e.fullName} | ${e.position} | ${e.department} | ${e.email} | ${e.phone} | ${e.status} |`).join('\n')}

Gere um relatório executive completo em formato markdown.
    `;

    const generativeModel = vertexAI.preview.getGenerativeModel({
      model,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    });

    const resultAI = await generativeModel.generateContent(prompt);
    return this.getTextFromResponse(resultAI);
  }
}