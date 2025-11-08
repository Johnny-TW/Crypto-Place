import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GlobeAltIcon } from '@heroicons/react/20/solid';
import { FaDiscord, FaXTwitter } from 'react-icons/fa6';
import { Heart, Trophy } from 'lucide-react';

import LogoClouds from '@components/common/LogoClouds';
import MediaCard from '@components/common/MediaCard';
import PerformanceTable from '@components/nft/performance/PerformanceTable';
import { Badge } from '@/components/ui/badge';
import NFTInfoSection from '@components/nft/Info/NFTInfoSection';
import NFTLinksSection from '@components/nft/Info/NFTLinksSection';

function ExpandableDescription({
  html,
  maxLength = 300,
}: {
  html: string;
  maxLength?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 讓文字不帶 HTML 標籤計算長度
  const stripHtml = (htmlString: string): string => {
    const tmp = document.createElement('div');
    tmp.innerHTML = htmlString;
    return tmp.textContent || tmp.innerText || '';
  };

  const plainText = stripHtml(html);
  const shouldTruncate = plainText.length > maxLength;

  // HTML 結構保持完整
  const getTruncatedHtml = (): string => {
    if (!shouldTruncate || isExpanded) return html;

    let charCount = 0;
    let htmlIndex = 0;
    let inTag = false;

    while (charCount < maxLength && htmlIndex < html.length) {
      if (html[htmlIndex] === '<') {
        inTag = true;
      } else if (html[htmlIndex] === '>') {
        inTag = false;
        htmlIndex += 1;

        continue;
      }

      if (!inTag && html[htmlIndex] !== '>') {
        charCount += 1;
      }
      htmlIndex += 1;
    }

    return `${html.substring(0, htmlIndex)}...`;
  };

  return (
    <div className='space-y-2'>
      <div
        className='text-sm prose prose-sm max-w-none prose-headings:font-bold prose-h3:text-base prose-h3:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed'
        dangerouslySetInnerHTML={{ __html: getTruncatedHtml() }}
      />

      {shouldTruncate ? (
        <button
          type='button'
          onClick={() => setIsExpanded(!isExpanded)}
          className='text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1'
        >
          {isExpanded ? (
            <>
              Show less
              <span className='text-xs'>↑</span>
            </>
          ) : (
            <>
              Read more
              <span className='text-xs'>→</span>
            </>
          )}
        </button>
      ) : null}
    </div>
  );
}

function NFTDetails() {
  const { name } = useParams<{ name: string }>();
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector(
    (state: any) =>
      state.nftDetails || {
        data: {
          nftData: {},
          newsData: [],
          newsLoading: false,
          newsError: null,
        },
        loading: false,
        error: null,
      }
  );

  const { nftData, newsData } = data;

  useEffect(() => {
    if (name) {
      dispatch({ type: 'FETCH_NFT_DETAILS', payload: { nftId: name } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  useEffect(() => {
    dispatch({ type: 'FETCH_NFT_NEWS' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen bg-red-50'>
        <div className='text-center bg-white p-8 rounded-xl shadow-lg'>
          <svg
            className='mx-auto h-16 w-16 text-red-500 mb-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <h2 className='text-2xl font-bold text-red-600 mb-2'>Error</h2>
          <p className='text-gray-700'>{error}</p>
        </div>
      </div>
    );
  }

  const chartData = [
    {
      timePeriod: '24h',
      percentage:
        nftData?.floor_price_24h_percentage_change?.native_currency || 0,
    },
    {
      timePeriod: '7d',
      percentage:
        nftData?.floor_price_7d_percentage_change?.native_currency || 0,
    },
    {
      timePeriod: '14d',
      percentage:
        nftData?.floor_price_14d_percentage_change?.native_currency || 0,
    },
    {
      timePeriod: '30d',
      percentage:
        nftData?.floor_price_30d_percentage_change?.native_currency || 0,
    },
    {
      timePeriod: '60d',
      percentage:
        nftData?.floor_price_60d_percentage_change?.native_currency || 0,
    },
    {
      timePeriod: '1y',
      percentage:
        nftData?.floor_price_1y_percentage_change?.native_currency || 0,
    },
  ];

  const links = [
    {
      name: 'Website',
      link: nftData?.links?.homepage || '#',
      icon: GlobeAltIcon,
    },
    {
      name: 'Discord',
      link: nftData?.links?.discord || '#',
      icon: FaDiscord,
    },
    {
      name: 'Twitter',
      link: nftData?.links?.twitter || '#',
      icon: FaXTwitter,
    },
  ];

  const percentageChange =
    nftData?.market_cap_24h_percentage_change?.native_currency || 0;
  const percentageChangeClass =
    percentageChange >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className='overflow-hidden'>
      <div className='mx-auto max-w-1xl lg:px-8'>
        <div className='mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2'>
          <div className=''>
            <div className='lg:max-w-lg'>
              <img
                src={nftData?.banner_image}
                alt={nftData?.name}
                className='max-w-none rounded-xl ring-1 ring-gray-400/10 sm:w-full md:w-full lg:w-[25rem] xl:w-full  xxl:w-full md:-ml-4 lg:-ml-0 shadow-md'
              />
            </div>
            <div className='w-full max-w-full mt-5'>
              <div className='flex items-center gap-3 mb-2'>
                <p className='text-pretty text-2xl font-semibold tracking-tight text-gray-900 sm:text-1xl'>
                  {nftData?.name}
                </p>
                {nftData?.symbol ? (
                  <span className='text-sm text-gray-500 font-medium'>
                    ({nftData.symbol})
                  </span>
                ) : null}
              </div>
              <div className='flex items-center gap-2 flex-wrap'>
                {nftData?.market_cap_rank ? (
                  <Badge
                    variant='secondary'
                    className='bg-yellow-50 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100 ring-1 ring-inset ring-yellow-600/20'
                  >
                    <Trophy className='w-3.5 h-3.5 mr-1 fill-yellow-500 text-yellow-600' />
                    Rank #{nftData.market_cap_rank}
                  </Badge>
                ) : null}
                {nftData?.user_favorites_count ? (
                  <Badge
                    variant='secondary'
                    className='bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900 dark:text-pink-100'
                  >
                    <Heart className='w-4 h-4 mr-1 fill-pink-500 text-pink-500' />
                    {nftData.user_favorites_count.toLocaleString()} users
                    favorited this collection
                  </Badge>
                ) : null}
              </div>
              <div className='flex items-center space-x-4 mt-5'>
                <img
                  className='w-20 h-20 rounded-2xl shadow-lg object-cover border-4 border-white'
                  src={nftData?.image?.small_2x}
                  alt={nftData?.name}
                />
                <div className='text-left flex-col items-center space-y-2'>
                  <p className='text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
                    {nftData?.floor_price?.native_currency}{' '}
                    {nftData?.native_currency_symbol}
                  </p>
                  {nftData?.floor_price?.usd ? (
                    <p className='text-sm text-gray-500 font-medium'>
                      ${nftData.floor_price.usd.toLocaleString()}
                    </p>
                  ) : null}
                </div>
                <p
                  className={`text-3xl font-bold px-5 ${percentageChangeClass}`}
                >
                  {percentageChange.toFixed(2)} %
                </p>
              </div>
              <NFTInfoSection nftData={nftData} />
              <NFTLinksSection links={links} />
            </div>
          </div>
          <div className=''>
            <div className='relative max-lg:row-start-1'>
              <div className='mb-5'>
                <p className='mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center'>
                  NFT Performance
                </p>
                <p className='mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center'>
                  Performance metrics for {nftData?.name} across different time
                  ranges
                </p>
              </div>
              <PerformanceTable chartData={chartData} />
              <div className='mt-6 text-base text-gray-600 max-w-full'>
                <h1 className='font-bold text-black text-lg mb-2'>
                  About {nftData?.name}
                </h1>
                {nftData?.description ? (
                  <ExpandableDescription
                    html={nftData.description}
                    maxLength={3200}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <MediaCard newsData={newsData} />
        <LogoClouds />
      </div>
    </div>
  );
}

export default NFTDetails;
