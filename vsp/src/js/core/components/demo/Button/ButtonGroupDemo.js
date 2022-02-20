import React from 'react';
import CSSModules from 'react-css-modules';

import { ButtonGroup } from 'vidya/Button';

import styles from './ButtonDemo.scss';

const fakeOption = [
  {
    value: 0,
    label: 'John Lennon',
    optional: 'addon_1',
  },
  {
    value: 1,
    label: 'Paul McCartney',
  },
  {
    value: 2,
    label: 'George Harrison',
  },
  {
    value: 3,
    label: 'Ringo Starr',
  },
];

class ButtonGroupDemo extends React.Component {
  constructor(props) {
    super(props);

    this.handleValue = this.handleValue.bind(this);

    this.state = {
      value: 0,
    };
  }

  handleValue(option) {
    this.setState({
      value: option.value,
    });
  }

  render() {
    return (
      <div>
        <strong>Button Group</strong>
        <div>
          <ButtonGroup
            onChange={this.handleValue}
            value={this.state.value}
            options={fakeOption}
          />
        </div>
        {fakeOption.filter(option => option.value === this.state.value)[0].label}
      </div>
    );
  }
}

export default CSSModules(ButtonGroupDemo, styles);
