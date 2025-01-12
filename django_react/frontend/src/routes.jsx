import Default from './components/layouts/Default.jsx';
import Home from './views/Home';
import CryptoDetails from './views/Crypto-Details.jsx'
import NFTDashboard from './views/NFT-Dashboard.jsx';
import CryptoNews from './views/Crypto-News';
import NFTDetails from './views/NFT-Details.jsx';
import NotFound from './views/NotFound.jsx';

const routes = [
  {
    path: '/',
    exact: true,
    layout: Default,
    component: Home,
  },
  {
    path: "/Crypto-details/:coinId",
    exact: true,
    layout: Default,
    component: CryptoDetails,
  },
  {
    path: "/NFTDashboard",
    exact: true,
    layout: Default,
    component: NFTDashboard,
  },
  {
    path: "/NFT-details/:name",
    exact: true,
    layout: Default,
    component: NFTDetails,
  },
  {
    path: "/CryptoNews",
    exact: true,
    layout: Default,
    component: CryptoNews,
  },
  {
    path: "/NotFound",
    exact: true,
    layout: Default,
    component: NotFound,
  },
]

export default routes;