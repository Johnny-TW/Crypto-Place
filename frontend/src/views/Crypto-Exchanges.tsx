import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DataGrid,
  GridCellParams,
  GridRowParams,
  GridColDef,
} from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import { useHistory } from 'react-router-dom';

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
  const paginationModel = { page: 0, pageSize: 20 };
  const history = useHistory();
  const dispatch = useDispatch();
  const { data: marketListData, loading: marketListLoading } = useSelector(
    (state: RootState) => state.cryptoMarketList
  );

  const handleRowClick = (params: GridRowParams<ExchangeData>) => {
    history.push(`/exchanges-details/${params.row.id}`);
  };

  const columns = useMemo(
    (): GridColDef<ExchangeData>[] => [
      {
        field: 'trust_score_rank',
        headerName: '#',
        minWidth: 100,
        align: 'left',
      },
      {
        field: 'image',
        headerName: 'Exchange',
        minWidth: 100,
        align: 'left',
        renderCell: (params: GridCellParams<ExchangeData, string>) => (
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
        minWidth: 100,
        align: 'left',
      },
      { field: 'country', headerName: 'Name', minWidth: 250 },
      {
        field: 'url',
        headerName: 'URL',
        minWidth: 250,
        align: 'left',
        renderCell: (params: GridCellParams<ExchangeData, string>) => (
          <a href={params.value} target='_blank' rel='noopener noreferrer'>
            {params.value}
          </a>
        ),
      },
      {
        field: 'has_trading_incentive',
        headerName: 'Trading incentive',
        minWidth: 200,
        align: 'center',
        renderCell: (params: GridCellParams<ExchangeData, boolean>) => (
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
        renderCell: (params: GridCellParams<ExchangeData, number>) => (
          <span>{parseFloat(String(params.value)).toFixed(2)}</span>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    dispatch({ type: 'FETCH_CRYPTO_MARKET_LIST' });
  }, []);

  // eslint-disable-next-line no-console
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
    <div className='dashboard-container z-0 mb-8 rounded-lg'>
      <div className='dashboard-area'>
        <Paper sx={{ height: '100%', width: '100%' }} elevation={0}>
          <DataGrid
            rows={marketListData}
            columns={columns}
            loading={isLoading}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[10, 20, 30, 40, 50, 100]}
            sx={{
              cursor: 'pointer',
              backgroundColor: '#FFFFFF',
            }}
            onRowClick={handleRowClick}
          />
        </Paper>
      </div>
    </div>
  );
}

export default Home;
