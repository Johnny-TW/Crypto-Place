import { PrismaClient } from '@prisma/client';
import { users } from './seed-datas/user-data';

const prisma = new PrismaClient();

const main = async () => {
  await seedUsers();
};

const seedUsers = async () => {
  console.log(users);
  if (await prisma.user.findMany()) return;

  for (const data of users) {
    await prisma.user.create({
      data,
    });
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
