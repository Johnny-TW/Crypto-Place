function NFTInfoSection({ nftData }) {
  function InfoRow({ label, value }) {
    return (
      <div className='px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
        <dt className='text-sm/6 font-semibold text-gray-900'>{label}</dt>
        <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
          {value}
        </dd>
      </div>
    );
  }

  return (
    <div>
      <div className='px-4 sm:px-0 mt-5'>
        <h3 className='text-base/7 font-semibold text-gray-900'>
          Applicant Information
        </h3>
        <p className='mt-1 max-w-2xl text-sm/6 text-gray-500'>
          Personal details and application.
        </p>
      </div>
      <div className='mt-6 border-t border-gray-300'>
        <dl className='divide-y divide-gray-300'>
          <InfoRow
            label='Market Cap'
            value={`${nftData?.market_cap?.native_currency || 0} ${nftData?.native_currency_symbol || ''}`}
          />
          <InfoRow
            label='24h Volume'
            value={`${nftData?.volume_24h?.native_currency || 0} ${nftData?.native_currency_symbol || ''}`}
          />
          <InfoRow
            label='24h Sales'
            value={`${nftData?.one_day_sales || 0} ${nftData?.native_currency_symbol || ''}`}
          />
          <InfoRow
            label='24h Average Sale Price'
            value={nftData?.one_day_average_sale_price || 0}
          />
          <InfoRow
            label='Unique Owners'
            value={nftData?.number_of_unique_addresses || 0}
          />
          <InfoRow label='Total Assets' value={nftData?.total_supply || 0} />
          <InfoRow
            label='All-Time High'
            value={`${nftData?.ath?.native_currency || 0} ${nftData?.native_currency_symbol || ''}`}
          />
        </dl>
      </div>
    </div>
  );
}

export default NFTInfoSection;
