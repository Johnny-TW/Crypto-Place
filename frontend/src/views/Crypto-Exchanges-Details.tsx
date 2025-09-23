/* eslint-disable react/jsx-max-depth */
import { useEffect, useMemo } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Paper } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import {
  BsFacebook,
  BsReddit,
  BsTelegram,
  BsTwitter,
  BsGlobe,
} from 'react-icons/bs';

import LogoClouds from '@components/common/LogoClouds';
import ExchangeCharts from '@components/exchange/ExchangeCharts';

// Define types for exchange and ticker data
interface TickerData {
  coin_id: string;
  name: string;
  base: string;
  target: string;
  market: {
    identifier: string;
    name: string;
  };
  last: number;
  volume: number;
  converted_volume: {
    usd: number;
  };
  coin_mcap_usd?: number;
  bid_ask_spread_percentage: number;
  last_fetch_at: string;
  trade_url: string;
  trust_score: string;
  is_anomaly: boolean;
  is_stale: boolean;
  target_coin_id: string;
}

interface ExchangeDetails {
  id: string;
  name: string;
  image: string;
  url: string;
  year_established: number | null;
  country: string;
  description: string;
  has_trading_incentive: boolean;
  trust_score: number;
  trust_score_rank: number;
  trade_volume_24h_btc: number;
  trade_volume_24h_btc_normalized: number;
  centralized: boolean;
  coins: number;
  pairs: number;
  facebook_url?: string;
  reddit_url?: string;
  telegram_url?: string;
  twitter_handle?: string;
  other_url_1?: string;
  other_url_2?: string;
  tickers?: TickerData[];
}

interface RouteParams {
  exchangeId: string;
}

interface ExchangeDetailsState {
  data: ExchangeDetails | null;
  loading: boolean;
  error: string | null;
}

interface RootState {
  cryptoExchangesDetails: ExchangeDetailsState;
}

// Secure HTML sanitization function to prevent XSS attacks
const sanitizeHtml = (html: string | null | undefined): string => {
  if (!html) return '';
  let cleaned = html;
  let prevLength;
  // Repeatedly strip HTML tags until none remain to handle nested tags
  do {
    prevLength = cleaned.length;
    cleaned = cleaned.replace(/<[^>]*>/g, '');
  } while (cleaned.length !== prevLength);
  // Also decode HTML entities for safety
  const textarea = document.createElement('textarea');
  textarea.innerHTML = cleaned;
  return textarea.value;
};

