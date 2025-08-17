const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 新增測試員工資料
// 如果已存在則更新資料
// 使用 bcrypt 加密密碼
// 使用 Prisma ORM 進行資料庫操作
// 確保在執行此腳本前已經配置好 Prisma
// 並且已經有一個名為 'user' 的模型
// 在 Prisma schema 中定義了相應的欄位

async function checkUsers() {
  try {
    console.log('=== 檢查資料庫中的所有用戶 ===');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        chName: true,
        enName: true,
        emplId: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    console.log(`找到 ${users.length} 個用戶:`);
    users.forEach((user, index) => {
      console.log(
        `${index + 1}. ID: ${user.id}, Email: ${user.email}, Name: ${user.name}, chName: ${user.chName}, enName: ${user.enName}, emplId: ${user.emplId}`,
      );
    });

    if (users.length === 0) {
      console.log('資料庫中沒有任何用戶資料');
    }

    const johnnyUser = await prisma.user.findUnique({
      where: { email: 'Johnny_Yeh@wistron.com' },
    });

    if (johnnyUser) {
      console.log('\n=== Johnny_Yeh@wistron.com 用戶詳細資料 ===');
      console.log(johnnyUser);
    } else {
      console.log('\n❌ Johnny_Yeh@wistron.com 用戶不存在');
    }
  } catch (error) {
    console.error('❌ 錯誤:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
