import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import {
  FavoriteRounded,
  ShowChartRounded,
  TrendingUpRounded,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import FavoriteButton from '@components/common/FavoriteButton';
import FavoriteListPanel from '@components/common/FavoriteListPanel';
import CustomTabs from '@components/common/CustomTabs';
import TrendingCoins from '@components/crypto/TrendingCoins';
import GlobalMarketData from '@components/crypto/GlobalMarketData';
import SimplePrice from '@components/crypto/SimplePrice';
import { useWatchlist } from '@hooks/useWatchlist';
import '../styles/components/tabs.scss';
import '../styles/views/dashboard.scss';

// 定義加密貨幣介面
interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  market_cap_rank: number;
  current_price: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  last_updated: string;
  market_cap: number;
}

// 定義 Global Market Data 介面
interface GlobalMarketDataType {
  data: {
    active_cryptocurrencies: number;
    upcoming_icos: number;
    ongoing_icos: number;
    ended_icos: number;
    markets: number;
    total_market_cap: {
      usd: number;
      btc: number;
      eth: number;
    };
    total_volume: {
      usd: number;
      btc: number;
      eth: number;
    };
    market_cap_percentage: {
      btc: number;
      eth: number;
      [key: string]: number;
    };
    market_cap_change_percentage_24h_usd: number;
    updated_at: number;
  };
}

// 定義 Redux 狀態介面
interface CoinListState {
  coinList: CoinData[];
}

interface GlobalMarketDataState {
  data: GlobalMarketDataType | null;
  loading: boolean;
  error: string | null;
}

interface RootState {
  coinList: CoinListState;
  globalMarketData: GlobalMarketDataState;
}

// 定義貨幣類型
type Currency = 'usd' | 'eur' | 'jpy' | 'twd';

// 定義收藏切換數據介面
interface FavoriteToggleData {
  action: 'add' | 'remove';
  coinId: string;
  coinName?: string;
  symbol?: string;
  image?: string;
}

