import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { users } from './seed-datas/user-data';
import { cryptos } from './seed-datas/crypto-data';
import { generatePostContent } from './seed-datas/post-data';

const prisma = new PrismaClient();

// 完整腳本，涵蓋多個實體並包含配置選項
const SEED_CONFIG = {
  CLEAR_DATABASE: true,
  GENERATE_ADDITIONAL_USERS: true,
  ADDITIONAL_USER_COUNT: 20,
  GENERATE_POSTS: true,
  POST_COUNT: 25,
  GENERATE_WATCHLISTS: true,
  PRICE_VARIATION_ENABLED: true,
};

// 用 bcrypt 雜湊密碼
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// 清理現有數據庫記錄
async function cleanDatabase() {
  if (!SEED_CONFIG.CLEAR_DATABASE) return;

  console.log('🧹 Cleaning existing database...');

  // Delete in correct order due to foreign key constraints
  await prisma.watchlist.deleteMany();
  await prisma.post.deleteMany();
  await prisma.crypto.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Database cleaned successfully');
}

// 使用者數據
async function seedUsers() {
  console.log('👥 Seeding users...');

  const allUsers = [...users];

  // 生成額外的使用者
  for (const user of allUsers) {
    user.password = await hashPassword(user.password);
  }

  // 完整腳本，涵蓋多個實體並包含配置選項
  const createdUsers = [];
  for (const userData of allUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData as any,
    });
    createdUsers.push(user);
  }

  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
}

async function seedCryptos() {
  console.log('🪙 Seeding cryptocurrencies...');

  const createdCryptos = [];

  for (const cryptoData of cryptos) {
    let finalData = { ...cryptoData };

    // Use original data without variation

    const crypto = await prisma.crypto.upsert({
      where: { id: cryptoData.id },
      update: finalData,
      create: finalData,
    });

    createdCryptos.push(crypto);
  }

  console.log(`✅ Created ${createdCryptos.length} cryptocurrencies`);
  return createdCryptos;
}

// Posts 數據
async function seedPosts(users: any[]) {
  if (!SEED_CONFIG.GENERATE_POSTS) return [];

  console.log(`📝 Seeding ${SEED_CONFIG.POST_COUNT} posts...`);

  const posts = [];

  // 生成額外的隨機文章
  const basicPosts = [
    {
      title: 'Bitcoin Price Analysis 2024',
      content: generatePostContent(),
      authorId: users[0].id,
      order: 1,
    },
    {
      title: 'Ethereum Staking Guide',
      content: generatePostContent(),
      authorId: users[1].id,
      order: 2,
    },
    {
      title: 'DeFi Investment Strategies',
      content: generatePostContent(),
      authorId: users[2] ? users[2].id : users[0].id,
      order: 3,
    },
  ];
  posts.push(...basicPosts);

  const createdPosts = await prisma.post.createMany({
    data: posts,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${createdPosts.count} posts`);
  return createdPosts;
}

async function seedWatchlists(users: any[], cryptos: any[]) {
  if (!SEED_CONFIG.GENERATE_WATCHLISTS) return [];

  console.log('👀 Seeding watchlists...');

  const watchlists = [];

  // Add basic watchlist entries
  if (users.length > 0) {
    const user1Cryptos = cryptos.slice(0, 3);
    for (const crypto of user1Cryptos) {
      watchlists.push({
        userId: users[0].id,
        coinId: crypto.id,
        coinName: crypto.name,
        symbol: crypto.symbol,
        image: crypto.image,
      });
    }

    if (users.length > 1) {
      const user2Cryptos = cryptos.slice(2, 6);
      for (const crypto of user2Cryptos) {
        watchlists.push({
          userId: users[1].id,
          coinId: crypto.id,
          coinName: crypto.name,
          symbol: crypto.symbol,
          image: crypto.image,
        });
      }
    }
  }

  const createdWatchlists = await prisma.watchlist.createMany({
    data: watchlists,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${createdWatchlists.count} watchlist entries`);
  return createdWatchlists;
}

async function displaySummary() {
  console.log('\n📊 Database Summary:');

  const [userCount, cryptoCount, postCount, watchlistCount] = await Promise.all(
    [
      prisma.user.count(),
      prisma.crypto.count(),
      prisma.post.count(),
      prisma.watchlist.count(),
    ],
  );

  console.log(`👥 Total Users: ${userCount}`);
  console.log(`🪙 Total Cryptocurrencies: ${cryptoCount}`);
  console.log(`📝 Total Posts: ${postCount}`);
  console.log(`👀 Total Watchlist Entries: ${watchlistCount}`);

  console.log('\n🔐 Test Credentials:');
  console.log('🔑 Admin: admin@cryptoplace.com / admin123');
  console.log('🔑 Manager: manager@cryptoplace.com / admin123');
  console.log('🔑 User: alice@cryptoplace.com / user123');
  console.log('🔑 User: bob@cryptoplace.com / user123');
  console.log('🔑 User: charlie@cryptoplace.com / user123');
  console.log('🔑 Other Users: [generated emails] / user123');
}

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');
  console.log(`📋 Configuration:`);
  console.log(`   - Clear Database: ${SEED_CONFIG.CLEAR_DATABASE}`);
  console.log(
    `   - Generate Additional Users: ${SEED_CONFIG.GENERATE_ADDITIONAL_USERS} (${SEED_CONFIG.ADDITIONAL_USER_COUNT})`,
  );
  console.log(
    `   - Generate Posts: ${SEED_CONFIG.GENERATE_POSTS} (${SEED_CONFIG.POST_COUNT})`,
  );
  console.log(`   - Generate Watchlists: ${SEED_CONFIG.GENERATE_WATCHLISTS}`);
  console.log(`   - Price Variation: ${SEED_CONFIG.PRICE_VARIATION_ENABLED}\n`);

  try {
    // Clean database
    await cleanDatabase();

    // Seed all entities
    const users = await seedUsers();
    const cryptos = await seedCryptos();
    await seedPosts(users);
    await seedWatchlists(users, cryptos);

    // Display results
    await displaySummary();

    console.log('\n🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('💥 Critical seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('🔌 Disconnecting from database...');
    await prisma.$disconnect();
  });
