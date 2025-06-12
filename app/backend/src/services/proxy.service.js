const express = require('express');
const axios = require('axios');

class ProxyService {
	constructor() {
		this.router = express.Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.get('/proxy/:url', this.handleProxyRequest.bind(this));
	}

	async handleProxyRequest(req, res) {
		const { url } = req.params;
		const apiUrl = decodeURIComponent(url);

		try {
			const response = await axios.get(apiUrl);
			res.status(response.status).json(response.data);
		} catch (error) {
			res.status(error.response ? error.response.status : 500).json({
				message: 'Error fetching data from external API',
				error: error.message,
			});
		}
	}
}

module.exports = new ProxyService().router;