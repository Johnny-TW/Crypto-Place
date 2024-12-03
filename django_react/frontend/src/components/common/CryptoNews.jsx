import * as React from 'react';
import { useState, useEffect } from 'react';
import { Paper, Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function CryptoNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const baseUrl = 'https://data-api.cryptocompare.com/news/v1/article/list';
    const params = {
      "lang": "EN",
      "limit": 10,
      "exclude_categories": "ETH",
      "api_key": "b1b0f1cbc762734d6003ea2af861dadecdd20ed39e717d8b4a15bf351640488b"
    };
    const url = new URL(baseUrl);
    url.search = new URLSearchParams(params).toString();

    const options = {
      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((json) => setNews(json.Data))
      .catch((err) => console.log(err));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  console.log(news)

  return (
    <>
      <div className="crypto-news-container z-0">
        <div className="crypto-news-area pb-20">
          <Grid className="mb-2" container spacing={2} alignItems="center">
            <Grid item xs={3}>
              {/* 空的區域 */}
            </Grid>
            <Grid item xs={6}>
              <h2 className="text-3xl text-center font-bold">Crypto Latest News</h2>
            </Grid>
            <Grid item xs={3}>
              {/* 空的區域 */}
            </Grid>
          </Grid>
          <Slider {...settings}>
            {news.map((item, index) => (
              <div key={index}>
                <Paper elevation={3} sx={{ padding: 4, margin: 2 }}>
                  <Grid container spacing={2}>
                    <Grid className="justify-items-center" item xs={3}>
                      <img
                        src={item.IMAGE_URL}
                        alt={item.TITLE}
                        style={{ width: '200px', height: 'auto' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'default-image-url'; }}
                      />
                    </Grid>
                    <Grid className="justify-items-center" item xs={9}>
                      <h2 className='text-blue-600 font-bold text-xl font-sans'>{item.TITLE}</h2>
                      <p className='text-gray-700 text-justify text-sm mt-3 '>
                        {item.BODY.length > 250 ? `${item.BODY.substring(0, 250)}...` : item.BODY}
                      </p>
                      <div style={{ marginTop: '20px' }}>
                        <Button
                          className="mt-10"
                          variant="outlined"
                          href={item.URL}
                          target="_blank">Read More News
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </Paper>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
}

export default CryptoNews;