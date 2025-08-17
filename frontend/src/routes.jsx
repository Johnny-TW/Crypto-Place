import Home from './views/Home';
import Default from './components/layouts/Default';
import CryptoDetails from './views/Crypto-Details';
import NFTDashboard from './views/NFT-Dashboard';
import CryptoNews from './views/Crypto-News';
import NFTDetails from './views/NFT-Details';
import CryptoExchanges from './views/Crypto-Exchanges';
import CryptoExchangesDetails from './views/Crypto-Exchanges-Details';
import CryptoAPI from './views/Crypto-api';
import NotFound from './views/NotFound';
import Login from './views/Login';
import Register from './views/Register';

const routes = [
  {
    path: '/',
    exact: true,
    layout: Default,
    component: Login,
    redirectIfAuthenticated: true,
  },
  {
    path: '/login',
    exact: true,
    layout: Default,
    component: Login,
    redirectIfAuthenticated: true,
  },
  {
    path: '/register',
    exact: true,
    layout: Default,
    component: Register,
    redirectIfAuthenticated: true,
  },
  {
    path: '/dashboard',
    exact: true,
    layout: Default,
    component: Home,
    protected: true,
  },
  {
    path: '/home',
    exact: true,
    layout: Default,
    component: Home,
    protected: true,
  },
  {
    path: '/Crypto-details/:coinId',
    exact: true,
    layout: Default,
    component: CryptoDetails,
    protected: true,
  },
  {
    path: '/NFTDashboard',
    exact: true,
    layout: Default,
    component: NFTDashboard,
    protected: true,
  },
  {
    path: '/NFT-details/:name',
    exact: true,
    layout: Default,
    component: NFTDetails,
    protected: true,
  },
  {
    path: '/CryptoNews',
    exact: true,
    layout: Default,
    component: CryptoNews,
    protected: true,
  },
  {
    path: '/exchanges',
    exact: true,
    layout: Default,
    component: CryptoExchanges,
    protected: true,
  },
  {
    path: '/exchanges-details/:exchangeId',
    exact: true,
    layout: Default,
    component: CryptoExchangesDetails,
    protected: true,
  },
  {
    path: '/api',
    exact: true,
    layout: Default,
    component: CryptoAPI,
    protected: true,
  },
  {
    path: '/NotFound',
    exact: true,
    layout: Default,
    component: NotFound,
  },
];

export default routes;
