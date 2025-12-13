import { useState, useEffect, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { DataTable } from '@components/shared/data-display';
import { Button } from '@components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';

import '../styles/views/nft-dashboard.scss';

interface NFTData {
  id: string;
  symbol: string;
  name: string;
  asset_platform_id: string;
  contract_address: string;
}

function StickyHeadTable() {
  const orderOptions = [
    { value: 'h24_volume_usd_asc', label: 'H24 Volume USD Asc' },
    { value: 'h24_volume_usd_desc', label: 'H24 Volume USD Desc' },
    { value: 'h24_volume_native_asc', label: 'H24 Native USD Asc' },
    { value: 'h24_volume_native_desc', label: 'H24 Native USD Desc' },
    { value: 'floor_price_native_asc', label: 'Floor Price USD Asc' },
    { value: 'floor_price_native_desc', label: 'Floor Price USD Desc' },
    { value: 'market_cap_native_asc', label: 'Market Cap Native Asc' },
    { value: 'market_cap_native_desc', label: 'Market Cap Native Desc' },
    { value: 'market_cap_usd_asc', label: 'Market Cap USD Asc' },
    { value: 'market_cap_usd_desc', label: 'Market Cap USD Desc' },
  ];

  const columns: ColumnDef<NFTData>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ getValue }) => (
          <div className='truncate'>{getValue() as string}</div>
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
        accessorKey: 'asset_platform_id',
        header: 'Platform ID',
        cell: ({ getValue }) => <div>{getValue() as string}</div>,
      },
      {
        accessorKey: 'contract_address',
        header: 'Contract Address',
        cell: ({ getValue }) => (
          <div className='font-mono text-xs truncate max-w-md'>
            {getValue() as string}
          </div>
        ),
      },
    ],
    []
  );

  const [order, setOrder] = useState<string>('market_cap_usd_desc');
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  interface RootState {
    nftDashboard?: {
      data: any[];
      loading: boolean;
      error: null | string;
    };
  }

  const {
    data: nftList,
    loading,
    error,
  } = useSelector(
    (state: RootState) =>
      state.nftDashboard || { data: [], loading: false, error: null }
  );

  // eslint-disable-next-line no-console
  console.log('NFT Dashboard Redux State:', { nftList, loading, error });

  const handleChange = (value: string): void => {
    setOrder(value);
  };

  const handleRowClick = (row: NFTData): void => {
    navigate(`/NFT-details/${row.id}`);
  };

  useEffect(() => {
    dispatch({ type: 'FETCH_NFT_LIST', payload: { order } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  // 監聽錯誤狀態
  useEffect(() => {
    if (error && error.includes('500')) {
      setShowErrorDialog(true);
    }
  }, [error]);

  return (
    <div className='mt-10 container mx-auto'>
      <div className='dashboard-area'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
          <div className='col-span-12 md:col-span-2'>
            <div className='min-w-full'>
              <div className='w-full'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full justify-between'
                    >
                      {orderOptions.find(opt => opt.value === order)?.label ||
                        'Select Order'}
                      <ChevronDown className='ml-2 h-4 w-4 opacity-50' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-full min-w-[250px]'>
                    <DropdownMenuRadioGroup
                      value={order}
                      onValueChange={handleChange}
                    >
                      {orderOptions.map(option => (
                        <DropdownMenuRadioItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className='col-span-12 md:col-span-8'>
            <h2 className='text-3xl font-bold text-center'>NFT Dashboard</h2>
          </div>
          <div className='col-span-12 md:col-span-2'>{/* 空的區域 */}</div>
        </div>

        <div className='mt-5 mb-20'>
          <DataTable
            columns={columns}
            data={nftList || []}
            onRowClick={handleRowClick}
            pageSize={20}
          />
        </div>
      </div>

      {/* 500 錯誤 AlertDialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className='flex items-center gap-2'>
              <AlertCircle className='h-6 w-6 text-rose-600' />
              <AlertDialogTitle className='text-rose-600'>
                伺服器錯誤 (500)
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className='pt-4'>
              抱歉,伺服器發生錯誤。請稍後再試或聯繫技術支援。
              {error && (
                <div className='mt-2 p-3 bg-gray-100 rounded-md text-sm text-gray-700'>
                  錯誤詳情: {error}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowErrorDialog(false);
                window.location.reload();
              }}
              className='bg-rose-600 hover:bg-rose-700'
            >
              重新載入頁面
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => {
                setShowErrorDialog(false);
                navigate('/dashboard');
              }}
            >
              返回首頁
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default StickyHeadTable;
