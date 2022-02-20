import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import SimpleAlertForm from '../SimpleAlertForm';
import { localize } from '../../utils';
import styles from './AlertDialog.scss';

const AlertDialog = props => (
  <div styleName={props.show ? 'overlay' : 'hidden'}>
    <div styleName="msg-container">
      <SimpleAlertForm
        message={props.message}
        buttonText={props.t('ok')}
        onConfirm={props.onConfirm}
      />
    </div>
  </div>
);

AlertDialog.propTypes = {
  t: PropTypes.func,
  show: PropTypes.bool,
  message: PropTypes.string,
  onConfirm: PropTypes.func,
};


export default localize(CSSModules(AlertDialog, styles));
