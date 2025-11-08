import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import Autoplay from 'embla-carousel-autoplay';

interface NewsItem {
  ID: string;
  IMAGE_URL: string;
  TITLE: string;
  BODY: string;
  URL: string;
}

interface AutoPlayProps {
  news: NewsItem[];
  isLoading: boolean;
}

function AutoPlay({ news, isLoading }: AutoPlayProps) {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500' />
      </div>
    );
  }

  if (!news || news.length === 0) {
    return <div>No news available</div>;
  }

  return (
    <div className='mb-20 px-4 md:px-12'>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className='w-full'
      >
        <CarouselContent className='-ml-2 md:-ml-4'>
          {news.map((item: NewsItem) => (
            <CarouselItem
              key={item.ID}
              className='pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3'
            >
              <div className='bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col'>
                <img
                  src={item.IMAGE_URL}
                  alt={item.TITLE}
                  className='w-full h-64 object-cover'
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'default-image-url';
                  }}
                />
                <div className='p-4 flex-grow flex flex-col'>
                  <h3 className='text-lg font-bold mb-2 text-gray-700 line-clamp-2'>
                    {item.TITLE}
                  </h3>
                  <p className='text-gray-600 text-sm mb-4 flex-grow line-clamp-3'>
                    {item.BODY}
                  </p>
                  <Button
                    asChild
                    className='w-full bg-indigo-600 hover:bg-indigo-700'
                  >
                    <a
                      href={item.URL}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Read More
                    </a>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='left-0 md:-left-12' />
        <CarouselNext className='right-0 md:-right-12' />
      </Carousel>
    </div>
  );
}

export default AutoPlay;
