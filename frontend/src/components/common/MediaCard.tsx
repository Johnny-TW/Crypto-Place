import React from 'react';
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

interface MediaCardProps {
  newsData?: NewsItem[];
}

function MediaCard({ newsData = [] }: MediaCardProps) {
  if (!newsData || newsData.length === 0) {
    return null;
  }

  return (
    <div className='mt-20 px-4 md:px-12'>
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
          {newsData.map(news => (
            <CarouselItem
              key={news.ID}
              className='pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4'
            >
              <div className='bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col'>
                <img
                  src={news.IMAGE_URL}
                  alt={news.TITLE}
                  className='w-full h-40 object-cover'
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src =
                      'https://via.placeholder.com/300x140?text=No+Image';
                  }}
                />
                <div className='p-4 flex-grow flex flex-col'>
                  <h3 className='text-base font-semibold mb-2 text-gray-900 line-clamp-2'>
                    {news.TITLE || 'Untitled'}
                  </h3>
                  <p className='text-sm text-gray-600 mb-4 flex-grow line-clamp-3'>
                    {news.BODY || 'No description available'}
                  </p>
                  <Button
                    asChild
                    size='sm'
                    className='w-full bg-indigo-600 hover:bg-indigo-700'
                  >
                    <a
                      href={news.URL}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Learn More
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

export default MediaCard;
