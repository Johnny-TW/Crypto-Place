import HomePageTitle from '@components/layouts/HomePageTitle';
import MediaCard from '@components/common/MediaCard';
import Dashboard from './Crypto-Dashboard';

function Home() {
  return (
    <div className='flex-grow'>
      <div className='grid grid-cols-12 gap-3'>
        <div className='col-span-12 lg:col-span-12 xl:col-span-12'>
          <HomePageTitle />
          <MediaCard />
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default Home;
