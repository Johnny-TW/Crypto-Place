import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Typography, Skeleton, Alert, Box } from '@mui/material';
import { FavoriteRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@components/shared/data-display';

interface WatchlistItem {
  coinId: string;
  coinName: string;
  symbol?: string;
  image: string;
  marketCapRank?: number;
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
  const navigate = useNavigate();

  // 格式化 watchlist 資料給 DataGrid 使用
  const formattedWatchlist = useMemo((): FormattedWatchlistItem[] => {
    return watchlist.map(item => ({
      id: item.coinId,
      market_cap_rank: item.marketCapRank || 0, // 使用真實的市場排名
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
      marketCapRank: item.marketCapRank,
    }));
  }, [watchlist]);

  const handleRowClick = (row: FormattedWatchlistItem): void => {
    navigate(`/Crypto-details/${row.id}`);
  };

  const columns = useMemo(
    (): ColumnDef<FormattedWatchlistItem>[] => [
      {
        accessorKey: 'market_cap_rank',
        header: 'Rank',
        cell: ({ getValue }) => {
          const rank = getValue() as number;
          return <div className='text-left'>{rank || 'N/A'}</div>;
        },
      },
      {
        accessorKey: 'image',
        header: 'Coin',
        cell: ({ row }) => (
          <img
            src={row.original.image}
            alt={`${row.original.name} logo`}
            className='w-[30px] h-[30px] my-2'
          />
        ),
      },
      {
        accessorKey: 'symbol',
        header: 'Symbol',
        cell: ({ getValue }) => (
          <div className='text-left'>{getValue() as string}</div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ getValue }) => (
          <div className='text-left'>{getValue() as string}</div>
        ),
      },
      {
        accessorKey: 'price_change_percentage_24h',
        header: 'Price 24H',
        cell: ({ getValue }) => {
          const value = getValue();
          if (value === null || value === undefined) return <span>N/A</span>;
          const numValue = parseFloat(value as string).toFixed(2);
          const colorClass =
            parseFloat(numValue) >= 0 ? 'text-green-500' : 'text-red-500';
          return <span className={colorClass}>{numValue}%</span>;
        },
      },
      {
        accessorKey: 'current_price',
        header: 'Price',
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value) return <span>N/A</span>;
          return <span>${(value as number).toLocaleString()}</span>;
        },
      },
      {
        accessorKey: 'high_24h',
        header: 'Price High 24H',
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value || value === 'N/A') return <span>N/A</span>;
          return <span>${(value as number).toLocaleString()}</span>;
        },
      },
      {
        accessorKey: 'low_24h',
        header: 'Price Low 24H',
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value || value === 'N/A') return <span>N/A</span>;
          return <span>${(value as number).toLocaleString()}</span>;
        },
      },
      {
        accessorKey: 'last_updated',
        header: 'Last Update Date',
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value) return <span>N/A</span>;
          return <span>{new Date(value as string).toLocaleString()}</span>;
        },
      },
      {
        accessorKey: 'market_cap',
        header: 'Market Cap',
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value || value === 'N/A') return <span>N/A</span>;
          return <span>${(value as number).toLocaleString()}</span>;
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

      {/* DataTable with shadcn/ui components */}
      <DataTable
        columns={columns}
        data={formattedWatchlist}
        onRowClick={handleRowClick}
        pageSize={10}
      />
    </Box>
  );
}

export default FavoriteListPanel;
