import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import {
  FormControl, InputLabel, MenuItem, Select, Paper,
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

  const columns = [
    {
      field: 'id', headerName: 'ID', minWidth: 300, align: 'left',
    },
    {
      field: 'symbol', headerName: 'Symbol', minWidth: 300, align: 'left',
    },
    {
      field: 'name', headerName: 'Name', minWidth: 300, align: 'left',
    },
    {
      field: 'asset_platform_id', headerName: 'Asset Platform ID', minWidth: 200, align: 'left',
    },
    {
      field: 'contract_address', headerName: 'Contract Address', minWidth: 600, align: 'left',
    },
  ];

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
            order,
          },
          headers: {
            accept: 'application/json',
            // 'x-cg-demo-api-key': 'CG-nrJXAB28gG2xbfsdLieGcxWB',
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

  const paginationModel = { page: 0, pageSize: 20 };

  if (loading) {
    return (
      <>
        {isAlertVisible && (
          <div className={`alert ${error ? 'alert-error' : 'alert-success'}`}>
            {error || alertMessage}
          </div>
        )}
        <div className="flex justify-center items-center">
          <div className="loader" />
        </div>
      </>
    );
  }

  return (
    <div className="mt-10 container mx-auto">
      <div className="dashboard-area">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="col-span-12 md:col-span-2">
            <div className="min-w-full">
              <div className="w-full">
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
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2 className="text-3xl font-bold text-center">NFT Dashboard</h2>
          </div>
          <div className="col-span-12 md:col-span-2">
            {/* 空的區域 */}
          </div>
        </div>

        <Paper className="mt-5 mb-20" sx={{ height: '100%', width: '100%' }} elevation={0}>
          <DataGrid
            rows={cryptoData}
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
