import React from 'react';
import CSSModules from 'react-css-modules';

import { DropdownList } from 'vidya/Form';

import styles from './DropdownListDemo.scss';

const options = [
  {
    value: 1,
    label: 'Drive My Car',
  },
  {
    value: 2,
    label: 'Norwegian Wood (This Bird Has Flown)',
  },
  {
    value: 3,
    label: "You Won't See Me",
  },
  {
    value: 4,
    label: 'Nowhere Man',
  },
  {
    value: 5,
    label: 'Think for Yourself',
  },
  {
    value: 6,
    label: 'The Word',
  },
];

class DropdownListDemo extends React.Component {
  constructor(props) {
    super(props);

    this.handleValue = this.handleValue.bind(this);

    this.state = {
      value: null,
    };
  }

  handleValue(option) {
    this.setState(
      {
        value: option.value,
      }
    );
  }

  render() {
    return (
      <div
        styleName="container"
      >
        <strong>Dropdown List</strong>
        <div
          styleName="input"
        >
          <DropdownList
            options={options}
            placeholder="選擇類別"
            onChange={this.handleValue}
            value={this.state.value}
          />
        </div>
        <div
          style={{
            background: 'black',
          }}
          styleName="input"
        >
          <DropdownList
            options={options}
            placeholder="選擇類別"
            onChange={this.handleValue}
            value={this.state.value}
            gray
          />
        </div>
      </div>
    );
  }
}


export default CSSModules(DropdownListDemo, styles);
