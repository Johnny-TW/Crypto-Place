import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function AutoPlay({ news, isLoading }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

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
    <div className='slider-container mb-20'>
      <Slider {...settings}>
        {news.map(item => (
          <div key={item.ID} className='p-2'>
            <div className='bg-white border border-gray-300 rounded-lg p-4 h-120 flex flex-col justify-between'>
              <img
                src={item.IMAGE_URL}
                alt={item.TITLE}
                className='w-full h-32 object-cover rounded-t-lg'
                onError={e => {
                  const { target } = e;
                  target.onerror = null;
                  target.src = 'default-image-url';
                }}
              />
              <div className='flex-grow'>
                <h3 className='text-lg font-bold mt-2 mb-1 text-gray-700'>
                  {item.TITLE}
                </h3>
                <p className='text-gray-600 text-xs mb-2'>
                  {item.BODY.length > 100
                    ? `${item.BODY.substring(0, 100)}...`
                    : item.BODY}
                </p>
              </div>
              <a
                href={item.URL}
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-500 hover:text-gray-700 text-sm'
              >
                Read More
              </a>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default AutoPlay;
