import React from 'react';
import CSSModules from 'react-css-modules';

import MultiLevelDL from 'vidya/Form/MultiLevelDL';

import styles from './MultiLevelDLDemo.scss';

const options = [
  {
    label: 'foo',
    value: 'FOO',
    items: [
      {
        label: 'bar',
        value: 'BAR',
        items: [
          {
            label: 'tar',
            value: 'TAR',
          },
        ],
      },
      {
        label: 'zar',
        value: 'ZAR',
      },
    ],
  },
  {
    label: 'boo',
    value: 'BOO',
  },
];

class MultiLevelDLDemo extends React.Component {
  constructor(props) {
    super(props);

    this.handleValue = this.handleValue.bind(this);

    this.state = {
      selected: {
        label: null,
        value: null,
      },
    };
  }

  handleValue(option) {
    this.setState(
      {
        selected: option,
      }
    );
  }

  render() {
    return (
      <div styleName="container">
        <strong>Multi-Level Dropdown List</strong>
        <MultiLevelDL
          options={options}
          selected={this.state.selected}
          onChange={this.handleValue}
        />
      </div>
    );
  }
}


export default CSSModules(MultiLevelDLDemo, styles);
