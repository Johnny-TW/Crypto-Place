import { LogoCloudsCryptoApi } from '@components/shared/branding';

function CryptoApi(): JSX.Element {
  return (
    <div className='overflow-hidden py-20 sm:py-10'>
      <div className='mx-auto max-w-1xl'>
        <div className='mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2' />
        <LogoCloudsCryptoApi />
      </div>
    </div>
  );
}

export default CryptoApi;
