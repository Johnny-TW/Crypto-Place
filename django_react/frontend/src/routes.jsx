import Default from './components/layouts/Default.jsx';
import Home from './views/Home';
import CryptoDetails from './views/Crypto-Details.jsx'
import NFTDashboard from './views/NFT-Dashboard.jsx';
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
    path: "/NFTDashboard",
    exact: true,
    layout: Default,
    component: NFTDashboard,
  },
  {
    path: "/Crypto-details/:coinId",
    exact: true,
    layout: Default,
    component: CryptoDetails,
  },
  {
    path: "/NFT-details/:name",
    exact: true,
    layout: Default,
    component: NFTDetails,
  },
  {
    path: "/NotFound",
    exact: true,
    layout: Default,
    component: NotFound,
  },
]

export default routes