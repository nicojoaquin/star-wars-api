import { PrismaClient, UserRole } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

async function main() {
  if (username.length > 0 && password.length > 0) {
    const hashedPassword = await argon2.hash(password);
    await prisma.user.upsert({
      where: { username },
      update: {},
      create: {
        name: 'Admin',
        username,
        password: hashedPassword,
        role: UserRole.Admin
      }
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.error(error);
    await prisma.$disconnect();
  });
