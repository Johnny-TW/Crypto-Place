import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { GridCellParams, GridColDef } from '@mui/x-data-grid';

import DescriptionSection from '@components/common/DescriptionSection';
import ChartSection from '@components/common/ChartSection';
import Dashboard from '@components/common/Dashboard';
import PriceOverviewSection from '@components/common/PriceOverviewSection';
import CryptoNews from '@components/common/CryptoNews';
import AutoPlay from '@components/display/AutoPlay';
import PerformanceTable from '@components/nft/performance/PerformanceTable';

interface RouteParams {
  coinId: string;
}

type TimeRange = '7d' | '30d' | '1y';

// Flexible interfaces that avoid 'any' but allow for component compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FlexibleObject = Record<string, any>;

// Define type for the crypto exchange row data
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

// Define crypto data interface to match what PriceOverviewSection expects
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

// Redux state interfaces
interface CryptoDetailsState {
  cryptoDetails: FlexibleObject | null;
  loading: boolean;
  error: string | null;
}

interface CryptoDetailsChartState {
  chartData: FlexibleObject | null;
  loading: boolean;
  error: string | null;
}

interface CryptoMarketListState {
  marketListData: FlexibleObject[] | null;
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
  const renderVolumeCell = (
    params: GridCellParams<CryptoExchangeRow, number | null | undefined>
  ) => {
    if (params.value == null) return <span>N/A</span>;
    return <span>{parseFloat(params.value.toString()).toFixed(2)}</span>;
  };
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'trust_score_rank',
        headerName: '#',
        minWidth: 100,
        align: 'left',
      },
      {
        field: 'image',
        headerName: 'Exchange',
        minWidth: 150,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params: GridCellParams<CryptoExchangeRow, string>) => (
          <img
            src={params.value}
            alt={`${params.row.name} logo`}
            style={{ width: '30px', height: '30px', margin: '10px' }}
          />
        ),
      },
      {
        field: 'id',
        headerName: 'ID',
        minWidth: 150,
        align: 'left',
      },
      {
        field: 'year_established',
        headerName: 'Symbol',
        minWidth: 150,
        headerAlign: 'center',
        align: 'left',
      },
      { field: 'country', headerName: 'Name', minWidth: 250 },
      {
        field: 'url',
        headerName: 'URL',
        minWidth: 200,
        align: 'left',
        renderCell: (params: GridCellParams<CryptoExchangeRow, string>) => (
          <a href={params.value} target='_blank' rel='noopener noreferrer'>
            {params.value}
          </a>
        ),
      },
      {
        field: 'has_trading_incentive',
        headerName: 'Trading incentive',
        minWidth: 150,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params: GridCellParams<CryptoExchangeRow, boolean>) => (
          <span>
            {params.value ? '✅' : <span style={{ color: 'red' }}>⬤</span>}
          </span>
        ),
      },
      {
        field: 'trust_score',
        headerName: 'Trust score',
        minWidth: 100,
        align: 'left',
      },
      {
        field: 'trade_volume_24h_btc',
        headerName: 'Trade volume 24h BTC',
        minWidth: 200,
        align: 'left',
        renderCell: renderVolumeCell,
      },
      {
        field: 'trade_volume_24h_btc_normalized',
        headerName: 'Trade volume 24h BTC normalized',
        minWidth: 250,
        align: 'left',
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
  const { chartData, loading: chartLoading } = useSelector(
    (state: RootState) => state.cryptoDetailsChart
  );
  const { marketListData, loading: marketListLoading } = useSelector(
    (state: RootState) => state.cryptoMarketList
  );
  const { news: cryptoNews, loading: newsLoading } = useSelector(
    (state: RootState) => state.cryptoNews
  );

  const isLoading =
    detailsLoading ||
    chartLoading ||
    marketListLoading ||
    !cryptoDetails ||
    !chartData ||
    !marketListData;

  const fetchInitialData = useCallback(() => {
    dispatch({ type: 'FETCH_CRYPTO_DETAILS', payload: { coinId } });
    dispatch({ type: 'FETCH_CRYPTO_MARKET_LIST' });
    dispatch({ type: 'FETCH_CRYPTO_NEWS', payload: 'BTC' });
  }, [dispatch, coinId]);

  const fetchChartData = useCallback(() => {
    dispatch({ type: 'FETCH_CRYPTO_CHART', payload: { coinId, timeRange } });
  }, [dispatch, coinId, timeRange]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500' />
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      {cryptoDetails?.image ? (
        <div className='flex items-center gap-4 mb-8 mt-5'>
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
      <PriceOverviewSection data={cryptoDetails as unknown as CryptoData} />

      <PerformanceTable
        cryptoData={
          cryptoDetails as any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        }
      />
      <ChartSection
        coinChartData={chartData}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />
      <DescriptionSection
        name={cryptoDetails.name}
        description={cryptoDetails.description.en}
        href={
          cryptoDetails.links as any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        }
      />
      <div className='overflow-x-auto rounded-xl mb-5'>
        <Dashboard
          columns={columns}
          marketListData={
            marketListData as any /* eslint-disable-line @typescript-eslint/no-explicit-any */
          }
        />
      </div>
      <CryptoNews />
      <AutoPlay
        news={
          (cryptoNews ||
            []) as any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        }
        isLoading={newsLoading}
      />
    </div>
  );
}

export default CryptoDetails;
