import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import {
  Grid,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';

import '../styles/views/nft-dashboard.scss'

const columns = [
  { field: 'id', headerName: 'ID', minWidth: 200, align: 'left', },
  { field: 'symbol', headerName: 'Symbol', minWidth: 200, align: 'left', },
  { field: 'name', headerName: 'Name', minWidth: 300, align: 'left', },
  { field: 'asset_platform_id', headerName: 'Asset Platform ID', minWidth: 200, align: 'left', },
  { field: 'contract_address', headerName: 'Name', minWidth: 400, align: 'left' },
];

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

function StickyHeadTable() {
  const [cryptoData, setCryptoData] = useState([]);
  const [order, setOrder] = useState('market_cap_usd_desc');
  // Loading / Success / Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertVisible, setAlertVisible] = useState(false);
  const history = useHistory();

  const handleChange = (event) => {
    setOrder(event.target.value);
    console.log(order)
  };

  const handleRowClick = (params) => {
    history.push(`/NFT-details/${params.row.id}`);
  };

  const triggerAlert = (message, duration = 3000) => {
    setAlertMessage(message);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, duration);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchNFTData = async () => {
      try {
        const options = {
          method: 'GET',
          url: 'https://api.coingecko.com/api/v3/nfts/list',
          params: {
            order: order,
          },
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-nrJXAB28gG2xbfsdLieGcxWB',
          },
        };

        const response = await axios.request(options);
        if (isMounted) {
          setCryptoData(response.data);
          triggerAlert('Data fetched successfully!', 3000); // Show success alert
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError('Failed to fetch NFT data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNFTData();

    return () => {
      isMounted = false;
    };
  }, [order]);

  console.log(cryptoData);

  const paginationModel = { page: 0, pageSize: 50 };

  if (loading) {
    return (
      <>
        {isAlertVisible && (
          <Alert variant="outlined" severity={error ? 'error' : 'success'}>
            {error ? error : alertMessage}
          </Alert>
        )}
        <CircularProgress />
      </>
    );
  }

  return (
    <>
      <div className="mt-20 Dashboard-container">
        {error && <Alert severity="error">{error}</Alert>}
        <div className="dashboard-area">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <Box sx={{ minWidth: 200 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={order}
                    label="Order"
                    onChange={handleChange}
                  >
                    {orderOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
              <h2 className="text-3xl font-bold text-center">NFT Markets Overview</h2>
            </Grid>
            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              {/* 空的區域 */}
            </Grid>
          </Grid>

          <Paper sx={{ height: '100%', width: '100%' }} elevation={0} className="mt-5 mb-20">
            <DataGrid
              rows={cryptoData}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[20, 30, 40]}
              sx={{ border: 0, cursor: 'pointer' }}
              onRowClick={handleRowClick}
            />
          </Paper>
        </div>
      </div>
    </>
  );
}

export default StickyHeadTable