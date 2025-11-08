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
import { Card, CardContent, Typography, Box } from '@mui/material';

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
  // 準備交易量分布數據（取前10大交易對）
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

  // 準備Spread分布數據
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
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Box className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <Typography variant='h6' color='text.secondary' gutterBottom>
                No trading data available
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Unable to load exchange charts at this time
              </Typography>
            </div>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      {/* Statistics Cards */}
      <Box className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent
            sx={{
              backgroundColor: 'white',
              '&:last-child': { pb: 3 },
            }}
          >
            <Box className='flex items-center justify-between'>
              <div>
                <Typography
                  variant='body2'
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Spot Markets
                </Typography>
                <Typography
                  variant='h4'
                  sx={{
                    color: 'text.primary',
                    fontWeight: 700,
                  }}
                >
                  {exchangeDetails.pairs?.toLocaleString()}
                </Typography>
              </div>
            </Box>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent
            sx={{
              backgroundColor: 'white',
              '&:last-child': { pb: 3 },
            }}
          >
            <Box className='flex items-center justify-between'>
              <div>
                <Typography
                  variant='body2'
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  24h Volume
                </Typography>
                <Typography
                  variant='h4'
                  sx={{
                    color: 'text.primary',
                    fontWeight: 700,
                  }}
                >
                  {exchangeDetails.trade_volume_24h_btc?.toLocaleString()} BTC
                </Typography>
              </div>
            </Box>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent
            sx={{
              backgroundColor: 'white',
              '&:last-child': { pb: 3 },
            }}
          >
            <Box className='flex items-center justify-between'>
              <div>
                <Typography
                  variant='body2'
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Trust Score
                </Typography>
                <Typography
                  variant='h4'
                  sx={{
                    color: 'text.primary',
                    fontWeight: 700,
                  }}
                >
                  <i className='fa-solid fa-star' />
                  {exchangeDetails.trust_score}/10
                </Typography>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Charts Area */}
      <Box className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Volume Distribution Bar Chart */}
        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <CardContent
            sx={{
              backgroundColor: 'white',
              '&:last-child': { pb: 3 },
            }}
          >
            <Typography
              variant='h6'
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                mb: 2,
              }}
            >
              Top 10 Trading Pairs by Volume
            </Typography>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart
                data={volumeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='pair'
                  angle={-45}
                  textAnchor='end'
                  height={100}
                  fontSize={12}
                />
                <YAxis
                  tickFormatter={(value: number) =>
                    `$${(value / 1000000).toFixed(0)}M`
                  }
                  fontSize={12}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    'Volume (USD)',
                  ]}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey='volume' fill='#3b82f6' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Spread Distribution Chart */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent
            sx={{
              backgroundColor: 'white',
              '&:last-child': { pb: 3 },
            }}
          >
            <Typography
              variant='h6'
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                mb: 2,
              }}
            >
              Bid-Ask Spread Distribution
            </Typography>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart
                data={spreadData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='range' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='count' fill='#10b981' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default ExchangeCharts;
