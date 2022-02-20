import React from 'react';
import CSSModules from 'react-css-modules';

import { Switch } from 'vidya/Form';

import styles from './SwitchDemo.scss';

class SwitchDemo extends React.Component {
  constructor(props) {
    super(props);

    this.handleSwitch = this.handleSwitch.bind(this);

    this.state = {
      switch: true,
    };
  }

  handleSwitch(checked) {
    this.setState(
      {
        switch: checked,
      }
    );
  }

  render() {
    return (
      <div styleName="container">
        <strong>Switch</strong>
        <Switch
          checked={this.state.switch}
          onChange={this.handleSwitch}
        />
        <Switch
          checked={this.state.switch}
          onChange={this.handleSwitch}
        />
        {`checked: ${this.state.switch.toString()}`}
      </div>
    );
  }
}


export default CSSModules(SwitchDemo, styles);
