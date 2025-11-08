import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ColumnDef } from '@tanstack/react-table';

import DescriptionSection from '@components/common/DescriptionSection';
import ChartSection from '@components/common/ChartSection';
import Dashboard from '@components/common/Dashboard';
import PriceOverviewSection from '@components/common/PriceOverviewSection';
import CryptoNews from '@components/common/CryptoNews';
import AutoPlay from '@components/display/AutoPlay';
import PerformanceTable from '@components/nft/performance/PerformanceTable';
import PriceMilestones from '@components/common/PriceMilestones';
import SupplyStats from '@components/common/SupplyStats';
import PriceRangeBar from '@components/common/PriceRangeBar';
import QuickStats from '@components/common/QuickStats';

interface RouteParams extends Record<string, string | undefined> {
  coinId: string;
}

type TimeRange = '7d' | '30d' | '1y';

type FlexibleObject = Record<string, any>;

interface CryptoExchangeRow {
  id: string;
  name: string;
  image: string;
  url: string;
  trust_score_rank: number;
  year_established: number | null;
  country: string;
  has_trading_incentive: boolean;
  trade_volume_24h_btc: number;
  [key: string]: unknown;
}

interface MarketData {
  current_price: {
    usd: number;
  };
  price_change_percentage_24h: number;
  market_cap: {
    usd: number;
  };
  total_volume: {
    usd: number;
  };
  [key: string]: unknown;
}

interface CryptoData {
  market_data: MarketData;
  [key: string]: unknown;
}

interface CryptoDetailsState {
  cryptoDetails: FlexibleObject | null;
  loading: boolean;
  error: string | null;
}

interface CryptoDetailsChartState {
  data: FlexibleObject | null;
  loading: boolean;
  error: string | null;
}

interface CryptoMarketListState {
  data: FlexibleObject[] | null;
  loading: boolean;
  error: string | null;
}

interface CryptoNewsState {
  news: FlexibleObject[] | null;
  loading: boolean;
  error: string | null;
}

interface RootState {
  cryptoDetails: CryptoDetailsState;
  cryptoDetailsChart: CryptoDetailsChartState;
  cryptoMarketList: CryptoMarketListState;
  cryptoNews: CryptoNewsState;
}

function CryptoDetails() {
  const columns: ColumnDef<CryptoExchangeRow>[] = useMemo(
    () => [
      {
        accessorKey: 'trust_score_rank',
        id: 'rank',
        header: '#',
        size: 100,
      },
      {
        accessorKey: 'image',
        id: 'image',
        header: 'Exchange',
        size: 150,
        cell: ({ getValue, row }) => (
          <div className='flex justify-center'>
            <img
              src={getValue() as string}
              alt={`${row.original.name} logo`}
              className='w-8 h-8 rounded-full'
            />
          </div>
        ),
      },
      {
        accessorKey: 'id',
        id: 'id',
        header: 'ID',
        size: 150,
      },
      {
        accessorKey: 'year_established',
        id: 'year',
        header: 'Year',
        size: 150,
        cell: ({ getValue }) => {
          const value = getValue() as number | null;
          return <span>{value != null ? String(value) : 'N/A'}</span>;
        },
      },
      {
        accessorKey: 'country',
        id: 'country',
        header: 'Country',
        size: 250,
      },
      {
        accessorKey: 'url',
        id: 'url',
        header: 'URL',
        size: 200,
        cell: ({ getValue }) => {
          const url = getValue() as string;
          return (
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline truncate block max-w-[180px]'
            >
              {url}
            </a>
          );
        },
      },
      {
        accessorKey: 'has_trading_incentive',
        id: 'trading_incentive',
        header: 'Trading Incentive',
        size: 150,
        cell: ({ getValue }) => (
          <div className='flex justify-center'>
            {getValue() ? (
              <span>✅</span>
            ) : (
              <span className='text-red-500'>⬤</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'trust_score',
        id: 'trust_score',
        header: 'Trust Score',
        size: 100,
      },
      {
        accessorKey: 'trade_volume_24h_btc',
        id: 'volume',
        header: 'Trade Volume 24h BTC',
        size: 200,
        cell: ({ getValue }) => {
          const value = getValue();
          if (value == null) return <span>N/A</span>;
          return <span>{parseFloat(value.toString()).toFixed(2)}</span>;
        },
      },
    ],
    []
  );

  const dispatch = useDispatch();
  const { coinId } = useParams<RouteParams>();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const { cryptoDetails, loading: detailsLoading } = useSelector(
    (state: RootState) => state.cryptoDetails
  );
  const { data: chartData, loading: chartLoading } = useSelector(
    (state: RootState) => state.cryptoDetailsChart
  );
  const { data: marketListData, loading: marketListLoading } = useSelector(
    (state: RootState) => state.cryptoMarketList
  );
  const { news: cryptoNews, loading: newsLoading } = useSelector(
    (state: RootState) => state.cryptoNews
  );

  const isLoading = detailsLoading || chartLoading || marketListLoading;

  useEffect(() => {
    if (coinId) {
      // 滾動到頁面頂部
      window.scrollTo(0, 0);

      dispatch({ type: 'FETCH_CRYPTO_DETAILS', payload: { coinId } });
      dispatch({ type: 'FETCH_CRYPTO_CHART', payload: { coinId, timeRange } });
      dispatch({ type: 'FETCH_CRYPTO_MARKET_LIST' });
      dispatch({ type: 'FETCH_CRYPTO_NEWS', payload: 'BTC' });
    }
  }, [coinId, dispatch, timeRange]);

  // 當時間範圍改變時，重新獲取圖表數據
  useEffect(() => {
    if (coinId && timeRange) {
      dispatch({ type: 'FETCH_CRYPTO_CHART', payload: { coinId, timeRange } });
    }
  }, [coinId, timeRange, dispatch]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500' />
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-4 max-w-7xl'>
      {cryptoDetails?.image ? (
        <div className='flex items-center gap-4 mb-5 mt-5'>
          <img
            src={cryptoDetails.image.large}
            alt={cryptoDetails.name}
            className='w-16 h-16 rounded-full'
          />
          <div>
            <h1 className='text-3xl font-bold'>{cryptoDetails.name}</h1>
            <p className='text-gray-500 uppercase'>{cryptoDetails.symbol}</p>
          </div>
        </div>
      ) : null}
      <PriceOverviewSection
        data={cryptoDetails as unknown as CryptoData | null}
      />

      {/* Quick Stats: Rank, FDV, Genesis Date, Algorithm */}
      <QuickStats data={cryptoDetails as any} />

      {/* Price Milestones: ATH and ATL */}
      <PriceMilestones data={cryptoDetails as any} />

      {/* 24h Price Range Bar & Supply Statistics - Side by Side */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5'>
        <PriceRangeBar data={cryptoDetails as any} />
        <SupplyStats data={cryptoDetails as any} />
      </div>

      <PerformanceTable cryptoData={cryptoDetails as any} />
      <ChartSection
        coinChartData={chartData as any}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />
      <DescriptionSection
        name={cryptoDetails?.name || ''}
        description={cryptoDetails?.description?.en || ''}
        href={cryptoDetails?.links as any}
      />
      <div className='overflow-x-auto rounded-xl mb-5'>
        <Dashboard columns={columns} marketListData={marketListData as any} />
      </div>
      <CryptoNews />
      <AutoPlay news={(cryptoNews || []) as any} isLoading={newsLoading} />
    </div>
  );
}

export default CryptoDetails;
