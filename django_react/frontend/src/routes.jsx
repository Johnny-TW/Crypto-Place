import Home from './views/Home';
import Default from './components/layouts/Default';
import CryptoDetails from './views/Crypto-Details';
import NFTDashboard from './views/NFT-Dashboard';
import CryptoNews from './views/Crypto-News';
import NFTDetails from './views/NFT-Details';
import CryptoExchanges from './views/Crypto-Exchanges';
import CryptoExchangesDetails from './views/Crypto-Exchanges-Details';
import NotFound from './views/NotFound';

const routes = [
  {
    path: '/',
    exact: true,
    layout: Default,
    component: Home,
  },
  {
    path: '/Crypto-details/:coinId',
    exact: true,
    layout: Default,
    component: CryptoDetails,
  },
  {
    path: '/NFTDashboard',
    exact: true,
    layout: Default,
    component: NFTDashboard,
  },
  {
    path: '/NFT-details/:name',
    exact: true,
    layout: Default,
    component: NFTDetails,
  },
  {
    path: '/CryptoNews',
    exact: true,
    layout: Default,
    component: CryptoNews,
  },
  {
    path: '/exchanges',
    exact: true,
    layout: Default,
    component: CryptoExchanges,
  },
  {
    path: '/exchanges-details/:exchangeId',
    exact: true,
    layout: Default,
    component: CryptoExchangesDetails,
  },
  {
    path: '/api',
    exact: true,
    layout: Default,
    component: CryptoExchangesDetails,
  },
  {
    path: '/NotFound',
    exact: true,
    layout: Default,
    component: NotFound,
  },
];

export default routes;
