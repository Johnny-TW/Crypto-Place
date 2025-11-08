import { useMemo, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';

const useRouter = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);

  return useMemo(
    () => ({
      navigate,
      pathname: location.pathname,
      query: {
        ...queryString.parse(location.search),
        ...queryString.parse(location.hash),
        ...params,
      },
      location,
    }),
    [params, navigate, location]
  );
};

export default useRouter;
