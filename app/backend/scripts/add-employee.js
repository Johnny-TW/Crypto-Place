const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// 新增測試員工資料
// 如果已存在則更新資料
// 使用 bcrypt 加密密碼
// 使用 Prisma ORM 進行資料庫操作
// 確保在執行此腳本前已經配置好 Prisma
// 並且已經有一個名為 'user' 的模型
// 在 Prisma schema 中定義了相應的欄位

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
