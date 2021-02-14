import React from 'react';
import { render } from 'react-dom';

import './app/styles/public.css';
import './app/styles/public.less';
import './app/styles/font/iconfont.css';
import 'antd/dist/antd.css';
import 'semantic-ui-css/semantic.min.css';

const rootDOMNode = document.getElementById('root');

let App;
function renderRoot() {
  App = require('./app/App.js').default; // we have to re-require this every time it changes otherwise we are rendering the same old app.
  render(<App/>, rootDOMNode);
}
renderRoot();

if (module.hot) {
  module.hot.accept('./app/App.js', () => {
    console.log('Accepting the updated module');
    renderRoot();
  });
}