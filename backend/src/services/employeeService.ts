import { prisma } from '../config/env';
import { CreateEmployeeDTO, UpdateEmployeeDTO } from '../validators/employeeValidator';

export class EmployeeService {
  async list(page: number, limit: number, search?: string, department?: string) {
    const where: any = {};
    if (search) {
      where.fullName = { contains: search, mode: 'insensitive' };
    }
    if (department) {
      where.department = department;
    }

    const [data, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fullName: 'asc' },
      }),
      prisma.employee.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw { status: 404, message: 'Funcionário não encontrado' };
    return employee;
  }

  async create(data: CreateEmployeeDTO, photoUrl?: string) {
    const existingCpf = await prisma.employee.findUnique({ where: { cpf: data.cpf } });
    if (existingCpf) {
      throw { status: 400, message: 'CPF já cadastrado' };
    }

    const existingEmail = await prisma.employee.findUnique({ where: { email: data.email } });
    if (existingEmail) {
      throw { status: 400, message: 'Email já cadastrado' };
    }

    return prisma.employee.create({
      data: {
        ...data,
        photoUrl,
        admissionDate: new Date(data.admissionDate),
      },
    });
  }

  async update(id: string, data: UpdateEmployeeDTO, photoUrl?: string) {
    await this.getById(id); // throws if not found

    if (data.cpf) {
      const existingCpf = await prisma.employee.findFirst({ 
        where: { cpf: data.cpf, NOT: { id } } 
      });
      if (existingCpf) {
        throw { status: 400, message: 'CPF já cadastrado para outro funcionário' };
      }
    }

    if (data.email) {
      const existingEmail = await prisma.employee.findFirst({ 
        where: { email: data.email, NOT: { id } } 
      });
      if (existingEmail) {
        throw { status: 400, message: 'Email já cadastrado para outro funcionário' };
      }
    }

    return prisma.employee.update({
      where: { id },
      data: {
        ...data,
        ...(photoUrl && { photoUrl }),
        ...(data.admissionDate && { admissionDate: new Date(data.admissionDate) }),
      },
    });
  }

  async delete(id: string) {
    await this.getById(id);
    return prisma.employee.delete({ where: { id } });
  }

  async toggleStatus(id: string, status: string) {
    await this.getById(id);
    const newStatus = status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
    return prisma.employee.update({
      where: { id },
      data: { status: newStatus as any },
    });
  }
}