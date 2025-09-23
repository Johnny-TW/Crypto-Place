// PNG Images
import error404 from './png/404_error.png';
import cryptoCoinLogo from './png/crypto_coin_logo.png';
import dashboard1 from './png/dashboard_1.jpg';
import dashboard2 from './png/dashboard_2.png';
import refresh from './png/refresh.png';

// SVG Images
import enbgFavicon from './svg/ENBG_favicon.svg';
import enbgLogo from './svg/ENBG_logo.svg';

// PNG Exports
export const pngImages = {
  error404,
  cryptoCoinLogo,
  dashboard1,
  dashboard2,
  refresh,
};

// SVG Exports
export const svgImages = {
  enbgFavicon,
  enbgLogo,
};

// All Images Export
export const images = {
  ...pngImages,
  ...svgImages,
};

// Individual Exports for convenience
export {
  error404,
  cryptoCoinLogo,
  dashboard1,
  dashboard2,
  refresh,
  enbgFavicon,
  enbgLogo,
};

// Default export
export default images;
