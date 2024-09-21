import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CoinContext } from '../../context/CoinContext.jsx'
import LineChart from '../../components/LineChart/LineChart.jsx';
import './Coin.scss'

function Coin() {

  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const { currency } = useContext(CoinContext)

  const fetchCoinData = async () => {
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-nrJXAB28gG2xbfsdLieGcxWB' }
    };

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options);
      const data = await response.json();
      setCoinData(data);
    } catch (err) {
      console.error(err);
    }
  }

  const fetchHistoricalData = async () => {
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-nrJXAB28gG2xbfsdLieGcxWB' }
    };

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`, options);
      const data = await response.json();
      setHistoricalData(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  }, [currency])

  console.log(coinData)
  console.log(historicalData)

  // 顯示 Loading 畫面直到 coinData 和 historicalData
  if (!coinData || !historicalData) {
    return (
      <div className='spinner'>
        <div className="spin"></div>
      </div>
    );
  }

  if (!coinData || !historicalData) {
    return (
      <div className='coin'>
        <p className='no-data-message'>Error no data please try again</p>
      </div>
    );
  }

  return (
    <div className='coin'>
      <div className="coin-name">
        {coinData.image?.large && <img src={coinData.image.large} alt={`${coinData.name} logo`} />}
        <p>
          <b>{coinData.name} ({coinData.symbol?.toUpperCase()})</b>
        </p>
      </div>
      <div className="coin-chart">
        <LineChart historicalData={historicalData} />
      </div>
      <div className="coin-info">
        <ul>
          <li>Crypto Market Rank</li>
          <li>{coinData.market_cap_rank}</li>
        </ul>
        <ul>
          <li>Currency Price</li>
          <li>{currency.symbol} {coinData.market_data?.current_price?.[currency.name]?.toLocaleString()}</li>
        </ul>
        <ul>
          <li>Market Cap</li>
          <li>{currency.symbol} {coinData.market_data?.market_cap?.[currency.name]?.toLocaleString()}</li>
        </ul>
        <ul>
          <li>24 Hour High</li>
          <li>{currency.symbol} {coinData.market_data?.high_24h?.[currency.name]?.toLocaleString()}</li>
        </ul>
        <ul>
          <li>24 Hour Low</li>
          <li>{currency.symbol} {coinData.market_data?.low_24h?.[currency.name]?.toLocaleString()}</li>
        </ul>
      </div>
    </div>
  );
}

export default Coin