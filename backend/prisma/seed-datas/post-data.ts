export interface PostSeedData {
  title: string
  content: string
  order?: number
}

export const postTitles = [
  'Bitcoin Price Analysis: What to Expect in 2024',
  'Ethereum 2.0 Staking Rewards Complete Guide',
  'Understanding DeFi: A Comprehensive Beginner\'s Guide',
  'Weekly Crypto Market Trends Analysis',
  'How to Safely Store Your Cryptocurrency Assets',
  'NFT Market Update: Latest Industry Trends',
  'Altcoin Season 2024: Top Investment Picks',
  'Blockchain Technology in Traditional Finance',
  'Latest Regulatory Updates in Crypto Space',
  'Mining vs Staking: Which Strategy is Better?',
  'Crypto Tax Implications for 2024 Filing',
  'Web3 and the Future of the Internet',
  'Layer 2 Solutions: Scaling Ethereum Ecosystem',
  'Central Bank Digital Currencies (CBDCs) Overview',
  'Crypto Security Best Practices Guide',
  'Technical Analysis: Reading Crypto Charts',
  'Smart Contract Development Tutorial',
  'Yield Farming Strategies and Risks',
  'Cross-Chain Protocols: Bridging Networks',
  'DAO Governance: The Future of Organizations'
]

export const postContents = [
  `The cryptocurrency market continues to evolve rapidly, with Bitcoin maintaining its position as the leading digital asset. Recent developments in institutional adoption have created new momentum in the market.

Key factors influencing Bitcoin's price trajectory include:
- Institutional investment flows
- Regulatory clarity improvements
- Technology upgrades and developments
- Macroeconomic factors

Understanding these elements is crucial for making informed investment decisions in the volatile crypto market.`,

  `Ethereum's transition to Proof of Stake has revolutionized the network's energy consumption and security model. This comprehensive guide covers everything you need to know about ETH 2.0 staking.

Staking benefits include:
- Passive income generation
- Network security participation
- Reduced environmental impact
- Long-term value appreciation potential

Learn how to become a validator or delegate your ETH to earn staking rewards while supporting network decentralization.`,

  `Decentralized Finance (DeFi) represents a paradigm shift in how financial services operate. Built on blockchain technology, DeFi protocols offer traditional financial services without intermediaries.

Popular DeFi applications:
- Lending and borrowing platforms
- Decentralized exchanges (DEXs)
- Yield farming protocols
- Liquidity mining programs

This guide helps beginners navigate the DeFi ecosystem safely while maximizing opportunities for yield generation.`,

  `Our weekly analysis covers major market movements, trending cryptocurrencies, and significant developments across the blockchain ecosystem.

This week's highlights:
- Bitcoin stability above key support levels
- Altcoin momentum in Layer 1 protocols
- DeFi protocol innovations
- NFT marketplace activity

Stay informed with our comprehensive market analysis and make data-driven investment decisions.`,

  `Security is paramount in cryptocurrency ownership. This guide covers essential practices for protecting your digital assets from theft and loss.

Security essentials:
- Hardware wallet usage
- Multi-signature setups
- Seed phrase security
- Regular security audits

Implementing proper security measures protects your investments and ensures long-term peace of mind in crypto ownership.`
]

export const generatePostContent = (): string => {
  const randomContent = postContents[Math.floor(Math.random() * postContents.length)]
  return randomContent
}
