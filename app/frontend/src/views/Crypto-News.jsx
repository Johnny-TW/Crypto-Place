import * as React from 'react';
import { useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// Components
import CardLists from '@components/common/CardLists';
import Breadcrumb from '@components/common/Breadcrumbs';
import DropdownSelect from '@components/common/DropdownSelect';
import { fetchCryptoNews } from '@redux/saga/cryptoNews';
import { useDispatch, useSelector } from 'react-redux';

function CryptoNews() {
  const dispatch = useDispatch();
  const news = useSelector((state) => state.cryptoNews.news);
  const isLoading = useSelector((state) => state.cryptoNews.loading);

  const handleExcludeChange = (category) => {
    console.log('Handling category change:', category);
    dispatch(fetchCryptoNews(category));
  };

  useEffect(() => {
    dispatch(fetchCryptoNews('BTC'));
  }, [dispatch]);

  console.log(news);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="crypto-news-container z-0">
      <div className="crypto-news-area pb-20">
        <div className="w-full mb-2 space-y-4">
          <div className="w-full">
            {/* 空的區域 */}
          </div>
          <div className="w-full">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
              <h2 className="text-2xl font-bold mt-10">Last Crypto News</h2>
              <div className="flex items-center justify-between mt-2">
                <Breadcrumb />
                <DropdownSelect onExcludeChange={handleExcludeChange} />
              </div>
            </div>
            <CardLists news={news} />
            {' '}
            {/* 傳遞 news 資料給 CardLists 元件 */}
          </div>
          <div className="w-full">
            {/* 空的區域 */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CryptoNews;
