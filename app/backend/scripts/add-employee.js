const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addEmployee() {
  try {
    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await prisma.user.findUnique({
      where: { email: 'Johnny_Yeh@wistron.com' },
    });

    if (existingUser) {
      console.log('用戶已存在，更新資料...');

      const updatedUser = await prisma.user.update({
        where: { email: 'Johnny_Yeh@wistron.com' },
        data: {
          name: 'Johnny Yeh',
          password: hashedPassword,
          emplId: '11003736',
          enName: 'Johnny Yeh',
          chName: '葉育銓',
          jobTitle: 'Engineer',
          email: 'Johnny_Yeh@wistron.com',
          phone: '10495',
          office: '006',
          deptId: 'EX0600',
          deptDescr: '數位系統開發六部',
          supvEmplId: '10603706',
          site: 'WHC',
          emplCategoryA: 'IDL',
          bg: 'ENBG',
          fnLvl1: 'EX',
          fnLvl2: 'DS',
          deptRoleName: 'Member',
          deptRoleAbbr: 'Member',
        },
      });

      console.log('✅ 員工資料更新成功:', updatedUser);
    } else {
      console.log('創建新用戶...');

      const newUser = await prisma.user.create({
        data: {
          email: 'Johnny_Yeh@wistron.com',
          name: 'Johnny Yeh',
          password: hashedPassword,
          role: 'USER',
          emplId: '11003736',
          enName: 'Johnny Yeh',
          chName: '葉育銓',
          jobTitle: 'Engineer',
          phone: '10495',
          office: '006',
          deptId: 'EX0600',
          deptDescr: '數位系統開發六部',
          supvEmplId: '10603706',
          site: 'WHC',
          emplCategoryA: 'IDL',
          bg: 'ENBG',
          fnLvl1: 'EX',
          fnLvl2: 'DS',
          deptRoleName: 'Member',
          deptRoleAbbr: 'Member',
        },
      });

      console.log('✅ 員工資料創建成功:', newUser);
    }
  } catch (error) {
    console.error('❌ 錯誤:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addEmployee();
