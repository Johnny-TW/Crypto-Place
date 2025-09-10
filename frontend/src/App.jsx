import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { DialogProvider } from '@components/layouts';
import ProtectedRoute from '@components/common/ProtectedRoute';
import LoginRedirect from '@components/common/LoginRedirect';
import store from './redux/store';
import routes from './routes';
// import { MatomoProvider } from '@hooks/use-matomo';

function AppContent() {
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
