import { useEffect } from 'react';
import CardLists from '@components/common/CardLists';
import DropdownSelect from '@components/common/DropdownSelect';
import { useDispatch, useSelector } from 'react-redux';

interface NewsArticle {
  title: string;
  url: string;
  image: string;
  source: { name: string };
  publishedAt: string;
  imageurl?: string;
  image_url?: string;
  IMAGE_URL?: string;
  thumbnail?: string;
  thumb?: string;
  photo?: string;
  picture?: string;
  img?: string;
  img_url?: string;
  id?: string;
  guid?: string;
  GUID?: string;
  SOURCE_DATA?: { NAME: string };
  source_info?: { name: string };
  categories?: string;
  tags?: string;
  lang?: string;
  URL?: string;
  TITLE?: string;
  ID?: string;
}

interface CryptoNewsState {
  news: NewsArticle[];
  loading: boolean;
  error: string | null;
}

interface RootState {
  cryptoNews: CryptoNewsState;
}

function CryptoNews() {
  const dispatch = useDispatch();
  const news = useSelector((state: RootState) => state.cryptoNews.news);
  const isLoading = useSelector((state: RootState) => state.cryptoNews.loading);

  const handleExcludeChange = (category: string) => {
    // eslint-disable-next-line no-console
    console.log('Handling category change:', category);
    dispatch({ type: 'FETCH_CRYPTO_NEWS', payload: { category } });
  };

  useEffect(() => {
    dispatch({ type: 'FETCH_CRYPTO_NEWS', payload: { category: 'BTC' } });
  }, []);

  // Transform NewsArticle array to NewsItem array
  const transformedNews = news
    .filter(
      article =>
        article &&
        (article.URL || article.url) &&
        (article.TITLE || article.title)
    )
    .map((article, index) => {
      // Get image URL with fallback
      let imageUrl =
        article.IMAGE_URL ||
        article.image ||
        article.imageurl ||
        article.image_url ||
        '';

      // Ensure image URL is valid
      if (imageUrl && !imageUrl.startsWith('http')) {
        if (imageUrl.startsWith('//')) {
          imageUrl = `https:${imageUrl}`;
        } else if (imageUrl.startsWith('/')) {
          imageUrl = '';
        }
      }

      // Generate stable ID based on article content or index
      const title = article.TITLE || article.title || '';
      const fallbackId = `news-${index}-${title.slice(0, 20).replace(/\s+/g, '-')}`;

      return {
        ID:
          article.URL || article.url || article.ID || article.id || fallbackId,
        TITLE: title,
        IMAGE_URL: imageUrl,
        GUID: article.URL || article.url || article.GUID || article.guid || '',
        SOURCE_DATA: {
          NAME:
            article.SOURCE_DATA?.NAME ||
            article.source?.name ||
            article.source_info?.name ||
            'Unknown Source',
        },
      };
    });

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500' />
      </div>
    );
  }

  return (
    <div className='crypto-news-container z-0'>
      <div className='crypto-news-area pb-20'>
        <div className='w-full mb-2 space-y-4'>
          <div className='w-full'>
            <div className='mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
              <h2 className='text-2xl font-bold mt-10'>Last Crypto News</h2>
              <div className='flex items-center justify-between mt-2'>
                <DropdownSelect onExcludeChange={handleExcludeChange} />
              </div>
            </div>
            <CardLists news={transformedNews} />
          </div>
          <div className='w-full'>{/* 空的區域 */}</div>
        </div>
      </div>
    </div>
  );
}

export default CryptoNews;
