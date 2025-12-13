import { Trophy, DollarSign, Calendar, Code } from 'lucide-react';

interface QuickStatsData {
  market_cap_rank?: number;
  fully_diluted_valuation?: { usd: number };
  market_cap_fdv_ratio?: number;
}

interface CryptoData {
  market_data?: QuickStatsData;
  genesis_date?: string;
  hashing_algorithm?: string;
  block_time_in_minutes?: number;
}

interface QuickStatsProps {
  data: CryptoData | null;
}

const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return 'N/A';
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

function QuickStats({ data }: QuickStatsProps) {
  if (!data) {
    return (
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5'>
        {[1, 2, 3, 4].map(index => (
          <div key={index} className='rounded-lg border bg-card shadow-sm p-6'>
            <div className='h-4 w-16 bg-muted rounded animate-pulse mb-3' />
            <div className='h-6 w-20 bg-muted rounded animate-pulse' />
          </div>
        ))}
      </div>
    );
  }

  const marketCapRank = data.market_data?.market_cap_rank;
  const fdv = data.market_data?.fully_diluted_valuation?.usd;
  const fdvRatio = data.market_data?.market_cap_fdv_ratio;
  const genesisDate = data.genesis_date;
  const hashingAlgorithm = data.hashing_algorithm;
  const blockTime = data.block_time_in_minutes;

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5'>
      {/* Market Cap Rank */}
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='p-2 rounded-md bg-muted'>
            <Trophy className='h-4 w-4 text-muted-foreground' />
          </div>
          <span className='text-xs font-medium text-muted-foreground'>
            Rank
          </span>
        </div>
        <p className='text-2xl font-bold tracking-tight'>
          {marketCapRank ? `#${marketCapRank}` : 'N/A'}
        </p>
      </div>

      {/* Fully Diluted Valuation */}
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='p-2 rounded-md bg-muted'>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </div>
          <span className='text-xs font-medium text-muted-foreground'>FDV</span>
        </div>
        <p className='text-xl font-bold tracking-tight'>{formatNumber(fdv)}</p>
        {fdvRatio !== undefined && fdvRatio !== null && (
          <p className='text-xs text-muted-foreground mt-2'>
            MCap/FDV: {fdvRatio.toFixed(2)}
          </p>
        )}
      </div>

      {/* Genesis Date */}
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='p-2 rounded-md bg-muted'>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </div>
          <span className='text-xs font-medium text-muted-foreground'>
            Genesis
          </span>
        </div>
        <p className='text-sm font-semibold tracking-tight'>
          {formatDate(genesisDate)}
        </p>
      </div>

      {/* Hashing Algorithm */}
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='p-2 rounded-md bg-muted'>
            <Code className='h-4 w-4 text-muted-foreground' />
          </div>
          <span className='text-xs font-medium text-muted-foreground'>
            Algorithm
          </span>
        </div>
        <p className='text-sm font-semibold tracking-tight'>
          {hashingAlgorithm || 'N/A'}
        </p>
        {blockTime !== undefined && blockTime !== null && (
          <p className='text-xs text-muted-foreground mt-2'>
            Block: {blockTime}min
          </p>
        )}
      </div>
    </div>
  );
}

export default QuickStats;
