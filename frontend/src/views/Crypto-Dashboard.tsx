import { useState, useEffect, useMemo, useCallback } from 'react';
import { Typography } from '@mui/material';
import {
  FavoriteRounded,
  ShowChartRounded,
  TrendingUpRounded,
} from '@mui/icons-material';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ColumnDef } from '@tanstack/react-table';
import FavoriteButton from '@components/common/FavoriteButton';
import FavoriteListPanel from '@components/common/FavoriteListPanel';
import { DataTable } from '@components/common/DataTable';
import TrendingCoins from '@components/crypto/TrendingCoins';
import GlobalMarketData from '@components/crypto/GlobalMarketData';
import SimplePrice from '@components/crypto/SimplePrice';
import { useWatchlist } from '@hooks/useWatchlist';
import { Button } from '@components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/tabs';
import { Badge } from '@components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
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

// CurrencySelect 組件 - 移到外部避免重新創建
interface CurrencySelectProps {
  currency: Currency;
  onChange: (value: Currency) => void;
}

const currencyOptions = [
  { value: 'usd', label: 'USD' },
  { value: 'eur', label: 'EUR' },
  { value: 'jpy', label: 'JPY' },
  { value: 'twd', label: 'TWD' },
] as const;

function CurrencySelect({
  currency,
  onChange,
}: CurrencySelectProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='w-full justify-between'>
          {currencyOptions.find(opt => opt.value === currency)?.label ||
            'Select Currency'}
          <ChevronDown className='ml-2 h-4 w-4 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-full'>
        <DropdownMenuRadioGroup
          value={currency}
          onValueChange={value => onChange(value as Currency)}
        >
          {currencyOptions.map(option => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
  const [currentTab, setCurrentTab] = useState<string>('analytics');
  const navigate = useNavigate();

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

  const columns: ColumnDef<CoinData>[] = useMemo(
    () => [
      {
        accessorKey: 'favorite',
        header: 'Favorite',
        enableSorting: false,
        cell: ({ row }) => (
          <div className='flex justify-center'>
            <FavoriteButton
              coinId={row.original.id}
              coinName={row.original.name}
              symbol={row.original.symbol}
              image={row.original.image}
              size='small'
              isFavorite={watchlistStatus[row.original.id] || false}
              isLoading={watchlistLoading}
              onToggle={handleFavoriteToggle}
            />
          </div>
        ),
      },
      {
        accessorKey: 'market_cap_rank',
        header: 'Rank',
        cell: ({ getValue }) => <div>{getValue() as number}</div>,
      },
      {
        accessorKey: 'image',
        header: 'Image',
        enableSorting: false,
        cell: ({ getValue, row }) => (
          <img
            src={getValue() as string}
            alt={`${row.original.name} logo`}
            className='w-8 h-8 my-2'
          />
        ),
      },
      {
        accessorKey: 'symbol',
        header: 'Symbol',
        cell: ({ getValue }) => (
          <div className='uppercase'>{getValue() as string}</div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ getValue }) => <div>{getValue() as string}</div>,
      },
      {
        accessorKey: 'price_change_percentage_24h',
        header: '24h Price Change',
        cell: ({ getValue }) => {
          const rawValue = getValue();
          if (rawValue === null || rawValue === undefined) {
            return <span>N/A</span>;
          }
          const value = parseFloat((rawValue as number).toFixed(2));
          const color = value >= 0 ? 'text-green-500' : 'text-red-500';
          return <span className={color}>{value}%</span>;
        },
      },
      {
        accessorKey: 'current_price',
        header: 'Current Price',
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value) return <div>N/A</div>;
          return <div>${(value as number).toLocaleString()}</div>;
        },
      },
      {
        accessorKey: 'high_24h',
        header: '24h High',
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value) return <div>N/A</div>;
          return <div>${(value as number).toLocaleString()}</div>;
        },
      },
      {
        accessorKey: 'low_24h',
        header: '24h Low',
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value) return <div>N/A</div>;
          return <div>${(value as number).toLocaleString()}</div>;
        },
      },
      {
        accessorKey: 'last_updated',
        header: 'Last Updated',
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value) return <div>N/A</div>;
          return <div>{value as string}</div>;
        },
      },
      {
        accessorKey: 'market_cap',
        header: 'Market Cap',
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value) return <div>N/A</div>;
          return <div>${(value as number).toLocaleString()}</div>;
        },
      },
    ],
    [watchlistStatus, handleFavoriteToggle, watchlistLoading]
  );

  const handleChange = (value: Currency): void => {
    setCurrency(value);
  };

  const handleTabChange = (newValue: string): void => {
    setCurrentTab(newValue);

    // 當切換到 Market Overview 時，重新撈取 watchlist 狀態
    if (newValue === 'overview') {
      loadBatchWatchlistStatus();
    }
    // 當切換到 My Favorites 時，重新撈取 watchlist 數據和計數
    else if (newValue === 'favorites') {
      fetchWatchlist();
      getCount();
    }
  };

  // 初始化時載入 watchlist 數據
  useEffect(() => {
    fetchWatchlist();
    getCount();
  }, [fetchWatchlist, getCount]);

  const handleRowClick = useCallback(
    (row: CoinData) => {
      navigate(`/Crypto-details/${row.id}`);
    },
    [navigate]
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

  const tabsData = [
    {
      value: 'analytics',
      label: 'Market Analytics',
      icon: <TrendingUpRounded className='w-5 h-5' />,
    },
    {
      value: 'overview',
      label: 'Market Overview',
      icon: <ShowChartRounded className='w-5 h-5' />,
    },
    {
      value: 'favorites',
      label: 'My Favorites',
      icon: <FavoriteRounded className='w-5 h-5' />,
      badge: watchlistCount,
    },
  ];

  return (
    <div className='min-h-screen py-8'>
      <div className='max-w-[95%] mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-10'>
          <h1 className='text-4xl font-bold text-gray-900 mt-10 mb-5'>
            Cryptocurrency Market
          </h1>
          <p className='text-lg text-gray-600'>
            Track your favorite cryptocurrencies and market trends
          </p>
        </div>

        {/* Shadcn Tabs */}
        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className='w-full'
        >
          <TabsList className='mb-8'>
            {tabsData.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className='flex items-center gap-2'
              >
                <div className='relative flex items-center'>
                  {tab.icon}
                  {tab.badge && tab.badge > 0 && (
                    <Badge
                      variant='destructive'
                      className='absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs'
                    >
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </Badge>
                  )}
                </div>
                <span className='font-medium'>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Market Analytics Tab */}
          <TabsContent value='analytics' className='mt-6'>
            <div className='space-y-8'>
              {/* 全球市場數據 */}
              <GlobalMarketData
                data={globalMarketData}
                loading={globalMarketLoading}
                error={globalMarketError}
              />

              {/* 趨勢貨幣和簡單價格 */}
              <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
                <TrendingCoins />
                <SimplePrice />
              </div>
            </div>
          </TabsContent>

          {/* Market Overview Tab */}
          <TabsContent value='overview' className='mt-6'>
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
                  <CurrencySelect currency={currency} onChange={handleChange} />
                </div>
              </div>

              {/* Market Data Grid */}
              <DataTable
                columns={columns}
                data={coinList}
                onRowClick={handleRowClick}
                pageSize={20}
              />
            </div>
          </TabsContent>

          {/* My Favorites Tab */}
          <TabsContent value='favorites' className='mt-6'>
            <FavoriteListPanel
              watchlist={watchlistData}
              isLoading={watchlistLoading}
              error={watchlistError}
            />
          </TabsContent>
        </Tabs>

        {/* Bottom Spacing */}
        <div className='mb-16' />
      </div>
    </div>
  );
}

export default StickyHeadTable;
