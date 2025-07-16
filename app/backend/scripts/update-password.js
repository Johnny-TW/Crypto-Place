const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function updatePassword() {
  try {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('123456', saltRounds);

    const updatedUser = await prisma.user.update({
      where: { email: 'Johnny_Yeh@wistron.com' },
      data: {
        password: hashedPassword,
      },
    });

    console.log('✅ 密碼更新成功:', updatedUser.email);
  } catch (error) {
    console.error('❌ 錯誤:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword();
