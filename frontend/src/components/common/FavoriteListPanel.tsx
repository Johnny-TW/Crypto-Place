import React, { useMemo } from 'react';
import { Typography, Skeleton, Alert, Box } from '@mui/material';
import { FavoriteRounded } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useHistory } from 'react-router-dom';

interface WatchlistItem {
  coinId: string;
  coinName: string;
  symbol?: string;
  image: string;
  currentPrice?: number;
  priceChange24h?: number;
  high24h?: number | string;
  low24h?: number | string;
  marketCap?: number | string;
  lastUpdated?: string;
}

interface FormattedWatchlistItem extends WatchlistItem {
  id: string;
  market_cap_rank: number;
  name: string;
  current_price?: number;
  price_change_percentage_24h?: number;
  high_24h: number | string;
  low_24h: number | string;
  market_cap: number | string;
  last_updated: string;
}

interface FavoriteListPanelProps {
  watchlist?: WatchlistItem[];
  isLoading?: boolean;
  error?: string | null;
}

function FavoriteListPanel({
  watchlist = [],
  isLoading = false,
  error = null,
}: FavoriteListPanelProps) {
  const history = useHistory();

  // 格式化 watchlist 資料給 DataGrid 使用
  const formattedWatchlist = useMemo((): FormattedWatchlistItem[] => {
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

  const handleRowClick = (params: GridRowParams): void => {
    history.push(`/Crypto-details/${params.row.id}`);
  };

  const columns = useMemo(
    (): GridColDef[] => [
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
            src={params.value as string}
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
          const value = parseFloat(params.value as string).toFixed(2);
          const color =
            parseFloat(value) >= 0 ? 'text-green-500' : 'text-red-500';
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
          return `$${(params.value as number).toLocaleString()}`;
        },
      },
      {
        field: 'high_24h',
        headerName: 'Price High 24H',
        minWidth: 150,
        align: 'left',
        renderCell: params => {
          if (!params.value || params.value === 'N/A') return 'N/A';
          return `$${(params.value as number).toLocaleString()}`;
        },
      },
      {
        field: 'low_24h',
        headerName: 'Price Low 24H',
        minWidth: 200,
        align: 'left',
        renderCell: params => {
          if (!params.value || params.value === 'N/A') return 'N/A';
          return `$${(params.value as number).toLocaleString()}`;
        },
      },
      {
        field: 'last_updated',
        headerName: 'Last Update Date',
        minWidth: 250,
        align: 'left',
        renderCell: params => {
          if (!params.value) return 'N/A';
          return new Date(params.value as string).toLocaleString();
        },
      },
      {
        field: 'market_cap',
        headerName: 'Market Cap',
        minWidth: 250,
        align: 'left',
        renderCell: params => {
          if (!params.value || params.value === 'N/A') return 'N/A';
          return `$${(params.value as number).toLocaleString()}`;
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
              backgroundColor: '#FFFFFF',
              fontWeight: 600,
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
          onRowClick={handleRowClick}
          disableColumnMenu
          disableRowSelectionOnClick
        />
      </div>
    </Box>
  );
}

export default FavoriteListPanel;
