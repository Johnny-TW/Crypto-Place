import React from 'react';

interface MarketCapData {
  native_currency?: number;
  usd?: number;
}

interface VolumeData {
  native_currency?: number;
  usd?: number;
}

interface AthData {
  native_currency?: number;
  usd?: number;
}

interface AthChangePercentageData {
  native_currency?: number;
  usd?: number;
}

interface AthDateData {
  native_currency?: string;
  usd?: string;
}

interface VolumeChangeData {
  native_currency?: number;
  usd?: number;
}

interface NFTData {
  market_cap?: MarketCapData;
  volume_24h?: VolumeData;
  one_day_sales?: number;
  one_day_average_sale_price?: number;
  one_day_sales_24h_percentage_change?: number;
  number_of_unique_addresses?: number;
  number_of_unique_addresses_24h_percentage_change?: number;
  total_supply?: number;
  ath?: AthData;
  ath_change_percentage?: AthChangePercentageData;
  ath_date?: AthDateData;
  volume_24h_percentage_change?: VolumeChangeData;
  native_currency_symbol?: string;
  contract_address?: string;
  asset_platform_id?: string;
}

interface NFTInfoSectionProps {
  nftData: NFTData | null;
}

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

const NFTInfoSection: React.FC<NFTInfoSectionProps> = ({ nftData }) => {
  const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
    return (
      <div className='px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
        <dt className='text-sm/6 font-semibold text-gray-900'>{label}</dt>
        <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
          {value}
        </dd>
      </div>
    );
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper function to format percentage
  const formatPercentage = (value?: number, showSign = true) => {
    if (value === undefined || value === null) return 'N/A';
    const sign = showSign && value > 0 ? '+' : '';
    const color = value >= 0 ? 'text-green-600' : 'text-red-600';
    return <span className={color}>{`${sign}${value.toFixed(2)}%`}</span>;
  };

  // Helper function to copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Shorten contract address
  const shortenAddress = (address?: string) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const volumeChange = nftData?.volume_24h_percentage_change?.native_currency;
  const salesChange = nftData?.one_day_sales_24h_percentage_change;
  const ownersChange =
    nftData?.number_of_unique_addresses_24h_percentage_change;

  return (
    <div>
      {/* Market Statistics */}
      <div className='px-4 sm:px-0 mt-5'>
        <h3 className='text-base/7 font-semibold text-gray-900'>
          Market Statistics
        </h3>
        <p className='mt-1 max-w-2xl text-sm/6 text-gray-500'>
          Real-time market data and trading information
        </p>
      </div>
      <div className='mt-6 border-t border-gray-300'>
        <dl className='divide-y divide-gray-300'>
          <InfoRow
            label='Market Cap'
            value={
              <div>
                <div>
                  {nftData?.market_cap?.native_currency?.toLocaleString() || 0}{' '}
                  {nftData?.native_currency_symbol || ''}
                </div>
                {nftData?.market_cap?.usd ? (
                  <div className='text-xs text-gray-500'>
                    ${nftData.market_cap.usd.toLocaleString()}
                  </div>
                ) : null}
              </div>
            }
          />
          <InfoRow
            label='24h Volume'
            value={
              <div>
                <div className='flex items-center gap-2'>
                  <span>
                    {nftData?.volume_24h?.native_currency?.toLocaleString() ||
                      0}{' '}
                    {nftData?.native_currency_symbol || ''}
                  </span>
                  {volumeChange !== undefined &&
                  volumeChange !== null &&
                  Math.abs(volumeChange) > 50 ? (
                    <span className='text-xs text-red-600 font-semibold'>
                      ⚠️ {formatPercentage(volumeChange)}
                    </span>
                  ) : (
                    formatPercentage(volumeChange)
                  )}
                </div>
                {nftData?.volume_24h?.usd ? (
                  <div className='text-xs text-gray-500'>
                    ${nftData.volume_24h.usd.toLocaleString()}
                  </div>
                ) : null}
              </div>
            }
          />
          <InfoRow
            label='24h Sales'
            value={
              <div className='flex items-center gap-2'>
                <span>{nftData?.one_day_sales || 0} sales</span>
                {salesChange ? formatPercentage(salesChange) : null}
              </div>
            }
          />
          <InfoRow
            label='24h Avg Price'
            value={`${nftData?.one_day_average_sale_price?.toFixed(2) || 0} ${nftData?.native_currency_symbol || ''}`}
          />
          <InfoRow
            label='Unique Owners'
            value={
              <div className='flex items-center gap-2'>
                <span>
                  {nftData?.number_of_unique_addresses?.toLocaleString() || 0}
                </span>
                {ownersChange !== undefined && ownersChange !== 0
                  ? formatPercentage(ownersChange)
                  : null}
              </div>
            }
          />
          <InfoRow
            label='Total Supply'
            value={nftData?.total_supply?.toLocaleString() || 0}
          />
        </dl>
      </div>

      {/* All-Time High Section */}
      <div className='px-4 sm:px-0 mt-8'>
        <h3 className='text-base/7 font-semibold text-gray-900'>
          All-Time High (ATH)
        </h3>
        <p className='mt-1 max-w-2xl text-sm/6 text-gray-500'>
          Historical peak price information
        </p>
      </div>
      <div className='mt-6 border-t border-gray-300'>
        <dl className='divide-y divide-gray-300'>
          <InfoRow
            label='ATH Price'
            value={
              <div>
                <div>
                  {nftData?.ath?.native_currency || 0}{' '}
                  {nftData?.native_currency_symbol || ''}
                </div>
                {nftData?.ath?.usd ? (
                  <div className='text-xs text-gray-500'>
                    ${nftData.ath.usd.toLocaleString()}
                  </div>
                ) : null}
              </div>
            }
          />
          <InfoRow
            label='ATH Date'
            value={formatDate(nftData?.ath_date?.native_currency)}
          />
          <InfoRow
            label='From ATH'
            value={
              <div className='flex items-center gap-3'>
                <span>
                  {formatPercentage(
                    nftData?.ath_change_percentage?.native_currency,
                    true
                  )}
                </span>
                {nftData?.ath_change_percentage?.native_currency ? (
                  <div className='flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]'>
                    <div
                      className='bg-red-500 h-2 rounded-full'
                      style={{
                        width: `${Math.abs(nftData.ath_change_percentage.native_currency)}%`,
                      }}
                    />
                  </div>
                ) : null}
              </div>
            }
          />
        </dl>
      </div>

      {/* Contract Information */}
      {nftData?.contract_address ? (
        <>
          <div className='px-4 sm:px-0 mt-8'>
            <h3 className='text-base/7 font-semibold text-gray-900'>
              Contract Information
            </h3>
            <p className='mt-1 max-w-2xl text-sm/6 text-gray-500'>
              Blockchain and smart contract details
            </p>
          </div>
          <div className='mt-6 border-t border-gray-300'>
            <dl className='divide-y divide-gray-300'>
              <InfoRow
                label='Blockchain'
                value={
                  <span className='capitalize'>
                    {nftData?.asset_platform_id || 'Unknown'}
                  </span>
                }
              />
              <InfoRow
                label='Contract Address'
                value={
                  <div className='flex items-center gap-2'>
                    <code className='text-xs bg-gray-100 px-2 py-1 rounded'>
                      {shortenAddress(nftData?.contract_address)}
                    </code>
                    <button
                      type='button'
                      onClick={() =>
                        copyToClipboard(nftData?.contract_address || '')
                      }
                      className='text-xs text-blue-600 hover:text-blue-700 font-medium'
                    >
                      Copy
                    </button>
                  </div>
                }
              />
            </dl>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default NFTInfoSection;