function StickyHeadTable(): JSX.Element {
  const dispatch = useDispatch();
  const coinList = useSelector((state: RootState) => state.coinList.coinList);

  // Global Market Data Redux state
  const globalMarketData = useSelector(
    (state: RootState) => state.globalMarketData.data
  );
  const globalMarketLoading = useSelector(
    (state: RootState) => state.globalMarketData.loading
  );
  const globalMarketError = useSelector(
    (state: RootState) => state.globalMarketData.error
  );

  const [currency, setCurrency] = useState<Currency>('usd');
  const [currentTab, setCurrentTab] = useState<number>(0);
  const history = useHistory();

  // 使用 watchlist hook 管理所有 watchlist 相關邏輯
  const {
    data: watchlistData,
    loading: watchlistLoading,
    error: watchlistError,
    count: watchlistCount,
    getFavoriteStatusMap,
    shouldLoadBatchStatus,
    checkBatchStatus,
    addToWatchlist,
    removeFromWatchlist,
    fetchWatchlist,
    getCount,
  } = useWatchlist();

  // 批量載入收藏狀態
  const loadBatchWatchlistStatus = useCallback(() => {
    if (!coinList || coinList.length === 0) {
      return;
    }

    const coinIds = coinList.map((coin: CoinData) => coin.id);
    if (shouldLoadBatchStatus(coinIds)) {
      checkBatchStatus(coinIds);
    }
  }, [coinList, shouldLoadBatchStatus, checkBatchStatus]);

  // 取得當前的狀態映射
  const watchlistStatus = getFavoriteStatusMap();

  const handleFavoriteToggle = useCallback(
    (data: FavoriteToggleData) => {
      if (data.action === 'add') {
        // 只傳遞後端 API 需要的欄位
        const coinData = {
          coinId: data.coinId,
          coinName: data.coinName!,
          symbol: data.symbol!,
          image: data.image!,
        };
        addToWatchlist(coinData);
      } else if (data.action === 'remove') {
        removeFromWatchlist(data.coinId);
      }
    },
    [addToWatchlist, removeFromWatchlist]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'favorite',
        headerName: 'Favorite',
        minWidth: 100,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: params => (
          <div
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <FavoriteButton
              coinId={params.row.id}
              coinName={params.row.name}
              symbol={params.row.symbol}
              image={params.row.image}
              size='small'
              isFavorite={watchlistStatus[params.row.id] || false}
              isLoading={watchlistLoading}
              onToggle={handleFavoriteToggle}
            />
          </div>
        ),
      },
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
      { field: 'name', headerName: 'Name', minWidth: 200 },
      {
        field: 'price_change_percentage_24h',
        headerName: 'Price 24H',
        minWidth: 150,
        align: 'left',
        renderCell: params => {
          const value = parseFloat(params.value).toFixed(2);
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
      },
      {
        field: 'high_24h',
        headerName: 'Price High 24H',
        minWidth: 150,
        align: 'left',
      },
      {
        field: 'low_24h',
        headerName: 'Price Low 24H',
        minWidth: 200,
        align: 'left',
      },
      {
        field: 'last_updated',
        headerName: 'Last Update Date',
        minWidth: 250,
        align: 'left',
      },
      {
        field: 'market_cap',
        headerName: 'Market Cap',
        minWidth: 250,
        align: 'left',
      },
    ],
    [watchlistStatus, handleFavoriteToggle, watchlistLoading]
  );

  const handleChange = (event: SelectChangeEvent<Currency>): void => {
    setCurrency(event.target.value as Currency);
  };

  const handleTabChange = (newValue: number): void => {
    setCurrentTab(newValue);

    // 當切換到 My Favorites (tab 0) 時，重新撈取 watchlist API
    if (newValue === 0) {
      fetchWatchlist();
      getCount();
    }
    // 當切換到 Market Overview (tab 1) 時，重新載入收藏狀態以確保同步
    else if (newValue === 1) {
      loadBatchWatchlistStatus();
    }
  };

  // 初始化時載入 watchlist 數據
  useEffect(() => {
    fetchWatchlist();
    getCount();
  }, [fetchWatchlist, getCount]);

  function CurrencySelect(): JSX.Element {
    return (
      <FormControl className='w-full'>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={currency}
          onChange={handleChange}
        >
          <MenuItem value='usd'>USD</MenuItem>
          <MenuItem value='eur'>EUR</MenuItem>
          <MenuItem value='jpy'>JPY</MenuItem>
          <MenuItem value='twd'>TWD</MenuItem>
        </Select>
      </FormControl>
    );
  }

  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      history.push(`/Crypto-details/${params.row.id}`);
    },
    [history]
  );

  // 載入 Global Market Data
  useEffect(() => {
    dispatch({ type: 'FETCH_GLOBAL_MARKET_DATA' });
    // 每5分鐘更新一次
    // const interval = setInterval(
    //   () => {
    //     dispatch({ type: 'FETCH_GLOBAL_MARKET_DATA' });
    //   },
    //   5 * 60 * 1000
    // );

    // return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    dispatch({ type: 'FETCH_COIN_LIST', payload: { currency } });
  }, [currency, dispatch]);

  useEffect(() => {
    loadBatchWatchlistStatus();
  }, [loadBatchWatchlistStatus]);

  const paginationModel = { page: 0, pageSize: 20 };

  const tabsData = [
    {
      label: 'Market Analytics',
      icon: <TrendingUpRounded className='w-5 h-5' />,
      content: (
        <div className='space-y-8'>
          {/* Global Market Overview */}
          <GlobalMarketData
            data={globalMarketData}
            loading={globalMarketLoading}
            error={globalMarketError}
          />

          {/* Trending Coins and Price Tracker */}
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
            <TrendingCoins />
            <SimplePrice />
          </div>
        </div>
      ),
    },
    {
      label: 'Market Overview',
      icon: <ShowChartRounded className='w-5 h-5' />,
      content: (
        <div className='space-y-6'>
          {/* Currency Selector */}
          <div className='flex items-center gap-4'>
            <Typography
              variant='subtitle2'
              className='text-gray-700 font-medium'
            >
              Currency :
            </Typography>
            <div className='min-w-[120px]'>
              <CurrencySelect />
            </div>
          </div>

          {/* Market Data Grid */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
            <DataGrid
              rows={coinList}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[10, 20, 30, 40, 50]}
              sx={{
                height: 600,
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
              disableRowSelectionOnClick
            />
          </div>
        </div>
      ),
    },
    {
      label: 'My Favorites',
      icon: <FavoriteRounded className='w-5 h-5' />,
      badge: watchlistCount,
      content: (
        <FavoriteListPanel
          watchlist={watchlistData}
          isLoading={watchlistLoading}
          error={watchlistError}
        />
      ),
    },
  ];

  return (
    <div className='min-h-screen py-8'>
      <div className='max-w-[95%] mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-10'>
          <h1 className='text-4xl font-bold text-gray-900 mt-20 mb-5'>
            Cryptocurrency Market
          </h1>
          <p className='text-lg text-gray-600'>
            Track your favorite cryptocurrencies and market trends
          </p>
        </div>

        {/* Custom Tailwind Tabs */}
        <CustomTabs
          tabs={tabsData}
          activeTab={currentTab}
          onChange={handleTabChange}
          className='max-w-full'
        />

        {/* Bottom Spacing */}
        <div className='mb-16' />
      </div>
    </div>
  );
}

export default StickyHeadTable;
