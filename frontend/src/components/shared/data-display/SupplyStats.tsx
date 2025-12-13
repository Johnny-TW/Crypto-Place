import { Coins, TrendingUp, Infinity as InfinityIcon } from 'lucide-react';

interface SupplyData {
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  max_supply_infinite: boolean;
}

interface CryptoData {
  market_data?: SupplyData;
  symbol?: string;
}

interface SupplyStatsProps {
  data: CryptoData | null;
}

const formatSupply = (supply: number | null): string => {
  if (supply === null) return 'N/A';
  if (supply >= 1000000000) {
    return `${(supply / 1000000000).toFixed(2)}B`;
  }
  if (supply >= 1000000) {
    return `${(supply / 1000000).toFixed(2)}M`;
  }
  return supply.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
};

function SupplyStats({ data }: SupplyStatsProps) {
  if (!data || !data.market_data) {
    return (
      <div className='rounded-lg border bg-card shadow-sm p-6 h-full'>
        <div className='h-6 w-48 bg-muted rounded animate-pulse mb-4' />
        <div className='space-y-4'>
          {[1, 2, 3].map(index => (
            <div key={index} className='flex justify-between items-center'>
              <div className='h-4 w-32 bg-muted rounded animate-pulse' />
              <div className='h-4 w-24 bg-muted rounded animate-pulse' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { circulating_supply, total_supply, max_supply, max_supply_infinite } =
    data.market_data;

  const symbol = (data.symbol || '').toUpperCase();
  const supplyPercentage = max_supply
    ? (circulating_supply / max_supply) * 100
    : total_supply
      ? (circulating_supply / total_supply) * 100
      : 0;

  return (
    <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6 h-full'>
      <div className='flex items-center gap-2 mb-4'>
        <div className='p-2 rounded-md bg-muted'>
          <Coins className='h-5 w-5 text-muted-foreground' />
        </div>
        <h3 className='text-lg font-semibold'>Supply & Economics</h3>
      </div>

      <div className='space-y-4'>
        {/* Circulating Supply */}
        <div className='flex justify-between items-center pb-3 border-b'>
          <div className='flex items-center gap-2'>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm text-muted-foreground'>
              Circulating Supply
            </span>
          </div>
          <span className='text-sm font-semibold'>
            {formatSupply(circulating_supply)} {symbol}
          </span>
        </div>

        {/* Total Supply */}
        <div className='flex justify-between items-center pb-3 border-b'>
          <div className='flex items-center gap-2'>
            <Coins className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm text-muted-foreground'>Total Supply</span>
          </div>
          <span className='text-sm font-semibold'>
            {formatSupply(total_supply)} {symbol}
          </span>
        </div>

        {/* Max Supply */}
        <div className='flex justify-between items-center pb-3 border-b'>
          <div className='flex items-center gap-2'>
            {max_supply_infinite ? (
              <InfinityIcon className='h-4 w-4 text-muted-foreground' />
            ) : (
              <Coins className='h-4 w-4 text-muted-foreground' />
            )}
            <span className='text-sm text-muted-foreground'>Max Supply</span>
          </div>
          <span className='text-sm font-semibold'>
            {max_supply_infinite ? (
              <span className='flex items-center gap-1'>
                <InfinityIcon className='h-4 w-4' />
                <span>Infinite</span>
              </span>
            ) : (
              `${formatSupply(max_supply)} ${symbol}`
            )}
          </span>
        </div>

        {/* Supply Progress Bar (only if max supply exists) */}
        {max_supply && !max_supply_infinite && (
          <div className='pt-2'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-xs text-muted-foreground'>
                Supply Progress
              </span>
              <span className='text-xs font-semibold text-blue-600 dark:text-blue-500'>
                {supplyPercentage.toFixed(2)}%
              </span>
            </div>
            <div className='w-full bg-muted rounded-full h-2.5'>
              <div
                className='bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500'
                style={{ width: `${Math.min(supplyPercentage, 100)}%` }}
              />
            </div>
            <div className='flex justify-between items-center mt-1'>
              <span className='text-xs text-muted-foreground'>
                {formatSupply(circulating_supply)}
              </span>
              <span className='text-xs text-muted-foreground'>
                {formatSupply(max_supply)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupplyStats;
