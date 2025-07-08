import { useMemo, useEffect } from 'react';
import {
  useParams,
  useLocation,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import queryString from 'query-string';

const useRouter = () => {
  const params = useParams();
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);

  return useMemo(
    () => ({
      push: history.push,
      replace: history.replace,
      pathname: location.pathname,
      query: { ...queryString.parse(location.search), ...params },
      match,
      location,
      history,
    }),
    [params, history, match, location]
  );
};

export default useRouter;
