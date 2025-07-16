/* eslint-disable react/no-array-index-key */
import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
// import { MatomoProvider } from '@hooks/use-matomo';
import store from './redux/store';
import routes from './routes';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginRedirect from './components/common/LoginRedirect';
import { checkAuthStatus } from './redux/saga/auth';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <ReduxProvider store={store}>
      <Router path='/'>
        <Switch>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} exact={route.exact}>
              <route.layout>
                {(() => {
                  if (route.protected) {
                    return (
                      <ProtectedRoute>
                        <route.component />
                      </ProtectedRoute>
                    );
                  }
                  if (route.redirectIfAuthenticated) {
                    return (
                      <LoginRedirect>
                        <route.component />
                      </LoginRedirect>
                    );
                  }
                  return <route.component />;
                })()}
              </route.layout>
            </Route>
          ))}
        </Switch>
      </Router>
      {/* <MatomoProvider> */}
    </ReduxProvider>
  );
}

function App() {
  return (
    <ReduxProvider store={store}>
      <AppContent />
    </ReduxProvider>
  );
}

export default App;
