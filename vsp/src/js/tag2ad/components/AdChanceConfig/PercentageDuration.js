import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'vidya/Form';
import CSSModules from 'react-css-modules';

import { localize } from '../../utils';
import Warning from './Warning';
import styles from './styles.scss';

class PercentageDuration extends React.PureComponent {

  render() {
    return (
      <div styleName={`percentage-container ${this.props.disabled ? 'mask' : ''}`}>
        {this.props.t('effectiveDurationOfAds')}
        <div styleName="inputs">
          <div>
            <TextInput
              value={this.props.start || ''}
              onChange={this.props.onStartChange}
              placeholder={this.props.placeholder}
              invalid={this.props.startInvalid}
              invalidMessage={''}
            />
          </div>
          <span>{this.props.t('to')}</span>
          <div>
            <TextInput
              value={this.props.end || ''}
              onChange={this.props.onEndChange}
              placeholder={this.props.placeholder}
              invalid={this.props.endInvalid}
              invalidMessage={''}
            />
          </div>
        </div>
        <div>
          {
            this.props.typeInvalid ?
              <Warning message={this.props.t('onlyTakesDigitsWarning')} /> :
              null
          }
          {
            this.props.isGT100 ?
              <Warning message={this.props.t('maximumCannotBeGreaterThan100')} /> :
              null
          }
          {
            this.props.isStartGTEnd ?
              <Warning message={this.props.t('latterValueMustBeGreater')} /> :
              null
          }
        </div>
      </div>
    );
  }
}

PercentageDuration.propTypes = {
  t: PropTypes.func,
  start: PropTypes.string,
  end: PropTypes.string,
  disabled: PropTypes.bool,
  onStartChange: PropTypes.func,
  onEndChange: PropTypes.func,
  startInvalid: PropTypes.bool,
  endInvalid: PropTypes.bool,
  isStartGTEnd: PropTypes.bool,
  typeInvalid: PropTypes.bool,
  isGT100: PropTypes.bool,
  placeholder: PropTypes.string,
};


export default localize(CSSModules(PercentageDuration, styles, { allowMultiple: true }));
