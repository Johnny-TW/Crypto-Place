import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { users } from './seed-datas/user-data'
import { cryptos } from './seed-datas/crypto-data'

const prisma = new PrismaClient()

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

async function cleanDatabase() {
  console.log('🧹 Cleaning existing database...')

  await prisma.watchlist.deleteMany()
  await prisma.post.deleteMany()
  await prisma.crypto.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Database cleaned')
}

async function seedUsers() {
  console.log('👥 Seeding users...')

  const createdUsers = []

  for (const userData of users) {
    const hashedPassword = await hashPassword(userData.password)

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: hashedPassword,
        isActive: userData.isActive ?? true,
        role: userData.role ?? 'USER',
      },
    })

    createdUsers.push(user)
  }

  console.log(`✅ Created ${createdUsers.length} users`)
  return createdUsers
}

async function seedCryptos() {
  console.log('🪙 Seeding cryptocurrencies...')

  const createdCryptos = []

  for (const cryptoData of cryptos) {
    const crypto = await prisma.crypto.upsert({
      where: { id: cryptoData.id },
      update: cryptoData,
      create: cryptoData,
    })

    createdCryptos.push(crypto)
  }

  console.log(`✅ Created ${createdCryptos.length} cryptocurrencies`)
  return createdCryptos
}

async function seedPosts(users: any[]) {
  console.log('📝 Seeding posts...')

  const posts = [
    {
      title: 'Bitcoin Price Analysis 2024',
      content: 'Comprehensive analysis of Bitcoin price movements and market trends for 2024.',
      authorId: users[0].id,
      order: 1,
    },
    {
      title: 'Ethereum Staking Guide',
      content: 'Complete guide to Ethereum 2.0 staking rewards and validator requirements.',
      authorId: users[1].id,
      order: 2,
    },
    {
      title: 'DeFi Investment Strategies',
      content: 'Understanding decentralized finance protocols and yield farming opportunities.',
      authorId: users[2] ? users[2].id : users[0].id,
      order: 3,
    },
  ]

  const createdPosts = await prisma.post.createMany({
    data: posts,
    skipDuplicates: true,
  })

  console.log(`✅ Created ${createdPosts.count} posts`)
  return createdPosts
}

async function seedWatchlists(users: any[], cryptos: any[]) {
  console.log('👀 Seeding watchlists...')

  const watchlists = []

  // Add some watchlist entries for the first few users
  if (users.length > 0 && cryptos.length > 0) {
    const user1 = users[0]
    const user2 = users[1]

    // User 1 watches Bitcoin, Ethereum, BNB
    const user1Cryptos = cryptos.slice(0, 3)
    for (const crypto of user1Cryptos) {
      watchlists.push({
        userId: user1.id,
        coinId: crypto.id,
        coinName: crypto.name,
        symbol: crypto.symbol,
        image: crypto.image,
      })
    }

    // User 2 watches different coins
    const user2Cryptos = cryptos.slice(2, 6)
    for (const crypto of user2Cryptos) {
      watchlists.push({
        userId: user2.id,
        coinId: crypto.id,
        coinName: crypto.name,
        symbol: crypto.symbol,
        image: crypto.image,
      })
    }
  }

  const createdWatchlists = await prisma.watchlist.createMany({
    data: watchlists,
    skipDuplicates: true,
  })

  console.log(`✅ Created ${createdWatchlists.count} watchlist entries`)
  return createdWatchlists
}

async function displaySummary() {
  console.log('\n📊 Database Summary:')

  const [userCount, cryptoCount, postCount, watchlistCount] = await Promise.all([
    prisma.user.count(),
    prisma.crypto.count(),
    prisma.post.count(),
    prisma.watchlist.count(),
  ])

  console.log(`👥 Users: ${userCount}`)
  console.log(`🪙 Cryptocurrencies: ${cryptoCount}`)
  console.log(`📝 Posts: ${postCount}`)
  console.log(`👀 Watchlist entries: ${watchlistCount}`)

  console.log('\n🔐 Test Credentials:')
  console.log('Admin: admin@cryptoplace.com / admin123')
  console.log('Manager: manager@cryptoplace.com / admin123')
  console.log('User: alice@cryptoplace.com / user123')
  console.log('User: bob@cryptoplace.com / user123')
  console.log('User: charlie@cryptoplace.com / user123')
}

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    await cleanDatabase()

    const users = await seedUsers()
    const cryptos = await seedCryptos()
    await seedPosts(users)
    await seedWatchlists(users, cryptos)

    await displaySummary()

    console.log('\n🎉 Database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('💥 Critical error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
