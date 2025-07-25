import HomePageTitle from '@components/layouts/HomePageTitle';
import HomePageCards from '@components/layouts/HomePageCards';
import MediaCard from '@components/common/MediaCard';
import Dashboard from './Crypto-Dashboard';

function Home() {
  return (
    <div className='flex-grow'>
      <div className='grid grid-cols-12 gap-3'>
        <div className='col-span-12 lg:col-span-1 xl:col-span-1' />
        <div className='col-span-12 lg:col-span-10 xl:col-span-10'>
          <HomePageTitle />
          <MediaCard />
          <HomePageCards />
          <Dashboard />
        </div>
        <div className='col-span-12 lg:col-span-1 xl:col-span-1' />
      </div>
    </div>
  );
}

export default Home;
