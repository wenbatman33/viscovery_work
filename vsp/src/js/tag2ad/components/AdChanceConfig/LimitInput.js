import React from 'react';
import { TextInput } from 'vidya/Form';

import CSSModules from 'react-css-modules';
import styles from './styles.scss';

import * as helper from './helper';
import { localize } from '../../utils';

class LimitInput extends React.PureComponent {

  state = {
    valid: helper.inputPositiveCheck(this.props.value),
  };

  handleChange = (value) => {
    const valid = helper.inputPositiveCheck(value);
    this.setState({
      valid,
    });

    this.props.onChange(value, valid);
  };

  render() {
    return (
      <div styleName="limit-container">
        {this.props.t('chanceLimitDesc')}
        <TextInput
          value={this.props.value || ''}
          onChange={this.handleChange}
          invalid={!this.state.valid}
          invalidMessage={this.props.t('onlyTakesDigitsWarning')}
        />
      </div>
    );
  }
}

LimitInput.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func,
  t: React.PropTypes.func,
};


export default localize(CSSModules(LimitInput, styles));
