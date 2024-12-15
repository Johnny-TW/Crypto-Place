import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import ChartSection from '../components/common/ChartSection';
import parse from 'html-react-parser';
import axios from "axios";

const features = [
  {
    name: 'Push to deploy.',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'SSL certificates.',
    description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
    icon: LockClosedIcon,
  },
  {
    name: 'Database backups.',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: ServerIcon,
  },
]

const convertRangeToDays = (range) => {
  switch (range) {
    case '24h':
      return 1;
    case '7d':
      return 7;
    case '30d':
      return 30;
    case '1y':
      return 365;
    default:
      return 1;
  }
};

const days = ['24h', '7d', '30d', '1y'];

const NFTDetails = () => {
  const { name } = useParams();
  const [nftData, setNftData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
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

  console.log(nftData)

  const chartData = [
    {
      floor_price_24h: nftData.floor_price_24h_percentage_change.usd,
      floor_price_7d: nftData.floor_price_7d_percentage_change.usd,
      floor_price_30d: nftData.floor_price_30d_percentage_change.usd,
      floor_price_1y: nftData.floor_price_1y_percentage_change.usd,
    },
  ];

  console.log(chartData)

  return (
    <>
      <div className="overflow-hidden py-24 sm:py-32 mt-5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <img
                  alt="Product screenshot"
                  src={nftData.banner_image}
                  className="max-w-none rounded-xl ring-1 ring-gray-400/10 sm:w-full md:w-full lg:w-[25rem] xl:w-[30rem] md:-ml-4 lg:-ml-0"
                />
                <div className="grid grid-rows-3 grid-flow-col gap-4 mt-5">
                  <div class="row-span-3">
                    <img
                      alt="Product screenshot"
                      src={nftData.image.small_2x}
                      className="max-w-none rounded-xl ring-1"
                    />
                  </div>
                  <div class="col-span-2">
                    <h2 className="text-base/7 font-semibold text-indigo-600 mt-2">Deploy faster</h2>
                  </div>
                  <div class="row-span-2 col-span-2">
                    <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                      {nftData.name}
                    </p>
                  </div>
                </div>
                <p className="text-lg/8 text-gray-600">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque,
                  iste dolor cupiditate blanditiis ratione.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <feature.icon aria-hidden="true" className="absolute left-1 top-1 size-5 text-indigo-600" />
                        {feature.name}
                      </dt>{' '}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="lg:pr-8 lg:pt-4">
              <div className="relative max-lg:row-start-1">
                <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                  <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                    <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                      NFT Performance
                    </p>
                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                      Performance metrics for {nftData.name} across different time ranges
                    </p>
                  </div>
                  <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-12 lg:pb-2">
                    <div className="w-full space-y-4">
                      <div className="flex space-x-2 justify-center">
                        {days.map((range) => (
                          <button
                            key={range}
                            onClick={() => setTimeRange(convertRangeToDays(range))}
                            className={`px-4 py-2 rounded-md transition-colors ${timeRange === convertRangeToDays(range)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                          >
                            {range.toUpperCase()}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Floor Price Change</p>
                          <p className={`text-lg font-bold ${nftData.floor_price_24h_percentage_change.usd >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                            }`}>
                            {nftData.floor_price_24h_percentage_change.usd.toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Current Floor Price</p>
                          <p className="text-lg font-bold text-gray-900">
                            ${nftData.floor_price?.usd?.toFixed(2) || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NFTDetails;