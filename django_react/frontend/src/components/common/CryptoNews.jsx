import * as React from 'react';
import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function CryptoNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const baseUrl = 'https://data-api.cryptocompare.com/news/v1/article/list';
    const params = {
      lang: 'EN',
      limit: 10,
      exclude_categories: 'ETH',
      api_key: 'b1b0f1cbc762734d6003ea2af861dadecdd20ed39e717d8b4a15bf351640488b',
    };
    const url = new URL(baseUrl);
    url.search = new URLSearchParams(params).toString();

    const options = {
      method: 'GET',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
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

  // console.log(news);

  return (
    <div className="crypto-news-container z-0">
      <div className="crypto-news-area mb-20">
        <div className="flex justify-center">
          <h2 className="text-3xl font-bold">Crypto Latest News</h2>
        </div>
        <Slider {...settings}>
          {news.map((item, index) => (
            <div key={index} className="p-4">
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <img
                      src={item.IMAGE_URL}
                      alt={item.TITLE}
                      className="w-48 h-auto rounded-lg"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'default-image-url'; }}
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h2 className="text-blue-600 font-bold text-xl">{item.TITLE}</h2>
                    <p className="text-gray-700 text-justify text-sm mt-3">
                      {item.BODY.length > 250 ? `${item.BODY.substring(0, 250)}...` : item.BODY}
                    </p>
                    <div className="mt-4">
                      <a
                        href={item.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                      >
                        Read More News
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default CryptoNews;
