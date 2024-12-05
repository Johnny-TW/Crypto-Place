import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

const NFTDashboard = () => {
  const { name } = useParams();
  const [nftData, setNftData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    let isMounted = true;

    const fetchNFTData = async () => {
      try {
        const options = {
          method: "GET",
          url: `https://api.coingecko.com/api/v3/nfts/${name}`,
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": "CG-nrJXAB28gG2xbfsdLieGcxWB",
          },
        };

        const response = await axios.request(options);
        if (isMounted) {
          setNftData(response.data);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Failed to fetch NFT data");
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
  }, [name]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center">
          <svg
            className="animate-spin mx-auto h-12 w-12 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-xl text-gray-700 font-semibold">Loading NFT Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <svg
            className="mx-auto h-16 w-16 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h1 className="text-4xl font-extrabold text-white text-center">
            {nftData.name}
          </h1>
        </div>

        <div className="p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={nftData.image?.small}
            alt={nftData.name}
            className="w-48 h-48 rounded-2xl shadow-lg object-cover border-4 border-white"
          />
          <div className="text-center md:text-left">
            <p className="text-gray-600 mb-4">
              <strong className="text-gray-800">Description:</strong>{" "}
              {nftData.description}
            </p>
            <div className="flex items-center justify-center md:justify-start space-x-4">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-blue-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="font-semibold text-gray-700">
                  {nftData.number_of_unique_addresses} Unique Holders
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-center text-blue-800">
              Floor Price
            </h3>
            <p className="text-center text-xl font-bold text-gray-900">
              {nftData.floor_price?.native_currency} ETH / $
              {nftData.floor_price?.usd}
            </p>
            <p className={`text-center mt-2 font-medium ${nftData.floor_price_24h_percentage_change?.usd >= 0
              ? 'text-green-600'
              : 'text-red-600'
              }`}>
              {nftData.floor_price_24h_percentage_change?.usd.toFixed(2)}%
            </p>
          </div>

          <div className="bg-purple-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-center text-purple-800">
              Market Cap
            </h3>
            <p className="text-center text-xl font-bold text-gray-900">
              ${nftData.market_cap?.usd}
            </p>
            <p className={`text-center mt-2 font-medium ${nftData.market_cap_24h_percentage_change?.usd >= 0
              ? 'text-green-600'
              : 'text-red-600'
              }`}>
              {nftData.market_cap_24h_percentage_change?.usd.toFixed(2)}%
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-center text-green-800">
              24h Volume
            </h3>
            <p className="text-center text-xl font-bold text-gray-900">
              ${nftData.volume_24h?.usd}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">All-Time High</h3>
            <p className="text-gray-600">
              {nftData.ath?.native_currency} ETH / ${nftData.ath?.usd}
            </p>
            <p className={`text-center mt-2 font-medium ${nftData.ath_change_percentage?.usd >= 0
              ? 'text-green-600'
              : 'text-red-600'
              }`}>
              {nftData.ath_change_percentage?.usd.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-4 text-center">
            <a href={nftData.links?.homepage} className="text-blue-600 hover:underline">Homepage</a>
            <a href={nftData.links?.twitter} className="text-blue-600 hover:underline">Twitter</a>
            <a href={nftData.links?.discord} className="text-blue-600 hover:underline">Discord</a>
          </div>
        </div>

        <div className="p-6 text-center">
          <button
            onClick={() => history.push(`/NFT-details/${nftData.id}`)}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full hover:from-blue-600 hover:to-purple-700 transition-all transform hover:-translate-y-1 hover:scale-110 shadow-lg"
          >
            View Detailed NFT Information
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTDashboard;