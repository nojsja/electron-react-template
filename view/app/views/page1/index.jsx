import React, { Component } from 'react';
import SourceTree from 'react-treeview-semantic';

const treeData = [
  {
    name: 'index',
    flag: 'base',
    children: [
      {name: 'solej'},
      {
        name: 'sdfds',
        children: [
          {name: 'exits', children: [{name: 'lalal', flag: 'table'}]},
          {name: '_default_', flag: 'file'},
          {name: 'exits2', children: [{name: 'lalal2', flag: 'table'}]},
        ]
      }
    ]
  },

  {
    name: '23qe2jewrjsdf-sdfjksdfsjdf-sdfkjsdfjsd',
    flag: 'base',
    children: [
      {name: 'sdf'},
      {
        name: 'dkdkdkd',
        children: [
          {name: 'cayman-sdfjksdfjkdk-sdfsdfkdkd-dk',flag: 'table'},
          {name: '_default_', flag: 'table'}
        ]
      }
    ]
  }
];

export default class page1 extends Component {
  render() {
    return (
      <div style={{borderTop: 'solid 1px grey', marginTop: '1rem', paddingTop: '1rem'}}>
        <SourceTree
          setActiveItem={console.log}
          baseIcon={null}
          baseColor={null}
          checkable={true}
          singleChecked={true}
          treeData={treeData}
          getChecked={console.log}
        />
      </div>
    );
  }
}