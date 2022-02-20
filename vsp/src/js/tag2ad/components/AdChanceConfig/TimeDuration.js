import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'vidya/Form';
import CSSModules from 'react-css-modules';

import { localize } from '../../utils';
import Warning from './Warning';
import styles from './styles.scss';

class TimeDuration extends React.PureComponent {
  render() {
    return (
      <div styleName={`time-container ${this.props.disabled ? 'mask' : ''}`}>
        {this.props.t('ineffectiveDurationOfAds')}
        <div styleName="row">
          {this.props.t('afterVideoStarts')}
          <div styleName="input">
            <TextInput
              value={this.props.start || ''}
              onChange={this.props.onStartChange}
              placeholder={this.props.placeholder}
              invalid={this.props.startInvalid}
              invalidMessage={''}
            />
          </div>
        </div>
        <div styleName="row">
          {this.props.t('beforeVideoStarts')}
          <div styleName="input">
            <TextInput
              value={this.props.end || ''}
              onChange={this.props.onEndChange}
              placeholder={this.props.placeholder}
              invalid={this.props.endInvalid}
              invalidMessage={''}
            />
          </div>
        </div>
        {
          this.props.typeInvalid ?
            <Warning message={this.props.t('onlyTakesDigitsWarning')} /> :
            null
        }
      </div>
    );
  }
}

TimeDuration.propTypes = {
  t: PropTypes.func,
  start: PropTypes.string,
  end: PropTypes.string,
  disabled: PropTypes.bool,
  onStartChange: PropTypes.func,
  onEndChange: PropTypes.func,
  startInvalid: PropTypes.bool,
  endInvalid: PropTypes.bool,
  typeInvalid: PropTypes.bool,
  placeholder: PropTypes.string,
};


export default localize(CSSModules(TimeDuration, styles, { allowMultiple: true }));
