import * as React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Breadcrumb from '@components/common/Breadcrumbs';
import LogoCloudsCryptoApi from '@components/common/LogoCloudsCryptoApi';

function CryptoExchangesDetails() {
  return (
    <div className="overflow-hidden py-20 sm:py-10">
      <div className="mx-auto max-w-1xl lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="">
            <Breadcrumb />
          </div>
        </div>
        <LogoCloudsCryptoApi />
      </div>
    </div>
  );
}

export default CryptoExchangesDetails;
