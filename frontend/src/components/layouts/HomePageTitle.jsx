import tradeCrypto from '../../images/svg/ENBG_favicon.svg';
import '../../styles/layouts/HomePageTitle.scss';

function HomePageTitle() {
  return (
    <header className='Header'>
      <img
        className='mx-auto w-full sm:w-2/3 md:w-2/3 lg:w-2/3 xl:w-1/2'
        src={tradeCrypto}
        alt='Stylized atom'
      />
      <h1 className='text-6xl font-bold mt-10'>Crypto Coin</h1>
      <p className='text-gray-900 mt-5'>
        Crypto Coin is the leading data platform for real-time cryptocurrency
        prices and market trends
        <br />
        Empowering investors with accurate and up-to-date blockchain data.
      </p>
    </header>
  );
}

export default HomePageTitle;
