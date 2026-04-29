import { prisma } from '../config/env';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'DIRECTOR' | 'USER';
}

export class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !comparePassword(password, user.password)) {
      throw new Error('Credenciais inválidas');
    }

    const token = generateToken({ sub: user.id, role: user.role });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async register(data: RegisterData) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || 'USER',
      },
    });

    const token = generateToken({ sub: user.id, role: user.role });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async getById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}