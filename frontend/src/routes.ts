import Home from './views/Home';
import Default from './components/layouts/Default';
import AuthLayout from './components/layouts/AuthLayout';
import CryptoDetails from './views/Crypto-Details';
import NFTDashboard from './views/NFT-Dashboard';
import CryptoNews from './views/Crypto-News';
import NFTDetails from './views/NFT-Details';
import CryptoExchanges from './views/Crypto-Exchanges';
import CryptoExchangesDetails from './views/Crypto-Exchanges-Details';
import CryptoAPI from './views/Crypto-api';
import NotFound from './views/NotFound';
import ServerError from './views/ServerError';
import Login from './views/Login';
import Register from './views/Register';
import AzureAdCallback from './views/AzureAdCallback';
import type { Routes } from './types/routes';

const routes: Routes = [
  {
    path: '/',
    layout: AuthLayout,
    component: Login,
    redirectIfAuthenticated: true,
  },
  {
    path: '/login',
    layout: AuthLayout,
    component: Login,
    redirectIfAuthenticated: true,
  },
  {
    path: '/register',
    layout: AuthLayout,
    component: Register,
    redirectIfAuthenticated: true,
  },
  {
    path: '/auth/azure/callback',
    layout: AuthLayout,
    component: AzureAdCallback,
  },
  {
    path: '/dashboard',
    layout: Default,
    component: Home,
    protected: true,
  },
  {
    path: '/home',
    layout: Default,
    component: Home,
    protected: true,
  },
  {
    path: '/Crypto-details/:coinId',
    layout: Default,
    component: CryptoDetails,
    protected: true,
  },
  {
    path: '/NFTDashboard',
    layout: Default,
    component: NFTDashboard,
    protected: true,
  },
  {
    path: '/NFT-details/:name',
    layout: Default,
    component: NFTDetails,
    protected: true,
  },
  {
    path: '/CryptoNews',
    layout: Default,
    component: CryptoNews,
    protected: true,
  },
  {
    path: '/exchanges',
    layout: Default,
    component: CryptoExchanges,
    protected: true,
  },
  {
    path: '/exchanges-details/:exchangeId',
    layout: Default,
    component: CryptoExchangesDetails,
    protected: true,
  },
  {
    path: '/api',
    layout: Default,
    component: CryptoAPI,
    protected: true,
  },
  {
    path: '/NotFound',
    layout: Default,
    component: NotFound,
  },
  {
    path: '/500',
    layout: Default,
    component: ServerError,
  },
];

export default routes;
