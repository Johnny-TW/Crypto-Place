/* eslint-disable react/no-array-index-key */
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { DialogProvider } from '@components/layouts';
import store from './redux/store';
import routes from './routes';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginRedirect from './components/common/LoginRedirect';
// import { MatomoProvider } from '@hooks/use-matomo';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 將 dispatch 設置為全局可訪問，供 axios 攔截器使用
    // eslint-disable-next-line no-underscore-dangle
    window.__APP_DISPATCH__ = dispatch;

    // 清理函數
    return () => {
      // eslint-disable-next-line no-underscore-dangle
      delete window.__APP_DISPATCH__;
    };
  }, [dispatch]);

  return (
    <Router path='/'>
      <DialogProvider>
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
      </DialogProvider>
    </Router>
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
