import React from 'react';
import { Route, Router } from 'react-router-dom';
import { Provider } from 'mobx-react';

import { createHashHistory } from 'history';
import RouteWithSubRoutes from './router/RouteWithSubRoutes';
import routes from './router/index';

import PublicState from './stores/Public';

/* ------------------- global history ------------------- */
export const history = createHashHistory();

const stores = {
  pub: new PublicState(),
};

function App() {
  return (
    <Provider {...stores}>
      <Router history={history}>
        <Router history={history}>
          <RouteWithSubRoutes route={routes} />
        </Router>
      </Router>
    </Provider>
  );
}

/* ------------------- export provider ------------------- */
export default App;
