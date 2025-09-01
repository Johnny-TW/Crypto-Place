import { useMemo } from 'react';
import { Typography, Skeleton, Alert, Box } from '@mui/material';
import { FavoriteRounded } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useHistory } from 'react-router-dom';

function FavoriteListPanel({
  watchlist = [],
  isLoading = false,
  error = null,
}) {
  const history = useHistory();

  // 格式化 watchlist 資料給 DataGrid 使用
  const formattedWatchlist = useMemo(() => {
    return watchlist.map((item, index) => ({
      id: item.coinId,
      market_cap_rank: index + 1,
      image: item.image,
      symbol: item.symbol?.toUpperCase(),
      name: item.coinName,
      current_price: item.currentPrice,
      price_change_percentage_24h: item.priceChange24h,
      high_24h: item.high24h || 'N/A',
      low_24h: item.low24h || 'N/A',
      market_cap: item.marketCap || 'N/A',
      last_updated: item.lastUpdated || new Date().toISOString(),
      coinId: item.coinId,
      coinName: item.coinName,
    }));
  }, [watchlist]);

  const handleRowClick = params => {
    history.push(`/Crypto-details/${params.row.id}`);
  };

  const columns = useMemo(
    () => [
      {
        field: 'market_cap_rank',
        headerName: 'ID',
        minWidth: 80,
        align: 'left',
      },
      {
        field: 'image',
        headerName: 'Coin',
        minWidth: 100,
        align: 'left',
        renderCell: params => (
          <img
            src={params.value}
            alt={`${params.row.name} logo`}
            style={{ width: '30px', height: '30px', margin: '10px' }}
          />
        ),
      },
      {
        field: 'symbol',
        headerName: 'Symbol',
        minWidth: 100,
        align: 'left',
      },
      { field: 'name', headerName: 'Name', minWidth: 150 },
      {
        field: 'price_change_percentage_24h',
        headerName: 'Price 24H',
        minWidth: 150,
        align: 'left',
        renderCell: params => {
          if (params.value === null || params.value === undefined) return 'N/A';
          const value = parseFloat(params.value).toFixed(2);
          const color = value >= 0 ? 'text-green-500' : 'text-red-500';
          return <span className={color}>{value}%</span>;
        },
      },
      {
        field: 'current_price',
        headerName: 'Price',
        minWidth: 150,
        align: 'left',
        renderCell: params => {
          if (!params.value) return 'N/A';
          return `$${params.value.toLocaleString()}`;
        },
      },
      {
        field: 'high_24h',
        headerName: 'Price High 24H',
        minWidth: 150,
        align: 'left',
        renderCell: params => {
          if (!params.value || params.value === 'N/A') return 'N/A';
          return `$${params.value.toLocaleString()}`;
        },
      },
      {
        field: 'low_24h',
        headerName: 'Price Low 24H',
        minWidth: 200,
        align: 'left',
        renderCell: params => {
          if (!params.value || params.value === 'N/A') return 'N/A';
          return `$${params.value.toLocaleString()}`;
        },
      },
      {
        field: 'last_updated',
        headerName: 'Last Update Date',
        minWidth: 250,
        align: 'left',
        renderCell: params => {
          if (!params.value) return 'N/A';
          return new Date(params.value).toLocaleString();
        },
      },
      {
        field: 'market_cap',
        headerName: 'Market Cap',
        minWidth: 250,
        align: 'left',
        renderCell: params => {
          if (!params.value || params.value === 'N/A') return 'N/A';
          return `$${params.value.toLocaleString()}`;
        },
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <Box sx={{ p: 2, minHeight: 400 }}>
        <Typography variant='h6' gutterBottom>
          My Favorites
        </Typography>
        <Skeleton variant='rectangular' width='100%' height={350} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant='h6' gutterBottom>
          My Favorites
        </Typography>
        <Alert severity='error' sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (watchlist.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FavoriteRounded
          sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }}
        />
        <Typography variant='h6' gutterBottom color='text.secondary'>
          No favorite cryptocurrencies yet
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
          Click the heart icon in Market Overview
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          to add cryptocurrencies you&apos;re interested in!
        </Typography>
      </Box>
    );
  }

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Box sx={{ minHeight: 400 }}>
      {/* Header */}
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={3}
      >
        <Typography variant='h6' color='text.primary'>
          Your Favorite List
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {watchlist.length} cryptocurrencies
        </Typography>
      </Box>

      {/* DataGrid with same styling as Market Overview */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        <DataGrid
          rows={formattedWatchlist}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 20]}
          sx={{
            height: 500,
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
              backgroundColor: '#f8fafc',
              fontWeight: 600,
              borderBottom: '1px solid #e2e8f0',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f1f5f9',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            },
          }}
          onRowClick={handleRowClick}
          disableColumnMenu
          disableSelectionOnClick
        />
      </div>
    </Box>
  );
}

export default FavoriteListPanel;
