import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Globe,
  ShieldCheck,
  ShieldAlert,
  Shield,
  ExternalLink,
  TrendingUp,
  Share2,
  Star,
} from 'lucide-react';

import { LogoClouds } from '@components/shared/branding';
import ExchangeCharts from '@components/exchange/ExchangeCharts';
import ExchangeSocialLinks from '@components/exchange/ExchangeSocialLinks';
import ExchangeAnnouncements from '@components/exchange/ExchangeAnnouncements';

interface TickerData {
  coin_id: string;
  name: string;
  base: string;
  target: string;
  market: {
    identifier: string;
    name: string;
  };
  last: number;
  volume: number;
  converted_last: {
    btc: number;
    eth: number;
    usd: number;
  };
  converted_volume: {
    btc: number;
    eth: number;
    usd: number;
  };
  trust_score: string;
  bid_ask_spread_percentage: number;
  timestamp: string;
  last_traded_at: string;
  last_fetch_at: string;
  is_anomaly: boolean;
  is_stale: boolean;
  trade_url: string;
  token_info_url: string | null;
}

interface RouteParams {
  exchangeId: string;
  [key: string]: string | undefined;
}

interface RootState {
  cryptoExchangesDetails: {
    data: any;
    loading: boolean;
    error: string | null;
  };
}

const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'a',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'span',
      'div',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid Date';

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return 'Invalid Date';
  }
};

const getTrustScoreInfo = (score: number | null) => {
  if (score === null || score === undefined)
    return { color: 'text-gray-500', icon: Shield, label: 'Unknown' };
  if (score >= 8)
    return { color: 'text-green-600', icon: ShieldCheck, label: 'High' };
  if (score >= 5)
    return { color: 'text-yellow-600', icon: Shield, label: 'Medium' };
  return { color: 'text-red-600', icon: ShieldAlert, label: 'Low' };
};

