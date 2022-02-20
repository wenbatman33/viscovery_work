import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { Button } from 'vidya/Button';
import { NAME } from '../../constants';

import styles from './styles.scss';

class CheckForm extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  handleCancel = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const { onSubmit } = this.props;
    if (onSubmit) {
      onSubmit();
    }
  };

  render() {
    const { t } = this.props;
    return (
      <div styleName="form">
        <div styleName="message">{this.props.message}</div>
        <div styleName="actions">
          <Button vdSize="normal" vdStyle="secondary" onClick={this.handleCancel}>{t('cancel')}</Button>
          <Button vdSize="normal" vdStyle="primary" onClick={this.handleSubmit}>{t('submit')}</Button>
        </div>
      </div>
    );
  }
}

export default translate([NAME])(CSSModules(CheckForm, styles));
