import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
} from '@mui/material';

import '../styles/views/nft-dashboard.scss';

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

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 300,
      align: 'left' as const,
      type: 'string',
    },
    {
      field: 'symbol',
      headerName: 'Symbol',
      minWidth: 300,
      align: 'left' as const,
      type: 'string',
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 300,
      align: 'left' as const,
      type: 'string',
    },
    {
      field: 'asset_platform_id',
      headerName: 'Asset Platform ID',
      minWidth: 200,
      align: 'left' as const,
      type: 'string',
    },
    {
      field: 'contract_address',
      headerName: 'Contract Address',
      minWidth: 600,
      align: 'left' as const,
      type: 'string',
    },
  ];

  const [order, setOrder] = useState('market_cap_usd_desc');
  const history = useHistory();
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

  const handleChange = (event: {
    target: {
      value: string;
      name?: string;
    };
  }): void => {
    setOrder(event.target.value);
  };

  interface GridRowParams {
    row: {
      id: string;
      [key: string]: any;
    };
  }

  const handleRowClick = (params: GridRowParams): void => {
    history.push(`/NFT-details/${params.row.id}`);
  };

  useEffect(() => {
    dispatch({ type: 'FETCH_NFT_LIST', payload: { order } });
  }, [order]);

  const paginationModel = { page: 0, pageSize: 20 };

  return (
    <div className='mt-10 container mx-auto'>
      <div className='dashboard-area'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
          <div className='col-span-12 md:col-span-2'>
            <div className='min-w-full'>
              <div className='w-full'>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label'>Order</InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={order}
                    label='Order'
                    onChange={handleChange}
                  >
                    {orderOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div className='col-span-12 md:col-span-8'>
            <h2 className='text-3xl font-bold text-center'>NFT Dashboard</h2>
          </div>
          <div className='col-span-12 md:col-span-2'>{/* 空的區域 */}</div>
        </div>

        <Paper
          className='mt-5 mb-20'
          sx={{ height: '100%', width: '100%' }}
          elevation={0}
        >
          <DataGrid
            rows={nftList || []}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[20, 30, 40, 50]}
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

export default StickyHeadTable;
