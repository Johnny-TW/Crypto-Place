import { useNavigate } from 'react-router-dom';
import { Button } from '@components/ui/button';

function ServerError() {
  const navigate = useNavigate();

  return (
    <main className='grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
      <div className='text-center'>
        <p className='text-base font-semibold text-rose-600'>500</p>
        <h1 className='mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl'>
          Server Error
        </h1>
        <p className='mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8'>
          Sorry, something went wrong on our server. Please try again later.
        </p>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <Button
            onClick={() => navigate('/')}
            className='rounded-md bg-rose-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-rose-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600'
          >
            Go back home
          </Button>
          <Button
            variant='ghost'
            onClick={() => window.location.reload()}
            className='text-sm font-semibold text-gray-900'
          >
            Reload page <span aria-hidden='true'>&rarr;</span>
          </Button>
        </div>
      </div>
    </main>
  );
}

export default ServerError;
