import { prisma } from './config/env';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@escola.com' },
    update: {},
    create: {
      email: 'admin@escola.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'DIRECTOR',
    },
  });
  
  console.log('Admin criado:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());