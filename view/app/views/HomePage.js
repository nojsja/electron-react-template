import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

import RouteWithSubRoutes from 'router/RouteWithSubRoutes';

import { history } from 'app/App';

import EditableTree from 'components/EditableTree/index.jsx';

const treeData = [
  {
    nodeName: '出版者',
    id: '出版者',
    nameEditable: true,
    valueEditable: true,
    nodeValue: [
      {
        nodeName: '出版者描述',
        isInEdit: true,
        nameEditable: true,
        valueEditable: true,
        id: '出版者描述',
        nodeValue: [
          {
            nodeName: '出版者名称',
            id: '出版者名称',
            nameEditable: true,
            valueEditable: true,
            nodeValue: '出版者A',
          },
          {
            nodeName: '出版者地',
            id: '出版者地',
            nameEditable: true,
            valueEditable: true,
            nodeValue: '出版地B1',
          },
        ],
      }
    ],
  },
];

@inject('pub') @observer
class HomePage extends Component {
  static propTypes = {
    pub: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onDataChange = (data) => {
    console.log(`tree changed: `, data);
  }

  push = () => {
    history.push('/page1');
  }

  render() {
    const { match, routes } = this.props;

    return (
      <div className="container-router">
        <p>
          <Button onClick={this.push}>redirect to SemanticTree</Button>
        </p>
        <EditableTree
          data={treeData}
          maxLevel={10}
          pub={this.props.pub}
          onDataChange={this.onDataChange}
        />
         {
            routes && routes.map((route, i) => 
              <RouteWithSubRoutes key={`${route.path}_${i}`} route={route}/>
            )
          }
      </div>
    );
  }
}

HomePage.propTypes = {};

export default HomePage;
