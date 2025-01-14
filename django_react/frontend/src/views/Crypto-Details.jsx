import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import DescriptionSection from '../components/common/DescriptionSection';
import ChartSection from '../components/common/ChartSection';
import Dashboard from '../components/common/Dashboard';
import PriceOverviewSection from '../components/common/PriceOverviewSection';
import CryptoNews from '../components/common/CryptoNews';
import BasicBreadcrumbs from '../components/common/Breadcrumbs';
import { fetchCryptoDetails } from '../redux/saga/cryptoDetails';
import axios from 'axios';

const columns = [
  { field: 'trust_score_rank', headerName: '#', minWidth: 100, align: 'left' },
  {
    field: 'image', headerName: 'Exchange', minWidth: 100, align: 'left', renderCell: (params) => (
      <img
        src={params.value}
        alt={`${params.row.name} logo`}
        style={{ width: '30px', height: '30px', margin: '10px' }}
      />
    )
  },
  { field: 'id', headerName: 'ID', minWidth: 150, align: 'left', },
  { field: 'year_established', headerName: 'Symbol', minWidth: 100, align: 'left' },
  { field: 'country', headerName: 'Name', minWidth: 250 },
  {
    field: 'url',
    headerName: 'URL',
    minWidth: 250,
    align: 'left',
    renderCell: (params) => (
      <a href={params.value} target="_blank" rel="noopener noreferrer">{params.value}</a>
    )
  },
  {
    field: 'has_trading_incentive',
    headerName: 'Trading incentive',
    minWidth: 200,
    align: 'left',
    renderCell: (params) => {
      const value = params.value;
      return (
        <span>
          {value ? (true) : (<span style={{ color: 'red' }}>⬤</span>)}
        </span>
      );
    },
  },
  {
    field: 'trust_score',
    headerName: 'Trust score',
    minWidth: 100,
    align: 'left'
  },
  {
    field: 'trade_volume_24h_btc',
    headerName: 'Trade volume 24h btc',
    minWidth: 200,
    align: 'left',
    renderCell: (params) => {
      const value = parseFloat(params.value).toFixed(2);
      return <span>{value}</span>;
    },
  },
  {
    field: 'trade_volume_24h_btc_normalized',
    headerName: 'Trade volume 24h btc normalized',
    minWidth: 300,
    align: 'left'
  },
];

const CryptoDetails = () => {
  const dispatch = useDispatch();
  const { coinId } = useParams();
  const { cryptoDetails } = useSelector(state => state.cryptoDetails);
  const [coinChartData, setcoinChartData] = useState(null);
  const [marketListData, setmarketListData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    dispatch(fetchCryptoDetails(coinId));
  }, [dispatch, coinId]);

  useEffect(() => {
    const fetchCoinChartData = async () => {
      setLoading(true);
      try {
        const options = {
          method: 'GET',
          url: 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart',
          params: {
            vs_currency: 'usd',
            days: `${timeRange}`,
            interval: 'daily',
            precision: '18'
          },
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-nrJXAB28gG2xbfsdLieGcxWB'
          }
        };

        const response = await axios.request(options);
        setcoinChartData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchCoinChartData();
  }, [coinId, timeRange]);

  useEffect(() => {
    const fetchMarketListData = async () => {
      setLoading(true);
      try {
        const options = {
          method: 'GET',
          url: 'https://api.coingecko.com/api/v3/exchanges',
          params: {
            per_page: '250'
          },
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-nrJXAB28gG2xbfsdLieGcxWB'
          }
        };

        const response = await axios.request(options);
        setmarketListData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchMarketListData();
  }, []);

  console.log(cryptoDetails)
  console.log(coinChartData)
  console.log(marketListData)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20 max-w-7xl">
      <BasicBreadcrumbs />
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8 mt-5">
        <img
          src={cryptoDetails.image.large}
          alt={cryptoDetails.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold">{cryptoDetails.name}</h1>
          <p className="text-gray-500 uppercase">{cryptoDetails.symbol}</p>
        </div>
      </div>
      {/* PriceOverview Section */}
      <PriceOverviewSection data={cryptoDetails} />
      {/* Chart Section */}
      <ChartSection coinChartData={coinChartData} timeRange={timeRange} setTimeRange={setTimeRange} />
      {/* Description Section */}
      <DescriptionSection name={cryptoDetails.name} description={cryptoDetails.description.en} href={cryptoDetails.links} />
      {/* Market Section */}
      <Dashboard columns={columns} marketListData={marketListData} />
      {/* News Section */}
      <CryptoNews />
    </div>
  );
};

export default CryptoDetails;