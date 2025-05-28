import express from 'express';
import {
  getCoins,
  getCoinById,
  getNfts,
  getNftById,
  getMarketData,
  getCryptoNews,
  getCryptoDetails,
  getCryptoDetailsChart,
  getCryptoMarketList
} from '../controllers/api.controller.js';

const router = express.Router();

router.get('/coins', getCoins);
router.get('/coins/:id', getCoinById);
router.get('/nfts', getNfts);
router.get('/nfts/:id', getNftById);
router.get('/market-data/:id', getMarketData);
router.get('/news', getCryptoNews);
router.get('/crypto-details/chart/:id', getCryptoDetailsChart);
router.get('/crypto-market-list', getCryptoMarketList);
router.get('/crypto-details/:id', getCryptoDetails);

export default router;