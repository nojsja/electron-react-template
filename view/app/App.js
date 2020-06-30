import React from 'react';
import { Router, hashHistory as history } from 'react-router';
import { Provider } from 'mobx-react';

import routes from 'app/router';
import PublicState from './stores/Public';


/* ------------------- global history ------------------- */

const stores = {
  pub: new PublicState(),
};

function App() {
  return (
    <Provider {...stores}>
      <Router history={history} routes={routes} />
    </Provider>
  );
}

/* ------------------- export provider ------------------- */
export default App;
