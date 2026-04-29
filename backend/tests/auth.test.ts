import request from 'supertest';
import { app } from '../src/app';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.user.create({
    data: {
      email: 'diretor@escola.com',
      password: await hashPassword('123456'),
      name: 'Diretor Teste',
      role: 'DIRECTOR',
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /api/auth/login', () => {
  it('deve autenticar com credenciais corretas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'diretor@escola.com', password: '123456' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('DIRECTOR');
  });

  it('deve rejeitar credenciais inválidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'diretor@escola.com', password: 'errada' });
    expect(res.status).toBe(401);
  });
});