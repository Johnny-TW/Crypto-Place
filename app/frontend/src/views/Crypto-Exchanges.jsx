import React, {
  useEffect, useMemo, useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import { fetchCryptoMarketList } from '@redux/saga/cryptoMarketList';
import { useHistory } from 'react-router-dom';

function Home() {
  const paginationModel = { page: 0, pageSize: 100 };
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    marketListData, loading: marketListLoading,
  } = useSelector((state) => state.cryptoMarketList);

  const handleRowClick = (params) => {
    history.push(`/exchanges-details/${params.row.id}`);
  };

  const columns = useMemo(() => [
    {
      field: 'trust_score_rank', headerName: '#', minWidth: 100, align: 'left',
    },
    {
      field: 'image',
      headerName: 'Exchange',
      minWidth: 100,
      align: 'left',
      renderCell: (params) => (
        <img src={params.value} alt={`${params.row.name} logo`} style={{ width: '30px', height: '30px', margin: '10px' }} />
      ),
    },
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 150,
      align: 'left',
    },
    {
      field: 'year_established', headerName: 'Symbol', minWidth: 100, align: 'left',
    },
    { field: 'country', headerName: 'Name', minWidth: 250 },
    {
      field: 'url',
      headerName: 'URL',
      minWidth: 250,
      align: 'left',
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    {
      field: 'has_trading_incentive',
      headerName: 'Trading incentive',
      minWidth: 200,
      align: 'center',
      renderCell: (params) => <span>{params.value ? '✅' : <span style={{ color: 'red' }}>⬤</span>}</span>,
    },
    {
      field: 'trust_score', headerName: 'Trust score', minWidth: 100, align: 'left',
    },
    {
      field: 'trade_volume_24h_btc',
      headerName: 'Trade volume 24h BTC',
      minWidth: 200,
      align: 'left',
      renderCell: (params) => <span>{parseFloat(params.value).toFixed(2)}</span>,
    },
    {
      field: 'trade_volume_24h_btc_normalized', headerName: 'Trade volume 24h BTC normalized', minWidth: 300, align: 'left',
    },
  ], []);

  const fetchData = useCallback(() => {
    dispatch(fetchCryptoMarketList());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // console.log(marketListData);

  const isLoading = marketListLoading || !marketListData;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="dashboard-container z-0 mb-10 rounded-lg">
      <div className="dashboard-area">
        <div className="mb-3 grid grid-cols-12 gap-2 items-center">
          <div className="col-span-12 sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1" />
          <div className="col-span-12 sm:col-span-10 md:col-span-10 lg:col-span-10 xl:col-span-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">Exchanges Dashboard</h2>
          </div>
          <div className="col-span-12 sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1" />
        </div>
        <Paper sx={{ height: '100%', width: '100%' }} elevation={0}>
          <DataGrid
            rows={marketListData}
            columns={columns}
            loading={isLoading}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[10, 20, 30, 40, 50]}
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
