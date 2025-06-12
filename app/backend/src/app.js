import express from 'express';
import cors from 'cors';
import axios from 'axios';
import corsConfig from './config/cors.config.js';

const app = express();

app.use(cors(corsConfig));
app.use(express.json());

app.get('/api/coins/markets', async (req, res) => {
	try {
		const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
			params: {
				vs_currency: req.query.vs_currency || 'usd',
				order: req.query.order || 'market_cap_desc',
				per_page: req.query.per_page || 100,
				page: req.query.page || 1,
				...req.query,
			},
			headers: {
				'accept': 'application/json',
				'x-cg-demo-api-key': process.env.API_KEY
			}
		});

		res.json(response.data);
	} catch (error) {
		console.error('Error fetching coins markets:', error.message);
		res.status(error.response?.status || 500).json({ error: error.message });
	}
});

app.get('/api/coins/:coinId', async (req, res) => {
	try {
		const { coinId } = req.params;
		const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
			headers: {
				'accept': 'application/json',
				'x-cg-demo-api-key': process.env.API_KEY
			}
		});
		res.json(response.data);
	} catch (error) {
		console.error(`Error fetching coin data for ${req.params.coinId}:`, error.message);
		res.status(error.response?.status || 500).json({ error: error.message });
	}
});

app.get('/api/nfts/list', async (req, res) => {
	try {
		const response = await axios.get('https://api.coingecko.com/api/v3/nfts/list', {
			headers: {
				'accept': 'application/json',
				'x-cg-demo-api-key': process.env.API_KEY
			}
		});
		res.json(response.data);
	} catch (error) {
		console.error('Error fetching NFT list:', error.message);
		res.status(error.response?.status || 500).json({ error: error.message });
	}
});

app.get('/api/nfts/pudgy-penguins', async (req, res) => {
	try {
		const response = await axios.get('https://api.coingecko.com/api/v3/nfts/pudgy-penguins', {
			headers: {
				'accept': 'application/json',
				'x-cg-demo-api-key': process.env.API_KEY
			}
		});
		res.json(response.data);
	} catch (error) {
		console.error('Error fetching NFT data:', error.message);
		res.status(error.response?.status || 500).json({ error: error.message });
	}
});

app.get('/api/coins/:coinId/market_chart', async (req, res) => {
	try {
		const { coinId } = req.params;
		const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
			params: req.query,
			headers: {
				'accept': 'application/json',
				'x-cg-demo-api-key': process.env.API_KEY
			}
		});
		res.json(response.data);
	} catch (error) {
		console.error(`Error fetching market chart for ${coinId}:`, error.message);
		res.status(error.response?.status || 500).json({ error: error.message });
	}
});

app.get('/api/news', async (req, res) => {
	try {
		const response = await axios.get('https://data-api.cryptocompare.com/news/v1/article/list', {
			params: req.query,
		});
		res.json(response.data);
	} catch (error) {
		console.error('Error fetching crypto news:', error.message);
		res.status(error.response?.status || 500).json({ error: error.message });
	}
});

app.get('/api/crypto-details/:coinId', async (req, res) => {
	try {
		const { coinId } = req.params;
		const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
			params: req.query,
			headers: {
				'accept': 'application/json',
				'x-cg-demo-api-key': process.env.API_KEY
			}
		});
		res.json(response.data);
	} catch (error) {
		console.error(`Error fetching crypto details for ${coinId}:`, error.message);
		res.status(error.response?.status || 500).json({ error: error.message });
	}
});

app.get('/api/crypto-details/chart/:coinId', async (req, res) => {
	try {
		const { coinId } = req.params;
		const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
			params: req.query,
			headers: {
				'accept': 'application/json',
				'x-cg-demo-api-key': process.env.API_KEY
			}
		});
		res.json(response.data);
	} catch (error) {
		console.error(`Error fetching crypto details chart for ${coinId}:`, error.message);
		res.status(error.response?.status || 500).json({ error: error.message });
	}
});

app.get('/api/crypto-market-list', async (req, res) => {
	try {
		const response = await axios.get('https://api.coingecko.com/api/v3/exchanges', {
			headers: {
				'accept': 'application/json',
				'x-cg-demo-api-key': process.env.API_KEY
			}
		});
		res.json(response.data);
	} catch (error) {
		console.error('Error fetching crypto market list:', error.message);
		res.status(error.response?.status || 500).json({ error: error.message });
	}
});

app.get('/api/exchanges/:id', async (req, res) => {
	try {
		const exchangeId = req.params.id || 'binance';
		const response = await axios.get(`https://api.coingecko.com/api/v3/exchanges/${exchangeId}`, {
			headers: {
				'accept': 'application/json',
				'x-cg-demo-api-key': process.env.API_KEY
			}
		});
		res.json(response.data);
	} catch (error) {
		console.error(`Error fetching exchange info for ${req.params.id}:`, error.message);
		res.status(error.response?.status || 500).json({
			error: error.message,
			details: error.response?.data
		});
	}
});

app.get('/', (req, res) => {
	res.json({
		message: 'Welcome to Crypto Place API',
		endpoints: {
			coins: '/api/coins/markets',
			coinById: '/api/coins/bitcoin',
			nfts: '/api/nfts/list',
			nftById: '/api/nfts/pudgy-penguins',
			marketData: '/api/coins/bitcoin/market_chart',
			news: '/api/news',
			cryptoDetails: '/api/coins/:id',
			cryptoDetailsChart: '/api/crypto-details/chart/bitcoin',
			cryptoMarketList: '/api/crypto-market-list',
		},
	});
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
	console.log(`Server is running on port ${PORT} and accessible externally`);
});