function CryptoExchangesDetails() {
  const dispatch = useDispatch();
  const { exchangeId } = useParams<RouteParams>();
  const { data: exchangeDetails, loading: isLoading } = useSelector(
    (state: RootState) => state.cryptoExchangesDetails
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (exchangeId) {
      dispatch({ type: 'FETCH_EXCHANGE_DETAILS', payload: exchangeId });
    }
  }, [exchangeId, dispatch]);

  const currentTickers = useMemo(() => {
    if (!exchangeDetails?.tickers) return [];
    const startIndex = currentPage * pageSize;
    return exchangeDetails.tickers.slice(startIndex, startIndex + pageSize);
  }, [exchangeDetails, currentPage, pageSize]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!exchangeDetails) {
    return (
      <div className='text-center py-20'>
        <h2 className='text-2xl font-bold text-gray-700'>Exchange not found</h2>
        <Link
          to='/exchanges'
          className='text-blue-600 hover:underline mt-4 inline-block'
        >
          Back to Exchanges
        </Link>
      </div>
    );
  }

  const trustScoreInfo = getTrustScoreInfo(exchangeDetails.trust_score);

  return (
    <div className='min-h-screen w-full'>
      <div className='container mx-auto px-4 sm:px-6 py-8 max-w-8xl'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Left Sidebar - Identity & Info */}
          <div className='lg:col-span-1 space-y-6'>
            {/* Identity Card */}
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <img
                  className='w-16 h-16 rounded-full border border-gray-200 bg-white p-1'
                  src={exchangeDetails.image}
                  alt={exchangeDetails.name}
                />
                <div>
                  <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>
                    {exchangeDetails.name}
                  </h1>
                  <div className='flex gap-2 mt-1'>
                    <Badge
                      variant='secondary'
                      className='text-xs font-normal bg-gray-100 text-gray-600'
                    >
                      Rank #{exchangeDetails.trust_score_rank || 'N/A'}
                    </Badge>
                    <Badge
                      variant='secondary'
                      className='text-xs font-normal bg-gray-100 text-gray-600'
                    >
                      {exchangeDetails.centralized ? 'CEX' : 'DEX'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                {exchangeDetails.url && (
                  <a
                    href={exchangeDetails.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors w-full'
                  >
                    <Globe className='w-4 h-4' />
                    Website
                    <ExternalLink className='w-3 h-3 opacity-70' />
                  </a>
                )}
                <div className='grid grid-cols-2 gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='gap-2 w-full'
                    aria-label='Share exchange'
                  >
                    <Share2 className='w-4 h-4' />
                    Share
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='gap-2 w-full'
                    aria-label='Add to watchlist'
                  >
                    <Star className='w-4 h-4' />
                    Watch
                  </Button>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className='space-y-2'>
              <h3 className='text-base font-bold text-gray-900'>About</h3>
              <div className='text-sm text-gray-600 leading-relaxed'>
                {exchangeDetails.description ? (
                  <div
                    className='prose prose-sm max-w-none'
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(exchangeDetails.description),
                    }}
                  />
                ) : (
                  <p className='text-gray-500 italic'>
                    No description available.
                  </p>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className='space-y-2'>
              <h3 className='text-base font-bold text-gray-900'>Info</h3>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-500'>Established</span>
                  <span className='font-medium text-gray-900'>
                    {exchangeDetails.year_established || 'N/A'}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-500'>Country</span>
                  <span className='font-medium text-gray-900'>
                    {exchangeDetails.country || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Community Section */}
            <div className='space-y-2'>
              <h3 className='text-base font-bold text-gray-900'>Community</h3>
              <ExchangeSocialLinks
                url={exchangeDetails.url}
                facebook_url={exchangeDetails.facebook_url}
                reddit_url={exchangeDetails.reddit_url}
                telegram_url={exchangeDetails.telegram_url}
                twitter_handle={exchangeDetails.twitter_handle}
                slack_url={exchangeDetails.slack_url}
                other_url_1={exchangeDetails.other_url_1}
                other_url_2={exchangeDetails.other_url_2}
                compact={false}
              />
            </div>
          </div>

          {/* Main Content - Stats, Charts, Table */}
          <div className='lg:col-span-3 space-y-8'>
            {/* Stats Bar */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {/* Volume */}
              <div className='p-4 rounded-xl border border-gray-200 bg-white shadow-sm'>
                <span className='text-xs text-gray-500 font-medium uppercase tracking-wider'>
                  Spot Volume (24h)
                </span>
                <div className='mt-2 flex items-baseline gap-2'>
                  <span className='text-2xl font-bold text-gray-900'>
                    {(() => {
                      const volume =
                        exchangeDetails.trade_volume_24h_btc_normalized ||
                        exchangeDetails.trade_volume_24h_btc;
                      if (!volume || Number(volume) === 0) return 'N/A';
                      return Number(volume).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      });
                    })()}
                  </span>
                  <span className='text-sm font-bold text-gray-500'>BTC</span>
                </div>
                <div className='mt-1 flex items-center gap-1 text-xs text-green-600 font-medium'>
                  <TrendingUp className='w-3 h-3' />
                  {exchangeDetails.trade_volume_24h_btc_normalized ||
                  exchangeDetails.trade_volume_24h_btc
                    ? 'High Activity'
                    : 'No Data'}
                </div>
              </div>

              {/* Trust Score */}
              <div className='p-4 rounded-xl border border-gray-200 bg-white shadow-sm'>
                <span className='text-xs text-gray-500 font-medium uppercase tracking-wider'>
                  Trust Score
                </span>
                <div className='mt-2 flex items-center gap-3'>
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                      (exchangeDetails.trust_score || 0) >= 8
                        ? 'bg-green-100 text-green-700'
                        : (exchangeDetails.trust_score || 0) >= 5
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    <span className='font-bold text-lg'>
                      {exchangeDetails.trust_score || 0}
                    </span>
                  </div>
                  <div className='flex flex-col'>
                    <span
                      className={`text-sm font-bold ${trustScoreInfo.color}`}
                    >
                      {trustScoreInfo.label}
                    </span>
                    <span className='text-xs text-gray-500'>/ 10</span>
                  </div>
                </div>
              </div>

              {/* Market Stats */}
              <div className='p-4 rounded-xl border border-gray-200 bg-white shadow-sm'>
                <span className='text-xs text-gray-500 font-medium uppercase tracking-wider'>
                  Market Stats
                </span>
                <div className='mt-2 flex justify-between items-center'>
                  <div className='flex flex-col'>
                    <span className='text-lg font-bold text-gray-900'>
                      {exchangeDetails.tickers?.length || 0}
                    </span>
                    <span className='text-xs text-gray-500'>Pairs</span>
                  </div>
                  <div className='w-px h-8 bg-gray-100'></div>
                  <div className='flex flex-col items-end'>
                    {/* Placeholder for Coins count if available in API, otherwise using generic label */}
                    <span className='text-lg font-bold text-gray-900'>--</span>
                    <span className='text-xs text-gray-500'>Coins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className='space-y-4'>
              <h2 className='text-xl font-bold text-gray-900'>
                Exchange Analytics
              </h2>
              <ExchangeCharts exchangeDetails={exchangeDetails} />
            </div>

            {/* Tabs: Spot (Table) & News */}
            <Tabs defaultValue='spot' className='w-full space-y-6'>
              <TabsList className='w-full justify-start border-b rounded-none bg-transparent h-auto p-0 space-x-6'>
                <TabsTrigger
                  value='spot'
                  className='rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none px-0 py-3 font-semibold text-gray-500 hover:text-gray-700'
                >
                  Spot Pairs
                </TabsTrigger>
                <TabsTrigger
                  value='news'
                  className='rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none px-0 py-3 font-semibold text-gray-500 hover:text-gray-700'
                >
                  News
                </TabsTrigger>
              </TabsList>

              {/* Spot Pairs Content */}
              <TabsContent value='spot'>
                <div className='rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm'>
                  <div className='overflow-x-auto'>
                    <Table>
                      <TableHeader>
                        <TableRow className='bg-gray-50 hover:bg-gray-50'>
                          <TableHead className='font-bold text-gray-700 w-[200px]'>
                            Coin
                          </TableHead>
                          <TableHead className='font-bold text-gray-700'>
                            Pair
                          </TableHead>
                          <TableHead className='text-right font-bold text-gray-700'>
                            Price (USD)
                          </TableHead>
                          <TableHead className='text-right font-bold text-gray-700'>
                            24h Volume
                          </TableHead>
                          <TableHead className='text-right font-bold text-gray-700'>
                            Volume %
                          </TableHead>
                          <TableHead className='text-right font-bold text-gray-700'>
                            Spread
                          </TableHead>
                          <TableHead className='text-right font-bold text-gray-700'>
                            Trust Score
                          </TableHead>
                          <TableHead className='text-right font-bold text-gray-700'>
                            Updated
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentTickers.length > 0 ? (
                          currentTickers.map(
                            (ticker: TickerData, index: number) => {
                              const trustInfo = getTrustScoreInfo(
                                ticker.trust_score === 'green'
                                  ? 10
                                  : ticker.trust_score === 'yellow'
                                    ? 5
                                    : 2
                              );
                              const TrustIcon = trustInfo.icon;

                              return (
                                <TableRow
                                  key={`${ticker.base}-${ticker.target}-${index}`}
                                  className='hover:bg-blue-50/50 cursor-pointer transition-colors'
                                  onClick={() => {
                                    if (ticker.trade_url) {
                                      window.open(
                                        ticker.trade_url,
                                        '_blank',
                                        'noopener,noreferrer'
                                      );
                                    }
                                  }}
                                  role='button'
                                  tabIndex={0}
                                  onKeyDown={e => {
                                    if (
                                      (e.key === 'Enter' || e.key === ' ') &&
                                      ticker.trade_url
                                    ) {
                                      e.preventDefault();
                                      window.open(
                                        ticker.trade_url,
                                        '_blank',
                                        'noopener,noreferrer'
                                      );
                                    }
                                  }}
                                >
                                  <TableCell className='font-medium'>
                                    <div className='flex items-center gap-2'>
                                      <div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 overflow-hidden'>
                                        {ticker.base
                                          .substring(0, 2)
                                          .toUpperCase()}
                                      </div>
                                      <div className='flex flex-col'>
                                        <span className='font-bold text-gray-900'>
                                          {ticker.coin_id || ticker.base}
                                        </span>
                                        <span className='text-xs text-gray-500'>
                                          {ticker.name || ticker.base}
                                        </span>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant='outline'
                                      className='font-mono bg-gray-50'
                                    >
                                      {ticker.base}/{ticker.target}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className='text-right font-medium text-gray-900'>
                                    $
                                    {ticker.converted_last.usd.toLocaleString(
                                      undefined,
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 4,
                                      }
                                    )}
                                  </TableCell>
                                  <TableCell className='text-right'>
                                    <div className='flex flex-col items-end'>
                                      <span className='font-medium text-gray-900'>
                                        $
                                        {ticker.converted_volume.usd.toLocaleString(
                                          undefined,
                                          {
                                            maximumFractionDigits: 0,
                                          }
                                        )}
                                      </span>
                                      <span className='text-xs text-gray-500'>
                                        Vol:{' '}
                                        {ticker.volume.toLocaleString(
                                          undefined,
                                          { maximumFractionDigits: 2 }
                                        )}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell className='text-right font-medium text-gray-900'>
                                    {(() => {
                                      // Get total volume with fallback
                                      const totalVolumeBtc =
                                        exchangeDetails.trade_volume_24h_btc_normalized ||
                                        exchangeDetails.trade_volume_24h_btc ||
                                        0;

                                      // Get ticker volume
                                      const tickerVolumeBtc =
                                        ticker.converted_volume?.btc || 0;

                                      // Handle invalid cases
                                      if (
                                        !totalVolumeBtc ||
                                        !tickerVolumeBtc ||
                                        totalVolumeBtc === 0
                                      ) {
                                        return 'N/A';
                                      }

                                      // Calculate percentage
                                      const percentage =
                                        (tickerVolumeBtc / totalVolumeBtc) *
                                        100;

                                      // Handle very small percentages
                                      if (percentage < 0.01 && percentage > 0) {
                                        return '<0.01';
                                      }

                                      // Handle invalid numbers
                                      if (!isFinite(percentage)) {
                                        return 'N/A';
                                      }

                                      return percentage.toFixed(2);
                                    })()}
                                    %
                                  </TableCell>
                                  <TableCell className='text-right font-medium text-gray-900'>
                                    {(
                                      ticker.bid_ask_spread_percentage || 0
                                    ).toFixed(2)}
                                    %
                                  </TableCell>
                                  <TableCell className='text-right'>
                                    <div className='flex items-center justify-end gap-1.5'>
                                      <TrustIcon
                                        className={`w-4 h-4 ${trustInfo.color}`}
                                      />
                                      <span
                                        className={`text-xs font-medium ${trustInfo.color}`}
                                      >
                                        {trustInfo.label}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell className='text-right text-xs text-gray-500'>
                                    {formatDate(ticker.last_fetch_at)
                                      .split(',')[1]
                                      ?.trim() || 'Recently'}
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={8}
                              className='h-24 text-center text-gray-500'
                            >
                              No trading pairs available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className='p-4 border-t border-gray-100'>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(
                        (exchangeDetails.tickers?.length || 0) / pageSize
                      )}
                      pageSize={pageSize}
                      pageSizeOptions={[10, 20, 30, 40, 50]}
                      onPageChange={(newPage: number) =>
                        setCurrentPage(newPage)
                      }
                      onPageSizeChange={(newSize: number) => {
                        setPageSize(newSize);
                        setCurrentPage(0);
                      }}
                      totalItems={exchangeDetails.tickers?.length || 0}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* News Content */}
              <TabsContent value='news'>
                <div className='space-y-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h2 className='text-xl font-bold text-gray-900'>
                        Latest Announcements
                      </h2>
                      <p className='text-gray-500 text-sm mt-1'>
                        Updates from {exchangeDetails.name} team
                      </p>
                    </div>
                  </div>
                  <ExchangeAnnouncements
                    status_updates={exchangeDetails.status_updates}
                    exchangeName={exchangeDetails.name}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* API Partners Section */}
        <div className='mt-12'>
          <LogoClouds />
        </div>
      </div>
    </div>
  );
}

export default CryptoExchangesDetails;
