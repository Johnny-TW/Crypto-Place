import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const CRYPTOCOMPARE_API_URL = 'https://data-api.cryptocompare.com';

export const getCoins = async (req, res) => {
	try {
		const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
			params: {
				vs_currency: req.query.vs_currency || 'usd',
				order: req.query.order || 'market_cap_desc',
				per_page: req.query.per_page || 100,
				page: req.query.page || 1
			}
		});
		res.json(response.data);
	} catch (error) {
		console.error('Error fetching coins:', error.message);
		res.status(error.response?.status || 500).json({
			error: error.message,
			details: error.response?.data
		});
	}
};

export const getCoinById = async (req, res) => {
	try {
		const response = await axios.get(`${COINGECKO_API_URL}/coins/${req.params.id}`);
		res.json(response.data);
	} catch (error) {
		console.error(`Error fetching coin ${req.params.id}:`, error.message);
		res.status(error.response?.status || 500).json({
			error: error.message,
			details: error.response?.data
		});
	}
};

export const getNfts = async (req, res) => {
	try {
		const response = await axios.get(`${COINGECKO_API_URL}/nfts/list`);
		res.json(response.data);
	} catch (error) {
		console.error('Error fetching NFTs:', error.message);
		res.status(error.response?.status || 500).json({
			error: error.message,
			details: error.response?.data
		});
	}
};

export const getNftById = async (req, res) => {
	try {
		const response = await axios.get(`${COINGECKO_API_URL}/nfts/${req.params.id}`);
		res.json(response.data);
	} catch (error) {
		console.error(`Error fetching NFT ${req.params.id}:`, error.message);
		res.status(error.response?.status || 500).json({
			error: error.message,
			details: error.response?.data
		});
	}
};

export const getMarketData = async (req, res) => {
	try {
		const response = await axios.get(`${COINGECKO_API_URL}/coins/${req.params.id}/market_chart`, {
			params: {
				vs_currency: req.query.vs_currency || 'usd',
				days: req.query.days || '30'
			}
		});
		res.json(response.data);
	} catch (error) {
		console.error(`Error fetching market data for ${req.params.id}:`, error.message);
		res.status(error.response?.status || 500).json({
			error: error.message,
			details: error.response?.data
		});
	}
};

export const getCryptoNews = async (req, res) => {
	try {
		const response = await axios.get(`${CRYPTOCOMPARE_API_URL}/news/v1/article/list`, {
			params: {
				categories: req.query.categories || 'BTC,ETH',
				excludeCategories: req.query.excludeCategories || 'Conference',
				lTs: req.query.lTs || '0'
			}
		});
		res.json(response.data);
	} catch (error) {
		console.error('Error fetching crypto news:', error.message);
		res.status(error.response?.status || 500).json({
			error: error.message,
			details: error.response?.data
		});
	}
};

export const getCryptoDetails = async (req, res) => {
	try {
		const coinId = req.params.id;
		console.log(`Fetching crypto details for ID: ${coinId}`);

		const response = await axios.get(`${COINGECKO_API_URL}/coins/${coinId}`, {
			headers: {
				'accept': 'application/json',
				'x-cg-demo-api-key': process.env.API_KEY
			}
		});
		res.json(response.data);
	} catch (error) {
		console.error(`Error fetching crypto details for ID ${req.params.id}:`, error.message);
		res.status(error.response?.status || 500).json({
			error: error.message,
			details: error.response?.data
		});
	}
};

export const getCryptoDetailsChart = async (req, res) => {
	try {
		const response = await axios.get(`${COINGECKO_API_URL}/coins/${req.params.id}/market_chart`, {
			params: {
				vs_currency: req.query.vs_currency || 'usd',
				days: req.query.days || '30'
			}
		});
		res.json(response.data);
	} catch (error) {
		console.error(`Error fetching crypto chart for ${req.params.id}:`, error.message);
		res.status(error.response?.status || 500).json({
			error: error.message,
			details: error.response?.data
		});
	}
};

export const getCryptoMarketList = async (req, res) => {
	try {
		const response = await axios.get(`${COINGECKO_API_URL}/exchanges`, {
			params: {
				per_page: req.query.per_page || 100,
				page: req.query.page || 1
			}
		});
		res.json(response.data);
	} catch (error) {
		console.error('Error fetching crypto market list:', error.message);
		res.status(error.response?.status || 500).json({
			error: error.message,
			details: error.response?.data
		});
	}
};