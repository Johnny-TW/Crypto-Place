import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  MatomoProvider as Provider,
  createInstance,
  useMatomo,
} from '@datapunt/matomo-tracker-react';

import useRouter from './use-router';

function MatomoProvider({ children }) {
  const { user } = useSelector(state => state.auth);
  // urlBase及siteId於env管理
  const instance =
    !import.meta.env.VITE_MATOMO_URL_BASE ||
    !import.meta.env.VITE_MATOMO_SITE_ID
      ? null
      : createInstance({
          urlBase: import.meta.env.VITE_MATOMO_URL_BASE,
          siteId: import.meta.env.VITE_MATOMO_SITE_ID,
          userId: undefined, // optional, default value: `undefined`.
        });

  useEffect(() => {
    if (!user) return;
    // 使用者登入成功 於matomo紀錄使用者id及名稱
    // setCustomDimension為自定義參數用法
    instance?.pushInstruction('setUserId', user?.wee.emplId);
    instance?.pushInstruction('setCustomDimension', 1, user?.wee.enName);
    instance?.pushInstruction('setCustomDimension', 2, user?.wee.emplId);
  }, [user, instance]);

  return !import.meta.env.VITE_MATOMO_URL_BASE ||
    !import.meta.env.VITE_MATOMO_SITE_ID ? (
    <div>{children}</div>
  ) : (
    <Provider value={instance}>{children}</Provider>
  );
}

const useMatomoTrack = () => {
  const { trackPageView } = useMatomo();
  const { pathname } = useRouter();
  const { user } = useSelector(state => state.auth);

  // SPA需要自行處理觸發時機
  // 監聽使用者及路徑，只要路徑變更即傳送網頁瀏覽事件
  useEffect(() => {
    if (
      !user ||
      !import.meta.env.VITE_MATOMO_URL_BASE ||
      !import.meta.env.VITE_MATOMO_SITE_ID
    )
      return;
    trackPageView();
  }, [pathname, user, trackPageView]);
};

export { MatomoProvider };
export default useMatomoTrack;
