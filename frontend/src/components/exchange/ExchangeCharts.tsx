import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Ticker {
  base: string;
  target: string;
  converted_volume: {
    usd: number;
  };
  bid_ask_spread_percentage?: number;
}

interface ExchangeDetails {
  pairs?: number;
  trade_volume_24h_btc?: number;
  trust_score?: number;
  tickers?: Ticker[];
}

interface ExchangeChartsProps {
  exchangeDetails: ExchangeDetails | null;
}

interface VolumeDataItem {
  pair: string;
  volume: number;
  volumeFormatted: string;
}

interface SpreadDataItem {
  range: string;
  count: number;
}

interface SpreadRanges {
  '0-0.1%': number;
  '0.1-0.5%': number;
  '0.5-1%': number;
  '1%+': number;
}

function ExchangeCharts({ exchangeDetails }: ExchangeChartsProps) {
  // Prepare volume distribution data (top 10 pairs)
  const volumeData = useMemo((): VolumeDataItem[] => {
    if (!exchangeDetails?.tickers) return [];

    return exchangeDetails.tickers
      .slice(0, 10)
      .map((ticker: Ticker) => ({
        pair: `${ticker.base}/${ticker.target}`,
        volume: ticker.converted_volume.usd,
        volumeFormatted: Number(ticker.converted_volume.usd).toLocaleString(
          undefined,
          {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }
        ),
      }))
      .sort((a, b) => b.volume - a.volume);
  }, [exchangeDetails]);

  // Prepare spread distribution data
  const spreadData = useMemo((): SpreadDataItem[] => {
    if (!exchangeDetails?.tickers) return [];

    const spreadRanges: SpreadRanges = {
      '0-0.1%': 0,
      '0.1-0.5%': 0,
      '0.5-1%': 0,
      '1%+': 0,
    };

    exchangeDetails.tickers.forEach((ticker: Ticker) => {
      const spread = ticker.bid_ask_spread_percentage || 0;
      if (spread <= 0.1) {
        spreadRanges['0-0.1%'] += 1;
      } else if (spread <= 0.5) {
        spreadRanges['0.1-0.5%'] += 1;
      } else if (spread <= 1) {
        spreadRanges['0.5-1%'] += 1;
      } else {
        spreadRanges['1%+'] += 1;
      }
    });

    return Object.entries(spreadRanges).map(([range, count]) => ({
      range,
      count,
    }));
  }, [exchangeDetails]);

  if (!exchangeDetails?.tickers || exchangeDetails.tickers.length === 0) {
    return (
      <Card className='border-dashed'>
        <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
          <h3 className='text-lg font-medium text-gray-500 mb-1'>
            No Trading Data
          </h3>
          <p className='text-sm text-gray-400'>
            Charts cannot be loaded at this time
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4'>
      {/* Volume Distribution Bar Chart */}
      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle className='text-base font-bold text-gray-900'>
            Top 10 Trading Pairs (by Volume)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart
              data={volumeData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis
                dataKey='pair'
                angle={-45}
                textAnchor='end'
                height={80}
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                tickFormatter={(value: number) =>
                  `$${(value / 1000000).toFixed(0)}M`
                }
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  'Volume (USD)',
                ]}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar dataKey='volume' fill='#3b82f6' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Spread Distribution Chart */}
      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle className='text-base font-bold text-gray-900'>
            Bid-Ask Spread Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart
              data={spreadData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='range' fontSize={12} tick={{ fill: '#6b7280' }} />
              <YAxis fontSize={12} tick={{ fill: '#6b7280' }} />
              <Tooltip
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar
                dataKey='count'
                fill='#10b981'
                radius={[4, 4, 0, 0]}
                name='Count'
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default ExchangeCharts;
