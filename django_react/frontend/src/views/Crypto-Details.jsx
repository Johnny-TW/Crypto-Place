import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import DescriptionSection from '@components/common/DescriptionSection';
import ChartSection from '@components/common/ChartSection';
import Dashboard from '@components/common/Dashboard';
import PriceOverviewSection from '@components/common/PriceOverviewSection';
import CryptoNews from '@components/common/CryptoNews';
import BasicBreadcrumbs from '@components/common/Breadcrumbs';
import AutoPlay from '@components/common/AutoPlay';

import { fetchCryptoDetails } from '@redux/saga/cryptoDetails';
import { fetchCryptoChart } from '@redux/saga/cryptoCoinChart';
import { fetchCryptoMarketList } from '@redux/saga/cryptoMarketList';

function CryptoDetails() {
  const columns = useMemo(() => [
    {
      field: 'trust_score_rank', headerName: '#', minWidth: 100, align: 'left',
    },
    {
      field: 'image',
      headerName: 'Exchange',
      minWidth: 100,
      align: 'left',
      renderCell: (params) => (
        <img src={params.value} alt={`${params.row.name} logo`} style={{ width: '30px', height: '30px', margin: '10px' }} />
      ),
    },
    {
      field: 'id', headerName: 'ID', minWidth: 150, align: 'left',
    },
    {
      field: 'year_established', headerName: 'Symbol', minWidth: 100, align: 'left',
    },
    { field: 'country', headerName: 'Name', minWidth: 250 },
    {
      field: 'url',
      headerName: 'URL',
      minWidth: 250,
      align: 'left',
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    {
      field: 'has_trading_incentive',
      headerName: 'Trading incentive',
      minWidth: 200,
      align: 'left',
      renderCell: (params) => <span>{params.value ? '✅' : <span style={{ color: 'red' }}>⬤</span>}</span>,
    },
    {
      field: 'trust_score', headerName: 'Trust score', minWidth: 100, align: 'left',
    },
    {
      field: 'trade_volume_24h_btc',
      headerName: 'Trade volume 24h BTC',
      minWidth: 200,
      align: 'left',
      renderCell: (params) => <span>{parseFloat(params.value).toFixed(2)}</span>,
    },
    {
      field: 'trade_volume_24h_btc_normalized', headerName: 'Trade volume 24h BTC normalized', minWidth: 300, align: 'left',
    },
  ], []);

  const dispatch = useDispatch();
  const { coinId } = useParams();
  const [timeRange, setTimeRange] = useState('24h');

  const { cryptoDetails, loading: detailsLoading } = useSelector((state) => state.cryptoDetails);
  const { chartData, loading: chartLoading } = useSelector((state) => state.cryptoDetailsChart);
  const {
    marketListData, loading: marketListLoading,
  } = useSelector((state) => state.cryptoMarketList);

  const isLoading = detailsLoading || chartLoading || marketListLoading || !cryptoDetails || !chartData || !marketListData;

  const fetchData = useCallback(() => {
    dispatch(fetchCryptoDetails(coinId));
    dispatch(fetchCryptoChart(coinId, timeRange));
    dispatch(fetchCryptoMarketList());
  }, [dispatch, coinId, timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20 max-w-7xl">
      <BasicBreadcrumbs />
      {cryptoDetails?.image && (
        <div className="flex items-center gap-4 mb-8 mt-5">
          <img src={cryptoDetails.image.large} alt={cryptoDetails.name} className="w-16 h-16 rounded-full" />
          <div>
            <h1 className="text-3xl font-bold">{cryptoDetails.name}</h1>
            <p className="text-gray-500 uppercase">{cryptoDetails.symbol}</p>
          </div>
        </div>
      )}
      <PriceOverviewSection data={cryptoDetails} />
      <ChartSection coinChartData={chartData} timeRange={timeRange} setTimeRange={setTimeRange} />
      <DescriptionSection
        name={cryptoDetails.name}
        description={cryptoDetails.description.en}
        href={cryptoDetails.links}
      />
      <Dashboard columns={columns} marketListData={marketListData} />
      <CryptoNews />
      <AutoPlay />
    </div>
  );
}

export default CryptoDetails;
