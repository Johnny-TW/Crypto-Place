import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Typography } from '@mui/material';

function CryptoNews(): JSX.Element {
  return (
    <div className='crypto-news-container z-0'>
      <div className='crypto-news-area mb-3'>
        <div className='flex justify-center'>
          <Typography
            variant='h5'
            fontWeight='bold'
            gutterBottom
            className='text-center font-bold'
          >
            Crypto Latest News
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default CryptoNews;