function CryptoExchangesDetails() {
  const dispatch = useDispatch();
  const { exchangeId } = useParams<RouteParams>();
  const { data: exchangeDetails, loading: isLoading } = useSelector(
    (state: RootState) => state.cryptoExchangesDetails
  );

  // eslint-disable-next-line no-console
  console.log(exchangeId);

  useEffect(() => {
    if (exchangeId) {
      dispatch({ type: 'FETCH_EXCHANGE_DETAILS', payload: exchangeId });
    }
  }, [exchangeId, dispatch]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'coin_id',
        headerName: 'Coin',
        minWidth: 120,
        align: 'left',
        headerAlign: 'left',
        renderCell: (
          params: GridCellParams<Record<string, unknown>, string>
        ) => (
          <div className='flex items-center gap-2'>
            <span className='font-medium text-gray-900'>{params.value}</span>
          </div>
        ),
      },
      {
        field: 'pair',
        headerName: 'Trading Pair',
        minWidth: 180,
        align: 'left',
        headerAlign: 'left',
        renderCell: (
          params: GridCellParams<Record<string, unknown>, string>
        ) => (
          <div className='flex items-center gap-2'>
            <span className='font-medium text-gray-900'>{params.value}</span>
          </div>
        ),
      },
      {
        field: 'price',
        headerName: 'Price',
        minWidth: 120,
        align: 'right',
        headerAlign: 'right',
        renderCell: (
          params: GridCellParams<Record<string, unknown>, unknown>
        ) => (
          <span className='font-medium text-gray-900'>
            ${String(params.value)}
          </span>
        ),
      },
      {
        field: 'volume',
        headerName: '24h Volume',
        minWidth: 160,
        align: 'right',
        headerAlign: 'right',
        renderCell: (
          params: GridCellParams<Record<string, unknown>, unknown>
        ) => (
          <span className='font-medium text-gray-900'>
            ${String(params.value)}
          </span>
        ),
      },
      {
        field: 'volume_percentage',
        headerName: 'Volume %',
        minWidth: 120,
        align: 'right',
        headerAlign: 'right',
        renderCell: (
          params: GridCellParams<Record<string, unknown>, unknown>
        ) => {
          return (
            <span className='font-medium text-gray-900'>
              {String(params.value)}%
            </span>
          );
        },
      },
      {
        field: 'market_cap',
        headerName: 'Market Cap (USD)',
        minWidth: 160,
        align: 'right',
        headerAlign: 'right',
        renderCell: (
          params: GridCellParams<Record<string, unknown>, unknown>
        ) => (
          <span className='font-medium text-gray-900'>
            ${String(params.value) || 'N/A'}
          </span>
        ),
      },
      {
        field: 'base_volume',
        headerName: 'Base Volume',
        minWidth: 140,
        align: 'right',
        headerAlign: 'right',
        renderCell: (
          params: GridCellParams<Record<string, unknown>, unknown>
        ) => (
          <span className='font-medium text-gray-900'>
            {String(params.value)}
          </span>
        ),
      },
      {
        field: 'spread',
        headerName: 'Spread',
        minWidth: 100,
        align: 'right',
        headerAlign: 'right',
        renderCell: (
          params: GridCellParams<Record<string, unknown>, unknown>
        ) => {
          return (
            <span className='font-medium text-gray-900'>
              {String(params.value)}
            </span>
          );
        },
      },
      {
        field: 'updated',
        headerName: 'Last Updated',
        minWidth: 180,
        align: 'center',
        headerAlign: 'center',
        renderCell: (
          params: GridCellParams<Record<string, unknown>, unknown>
        ) => {
          // 確保 params.value 是有效日期
          const date = new Date(String(params.value));
          // 檢查日期有效性
          const formattedDate = !Number.isNaN(date.getTime())
            ? date
                .toLocaleString('en-CA', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })
                .replace(/,/, '')
                .replace(/(\d+)\/(\d+)\/(\d+) (\d+:\d+:\d+)/, '$3-$1-$2 - $4')
            : 'Invalid Date'; // 備用顯示

          return (
            <span className='font-medium text-gray-900'>{formattedDate}</span>
          );
        },
      },
      {
        field: 'trust_score',
        headerName: 'Trust Score',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        renderCell: (
          params: GridCellParams<Record<string, unknown>, unknown>
        ) => {
          const getTrustScoreInfo = (value: string) => {
            if (value === 'green')
              return {
                color: 'bg-green-500',
                text: 'High',
                textColor: 'text-green-700',
              };
            if (value === 'yellow')
              return {
                color: 'bg-yellow-500',
                text: 'Medium',
                textColor: 'text-yellow-700',
              };
            return {
              color: 'bg-red-500',
              text: 'Low',
              textColor: 'text-red-700',
            };
          };
          const info = getTrustScoreInfo(String(params.value));
          return (
            <div className='flex items-center gap-2'>
              <div className={`w-3 h-3 rounded-full ${info.color}`} />
              <span className={`text-xs font-medium ${info.textColor}`}>
                {info.text}
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const processedTickers = useMemo(() => {
    if (!exchangeDetails?.tickers) return [];

    // 計算總交易量以便計算百分比
    const totalVolume = exchangeDetails.tickers.reduce(
      (sum: number, ticker: TickerData) => {
        return sum + Number(ticker.converted_volume?.usd || 0);
      },
      0
    );

    return exchangeDetails.tickers.map((ticker: TickerData) => {
      const tickerVolume = Number(ticker.converted_volume?.usd || 0);
      const volumePercentage =
        totalVolume > 0
          ? ((tickerVolume / totalVolume) * 100).toFixed(2)
          : '0.00';

      const { market } = ticker;

      return {
        coins: `${ticker.coin_id || ''}`,
        name: `${ticker.name || ''}`,
        base: `${ticker.base || ''}_${ticker.target || ''}_${market?.identifier || ''}`,
        id: `${ticker.base || ''}_${ticker.target || ''}_${market?.identifier || ''}`,
        pair: `${ticker.base || ''}/${ticker.target || ''}`,
        price: Number(ticker.last || 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
        }),
        volume: Number(ticker.converted_volume?.usd || 0).toLocaleString(
          undefined,
          {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }
        ),
        volume_percentage: volumePercentage,
        market_cap: ticker.coin_mcap_usd
          ? Number(ticker.coin_mcap_usd).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
          : null,
        spread: `${Number(ticker.bid_ask_spread_percentage || 0).toFixed(2)}`,
        updated: ticker.last_fetch_at,
        trade_url: ticker.trade_url,
        base_volume: Number(ticker.volume || 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
        }),
        market_name: market?.name || '',
        trust_score: ticker.trust_score,
        is_anomaly: ticker.is_anomaly,
        is_stale: ticker.is_stale,
        coin_id: ticker.coin_id,
        target_coin_id: ticker.target_coin_id,

        // 假設性數據 - 實際應用中需要根據歷史數據計算
        volume_change_24h: Math.random() * 40 - 20, // 模擬 -20% 到 +20% 的變化
      };
    });
  }, [exchangeDetails?.tickers]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500' />
      </div>
    );
  }

  const links = [
    {
      name: 'Website',
      link: exchangeDetails?.url,
      icon: BsGlobe,
    },
    {
      name: 'Facebook',
      link: exchangeDetails?.facebook_url,
      icon: BsFacebook,
    },
    {
      name: 'Reddit',
      link: exchangeDetails?.reddit_url,
      icon: BsReddit,
    },
    {
      name: 'Twitter',
      link: exchangeDetails?.twitter_handle
        ? `https://twitter.com/${exchangeDetails.twitter_handle}`
        : null,
      icon: BsTwitter,
    },
    {
      name: 'Telegram',
      link: exchangeDetails?.telegram_url,
      icon: BsTelegram,
    },
  ].filter(link => link.link && link.link !== '' && link.link !== '#');

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className='overflow-hidden w-full'>
      <div className='mx-auto sm:px-6'>
        <div className='mx-auto grid max-w-full grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2'>
          {/* Exchange Details */}
          <div className=''>
            <div className='w-full max-w-full'>
              <div className='flex items-center space-x-4 mt-5'>
                <img
                  className='w-16 h-16 rounded-2xl shadow-lg object-cover border-4 border-white'
                  src={exchangeDetails?.image || ''}
                  alt={exchangeDetails?.name || ''}
                />
                <div className='text-left flex-col items-center space-y-2'>
                  <div className='flex items-center gap-3'>
                    <p className='text-pretty text-3xl font-semibold tracking-tight text-gray-900 sm:text-1xl'>
                      {exchangeDetails?.name || ''}
                    </p>
                    <div className='flex items-center gap-2'>
                      {exchangeDetails?.centralized === true && (
                        <span className='inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10'>
                          CEX
                        </span>
                      )}
                      {exchangeDetails?.centralized === false && (
                        <span className='inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10'>
                          DEX
                        </span>
                      )}
                      {exchangeDetails && exchangeDetails.trust_score >= 8 ? (
                        <span className='inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10'>
                          ⭐ Trusted
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              {/* Applicant Information */}
              <div>
                <div className='px-4 sm:px-0 mt-5'>
                  <h3 className='text-base/7 font-semibold text-gray-900'>
                    Applicant Information
                  </h3>
                  <p className='mt-1 max-w-2xl text-sm/6 text-gray-500'>
                    Personal details and application.
                  </p>
                </div>
                <div className='mt-6 border-t border-gray-300'>
                  <dl className='divide-y divide-gray-300'>
                    <div className='px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                      <dt className='text-sm/6 font-semibold text-gray-900'>
                        Trust Score
                      </dt>
                      <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                        {exchangeDetails?.trust_score ?? 'N/A'}
                      </dd>
                    </div>
                    <div className='px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                      <dt className='text-sm/6 font-semibold text-gray-900'>
                        24h Trading Volume
                      </dt>
                      <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                        {exchangeDetails?.trade_volume_24h_btc ?? 'N/A'} BTC
                      </dd>
                    </div>
                    <div className='px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                      <dt className='text-sm/6 font-semibold text-gray-900'>
                        24h Trading Volume Btc Normalized
                      </dt>
                      <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                        {exchangeDetails?.trade_volume_24h_btc_normalized ??
                          'N/A'}
                      </dd>
                    </div>
                    <div className='px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                      <dt className='text-sm/6 font-semibold text-gray-900'>
                        Trust Score Rank
                      </dt>
                      <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                        #{exchangeDetails?.trust_score_rank ?? 'N/A'}
                      </dd>
                    </div>
                    <div className='px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                      <dt className='text-sm/6 font-semibold text-gray-900'>
                        Number of Coins
                      </dt>
                      <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                        {exchangeDetails?.coins?.toLocaleString() ?? 'N/A'}{' '}
                        coins
                      </dd>
                    </div>
                    <div className='px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                      <dt className='text-sm/6 font-semibold text-gray-900'>
                        Country
                      </dt>
                      <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                        {exchangeDetails?.country ?? 'N/A'}
                      </dd>
                    </div>
                    <div className='px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                      <dt className='text-sm/6 font-semibold text-gray-900'>
                        Year Established
                      </dt>
                      <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                        {exchangeDetails?.year_established ?? 'N/A'}
                      </dd>
                    </div>
                    <div className='px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                      <dt className='text-sm/6 font-semibold text-gray-900'>
                        Pairs
                      </dt>
                      <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                        {exchangeDetails?.pairs ?? 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className=''>
            <div className='relative max-lg:row-start-1'>
              {/* Exchange Description */}
              <div className='mt-6 text-lg/8 text-gray-600 max-w-full'>
                <div className='mt-6 text-base text-gray-950 max-w-full'>
                  <h1 className='font-bold text-lg mb-2'>
                    About {exchangeDetails?.name || 'Exchange'}
                  </h1>
                  <div className='text-sm'>
                    {exchangeDetails?.description ? (
                      <p>{sanitizeHtml(exchangeDetails?.description)}</p>
                    ) : null}
                  </div>
                </div>
              </div>
              <dl className='mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none'>
                {links.map(link => (
                  <div key={link.name} className='relative pl-9'>
                    <dt className='inline font-semibold text-gray-900'>
                      <link.icon
                        aria-hidden='true'
                        className='absolute left-1 top-1 h-5 w-5'
                      />
                      <a
                        href={link.link || '#'}
                        className='inline-flex items-center px-4 py-2 text-black text-sm font-medium rounded-md border border-gray'
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label={link.name}
                      >
                        {link.name}
                      </a>
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        {/* 圖表統計區域 */}
        <div className='mt-8 mb-8'>
          <div className='mb-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Exchange Analytics
            </h2>
          </div>
          <ExchangeCharts exchangeDetails={exchangeDetails} />
        </div>

        {/* 交易對數據表格 */}
        <div className='mb-8'>
          <div className='mb-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Trading Pairs
            </h2>
            <p className='text-gray-600'>
              Real-time trading data for all available pairs on{' '}
              {exchangeDetails?.name || 'this exchange'}
            </p>
          </div>
          <Paper
            className='shadow-sm border border-gray-200 rounded-xl overflow-hidden'
            sx={{ height: '100%', width: '100%' }}
            elevation={0}
          >
            <DataGrid
              rows={processedTickers}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[10, 20, 30, 40, 50]}
              sx={{
                cursor: 'pointer',
                backgroundColor: '#FFFFFF',
                border: 'none',
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'rgba(59, 130, 246, 0.04)',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#FFFFFF',
                  fontWeight: '900',
                  borderBottom: '1px solid #e2e8f0',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f1f5f9',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '1px solid #e2e8f0',
                  backgroundColor: '#FFFFFF',
                },
              }}
            />
          </Paper>
        </div>
        <LogoClouds />
      </div>
    </div>
  );
}

export default CryptoExchangesDetails;
