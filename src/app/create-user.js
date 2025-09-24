
// import { PrismaClient } from '@prisma/client';
// const { PrismaClient } = require('@prisma/client');

const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function main() {
  // Créer un nouvel utilisateur
  const newUser = await prisma.user.create({
    data: {
      name: 'Yoyo',
      username: 'deuxieme',
      pwd: 'test',
      levelId: 1,
      role: 'admin',
    },
  });

  console.log(newUser);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });