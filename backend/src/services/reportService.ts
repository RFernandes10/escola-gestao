import ExcelJS from 'exceljs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReportService {
  async generateExcel(): Promise<Buffer> {
    const employees = await prisma.employee.findMany({
      orderBy: { fullName: 'asc' },
    });

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Funcionários');

    ws.columns = [
      { header: 'Nome', key: 'fullName', width: 30 },
      { header: 'Cargo', key: 'position', width: 20 },
      { header: 'Departamento', key: 'department', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Telefone', key: 'phone', width: 15 },
      { header: 'Admissão', key: 'admissionDate', width: 15 },
      { header: 'Status', key: 'status', width: 10 },
    ];

    employees.forEach(emp => ws.addRow(emp));
    return wb.xlsx.writeBuffer() as Promise<Buffer>;
  }
}