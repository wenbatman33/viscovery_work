import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'vidya/Form';
import CSSModules from 'react-css-modules';
import Warning from './Warning';
import styles from './styles.scss';

import * as helper from './helper';
import { localize } from '../../utils';

class IntervalInput extends React.PureComponent {
  state = {
    valid: helper.inputPositiveCheck(this.props.value),
  };

  handleSecChange = (value) => {
    const valid = helper.inputPositiveCheck(value);
    this.setState({
      valid,
    });

    this.props.onChange(value, valid);
  };

  render() {
    return (
      <div styleName="interval-container">
        {this.props.t('intervalInputDesc')}
        <div styleName="interval-inputs">
          <TextInput
            value={this.props.value || ''}
            onChange={this.handleSecChange}
            invalid={!this.state.valid}
            invalidMessage={''}
          />
          <span>{this.props.t('second')}</span>
        </div>
        {
          !this.state.valid ?
            <Warning
              message={this.props.t('onlyTakesDigitsWarning')}
            />
            :
            null
        }
      </div>
    );
  }
}

IntervalInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  t: PropTypes.func,
};


export default localize(CSSModules(IntervalInput, styles));
