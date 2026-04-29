import { Router, Response } from 'express';
import { EmployeeController } from '../controllers/employeeController';
import { EmployeeService } from '../services/employeeService';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import jwt from 'jsonwebtoken';

const router = Router();
const service = new EmployeeService();
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
};

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const token = req.query.token as string || req.headers.authorization?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      res.status(401).json({ message: 'Token required' });
      return;
    }
    
    const result = await service.list(1, 1000);
    const employees = result.data;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Funcionários');

    worksheet.columns = [
      { header: 'Nome', key: 'fullName', width: 30 },
      { header: 'CPF', key: 'cpf', width: 15 },
      { header: 'Cargo', key: 'position', width: 20 },
      { header: 'Departamento', key: 'department', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Telefone', key: 'phone', width: 15 },
      { header: 'Data Admissão', key: 'admissionDate', width: 15 },
      { header: 'Status', key: 'status', width: 10 },
    ];

    employees.forEach(emp => {
      worksheet.addRow({
        ...emp,
        admissionDate: emp.admissionDate ? new Date(emp.admissionDate).toLocaleDateString('pt-BR') : '',
        status: emp.status === 'ACTIVE' ? 'Ativo' : 'Inativo',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=funcionarios.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Erro ao exportar Excel' });
  }
});

router.get('/pdf', async (req: AuthRequest, res: Response) => {
  try {
    const token = req.query.token as string || req.headers.authorization?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      res.status(401).json({ message: 'Token required' });
      return;
    }
    
    const result = await service.list(1, 1000);
    const employees = result.data;

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=funcionarios.pdf');

    doc.pipe(res);

    doc.fontSize(20).text('Relatório de Funcionários', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Total: ${employees.length} funcionário(s)`, { align: 'center' });
    doc.moveDown(2);

    const tableTop = 150;
    let position = tableTop;

    doc.fontSize(10);
    doc.font('Helvetica-Bold');
    doc.text('Nome', 50, position, { width: 150 });
    doc.text('CPF', 200, position, { width: 100 });
    doc.text('Cargo', 300, position, { width: 100 });
    doc.text('Departamento', 400, position, { width: 100 });
    doc.text('Status', 500, position, { width: 50 });
    doc.moveDown();

    doc.font('Helvetica').fontSize(9);
    employees.forEach(emp => {
      position += 20;
      if (position > 700) {
        doc.addPage();
        position = 50;
      }
      doc.text(emp.fullName.substring(0, 25), 50, position, { width: 150 });
      doc.text(emp.cpf || '-', 200, position, { width: 100 });
      doc.text(emp.position.substring(0, 15), 300, position, { width: 100 });
      doc.text(emp.department.substring(0, 15), 400, position, { width: 100 });
      doc.text(emp.status === 'ACTIVE' ? 'Ativo' : 'Inativo', 500, position, { width: 50 });
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao exportar PDF' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const employee = await service.getById(id);
    res.json(employee);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
});

export { router as reportRoutes };