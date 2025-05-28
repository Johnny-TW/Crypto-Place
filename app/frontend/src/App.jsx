import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { WebSocketProvider } from '@hooks/use-websocket';
import store from './redux/store';
import routes from './routes';

function App() {
  return (
    <ReduxProvider store={store}>
      <WebSocketProvider>
        <BrowserRouter>
          <Switch>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
              >
                <route.layout>
                  <route.component />
                </route.layout>
              </Route>
            ))}
          </Switch>
        </BrowserRouter>
      </WebSocketProvider>
    </ReduxProvider>
  );
}

export default App;
