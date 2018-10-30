import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { Divider, Icon } from 'semantic-ui-react';


import './startup.css';

// 批量引入所有图片(可以指定所有图片类型)
// const requireContext = require.context('resources/install', true, /^\.\/.*\.(jpg|png)$/);
// const requireContext = require.context('resources/startup', true, /.*/);
// requireContext.keys().map(requireContext);

@inject('pub') @observer
class StartupPage extends React.Component {
  static propTypes = {
    startup: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        startup
      </div>
    );
  }
}
export default StartupPage;
