import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { DialogProvider } from '@components/layouts';
// import { MatomoProvider } from '@hooks/use-matomo';
import store from './redux/store';
import routes from './routes';
// NOTE: react-scan
// import { initReactScan } from './utils/react-scan-config';

// 初始化 React Scan
// initReactScan();

// 創建 QueryClient 實例
// const queryClient = new QueryClient();

function App() {
  return (
    // <QueryClientProvider client={queryClient}>
    <ReduxProvider store={store}>
      {/* <MatomoProvider> */}
      <Router path='/'>
        <Switch>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} exact={route.exact}>
              <route.layout>
                <route.component />
              </route.layout>
            </Route>
          ))}
        </Switch>
      </Router>
      {/* </MatomoProvider> */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </ReduxProvider>
    // </QueryClientProvider>
  );
}

export default App;
