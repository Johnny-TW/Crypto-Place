import * as React from 'react';
import {
  Paper, Box, FormControl, InputLabel, MenuItem, Select, Grid,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { fetchCoinList } from '@redux/saga/cryptoDashboard';
import '../styles/views/dashboard.scss';

const columns = [
  {
    field: 'market_cap_rank', headerName: 'ID', minWidth: 100, align: 'left',
  },
  {
    field: 'image',
    headerName: 'Coin',
    minWidth: 100,
    align: 'left',
    renderCell: (params) => (
      <img src={params.value} alt={`${params.row.name} logo`} style={{ width: '30px', height: '30px', margin: '10px' }} />
    ),
  },
  {
    field: 'symbol', headerName: 'Symbol', minWidth: 100, align: 'left',
  },
  { field: 'name', headerName: 'Name', minWidth: 150 },
  {
    field: 'price_change_percentage_24h',
    headerName: 'Price 24H',
    minWidth: 150,
    align: 'left',
    renderCell: (params) => {
      const value = parseFloat(params.value).toFixed(2);
      const color = value >= 0 ? 'text-green-500' : 'text-red-500';
      return (
        <span className={color}>
          {value}
          %
        </span>
      );
    },
  },
  {
    field: 'current_price', headerName: 'Price', minWidth: 150, align: 'left',
  },
  {
    field: 'high_24h', headerName: 'Price High 24H', minWidth: 150, align: 'left',
  },
  {
    field: 'low_24h', headerName: 'Price Low 24H', minWidth: 200, align: 'left',
  },
  {
    field: 'last_updated', headerName: 'Last Update Date', minWidth: 250, align: 'left',
  },
  {
    field: 'market_cap', headerName: 'Market Cap', minWidth: 250, align: 'left',
  },
];

function StickyHeadTable() {
  const dispatch = useDispatch();
  const coinList = useSelector((state) => state.coinList.coinList);
  const [currency, setCurrency] = useState('usd');
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const handleChange = (event) => {
    setCurrency(event.target.value);
    console.log(currency);
  };

  const handleRowClick = (params) => {
    history.push(`/Crypto-details/${params.row.id}`);
  };

  useEffect(() => {
    dispatch(fetchCoinList(currency));
    setLoading(false);
  }, [dispatch, currency]);

  const paginationModel = { page: 0, pageSize: 20 };

  return (
    <div>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Box>
              <FormControl className="w-full">
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={currency}
                  onChange={handleChange}
                >
                  <MenuItem value="usd">USD</MenuItem>
                  <MenuItem value="eur">EUR</MenuItem>
                  <MenuItem value="jpy">JPY</MenuItem>
                  <MenuItem value="twd">TWD</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">Markets Overview</h2>
          </Grid>
          <Grid item xs={12} sm={3}>
            {/* 空的區域 */}
          </Grid>
        </Grid>
        <Paper className="mt-5 mb-20" sx={{ height: '100%', width: '100%' }} elevation={1}>
          <DataGrid
            rows={coinList}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[20, 30, 40, 50]}
            sx={{
              border: '1px solid #ccc',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              backgroundColor: '#f5f5f5',
            }}
            onRowClick={handleRowClick}
          />
        </Paper>
      </div>
    </div>
  );
}

export default StickyHeadTable;
