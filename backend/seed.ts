import 'dotenv/config';
import { prisma } from './src/config/env';
import { hashPassword } from './src/utils/password';

async function seed() {
  console.log('Criando usuário inicial...');

  const existingUser = await prisma.user.findUnique({
    where: { email: 'admin@escola.com' }
  });

  if (existingUser) {
    console.log('Usuário admin já existe');
    return;
  }

  const user = await prisma.user.create({
    data: {
      email: 'admin@escola.com',
      password: hashPassword('admin123'),
      name: 'Administrador',
      role: 'DIRECTOR'
    }
  });

  console.log(`Usuário criado: ${user.email} (${user.role})`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());