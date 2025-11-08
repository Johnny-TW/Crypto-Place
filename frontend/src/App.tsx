import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { DialogProvider } from '@components/layouts';
import ProtectedRoute from '@components/common/ProtectedRoute';
import LoginRedirect from '@components/common/LoginRedirect';
import type { RouteConfig } from './types/routes';
import store from './redux/store';
import routes from './routes';

function AppContent(): JSX.Element {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'CHECK_AUTH_STATUS' });
  }, []);

  return (
    <Router>
      <DialogProvider>
        <Routes>
          {routes.map((route: RouteConfig, index: number) => {
            const Layout = route.layout;
            const Component = route.component;

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    {(() => {
                      if (route.protected) {
                        return (
                          <ProtectedRoute>
                            <Component />
                          </ProtectedRoute>
                        );
                      }
                      if (route.redirectIfAuthenticated) {
                        return (
                          <LoginRedirect>
                            <Component />
                          </LoginRedirect>
                        );
                      }
                      return <Component />;
                    })()}
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </DialogProvider>
    </Router>
  );
}

function App(): JSX.Element {
  return (
    <ReduxProvider store={store}>
      <AppContent />
    </ReduxProvider>
  );
}

export default App;
