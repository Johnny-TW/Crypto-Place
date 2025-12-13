import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@components/shared/data-display';

interface ExchangeData {
  id: string;
  name: string;
  image: string;
  url: string;
  year_established: number | null;
  country: string;
  trust_score_rank: number;
  trust_score: number;
  has_trading_incentive: boolean;
  trade_volume_24h_btc: number;
  trade_volume_24h_btc_normalized: number;
}

interface MarketListState {
  data: ExchangeData[];
  loading: boolean;
  error: string | null;
}

interface RootState {
  cryptoMarketList: MarketListState;
}

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: marketListData, loading: marketListLoading } = useSelector(
    (state: RootState) => state.cryptoMarketList
  );

  const handleRowClick = (row: ExchangeData) => {
    navigate(`/exchanges-details/${row.id}`);
  };

  const columns = useMemo(
    (): ColumnDef<ExchangeData>[] => [
      {
        accessorKey: 'trust_score_rank',
        header: '#',
        cell: ({ getValue }) => (
          <div className='text-left'>{getValue() as number}</div>
        ),
      },
      {
        accessorKey: 'image',
        header: 'Exchange',
        cell: ({ row }) => (
          <img
            src={row.original.image}
            alt={`${row.original.name} logo`}
            className='w-[30px] h-[30px] my-2'
          />
        ),
      },
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ getValue }) => (
          <div className='text-left'>{getValue() as string}</div>
        ),
      },
      {
        accessorKey: 'year_established',
        header: 'Year Established',
        cell: ({ getValue }) => (
          <div className='text-left'>{(getValue() as number) || 'N/A'}</div>
        ),
      },
      {
        accessorKey: 'country',
        header: 'Country',
        cell: ({ getValue }) => (
          <div className='text-left'>{getValue() as string}</div>
        ),
      },
      {
        accessorKey: 'url',
        header: 'URL',
        cell: ({ getValue }) => (
          <a
            href={getValue() as string}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline'
            onClick={e => e.stopPropagation()}
          >
            {getValue() as string}
          </a>
        ),
      },
      {
        accessorKey: 'has_trading_incentive',
        header: 'Trading Incentive',
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
        header: 'Trust Score',
        cell: ({ getValue }) => (
          <div className='text-left'>{getValue() as number}</div>
        ),
      },
      {
        accessorKey: 'trade_volume_24h_btc',
        header: 'Trade Volume 24h BTC',
        cell: ({ getValue }) => (
          <div className='text-left'>
            {parseFloat(String(getValue())).toFixed(2)}
          </div>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    dispatch({ type: 'FETCH_CRYPTO_MARKET_LIST' });
  }, [dispatch]);

  // console.log(marketListData);

  const isLoading = marketListLoading || !marketListData;

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500' />
      </div>
    );
  }

  return (
    <div className='min-h-screen py-8'>
      <div className='max-w-[95%] mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-10'>
          <h1 className='text-4xl font-bold text-gray-900 mt-5 mb-5'>
            Cryptocurrency Exchanges
          </h1>
          <p className='text-lg text-gray-600'>
            Explore top cryptocurrency exchanges and their trading volumes
          </p>
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={marketListData}
          onRowClick={handleRowClick}
          pageSize={20}
        />

        {/* Bottom Spacing */}
        <div className='mb-16' />
      </div>
    </div>
  );
}

export default Home;
