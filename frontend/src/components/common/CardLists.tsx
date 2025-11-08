import React, { useState } from 'react';

interface NewsItem {
  ID: string;
  TITLE: string;
  IMAGE_URL: string;
  GUID: string;
  SOURCE_DATA: {
    NAME: string;
  };
}

interface CardListsProps {
  news: NewsItem[];
}

function CardLists({ news }: CardListsProps): React.ReactElement {
  // 默認佔位符圖片
  const defaultImage =
    'https://via.placeholder.com/400x300/f3f4f6/6b7280?text=Crypto+News';

  function ImageWithFallback({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className: string;
  }) {
    const [imgSrc, setImgSrc] = useState(src || defaultImage);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
      if (!hasError) {
        setHasError(true);
        setImgSrc(defaultImage);
        setIsLoading(false);

        console.error('❌ Image failed to load:', src);
        // eslint-disable-next-line no-console
        console.log('🔄 Switching to fallback image:', defaultImage);
      }
    };

    const handleLoad = () => {
      setIsLoading(false);
    };

    return (
      <div className='relative'>
        {isLoading ? (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50'>
            <span className='text-gray-500'>Loading...</span>
          </div>
        ) : null}
        <img
          alt={alt}
          src={imgSrc}
          className={className}
          onError={handleError}
          onLoad={handleLoad}
          loading='lazy'
        />
      </div>
    );
  }

  return (
    <div className='CardLists_Area'>
      <div className='mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8'>
        <div className='mt-3 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8'>
          {news.map(data => {
            return (
              <div key={data.ID} className='group relative'>
                <ImageWithFallback
                  src={data.IMAGE_URL}
                  alt={data.TITLE}
                  className='aspect-square w-full rounded-md border object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80'
                />
                <div className='mt-4 flex justify-between'>
                  <div>
                    <p className='mb-1 font-bold text-gray-900 dark:text-moon-50 text-lg md:text-xl leading-7'>
                      {data.SOURCE_DATA.NAME}
                    </p>
                    <h3 className='text-sm text-gray-700'>
                      <a
                        href={data.GUID}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <span aria-hidden='true' className='absolute inset-0' />
                        {data.TITLE}
                      </a>
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CardLists;
