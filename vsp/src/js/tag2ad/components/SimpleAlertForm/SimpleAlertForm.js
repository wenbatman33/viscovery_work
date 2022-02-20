import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'vidya/Button';
import CSSModules from 'react-css-modules';
import styles from './styles.scss';


const SimpleAlertForm = props => (
  <div styleName="container">
    <div styleName="message">
      {props.message}
    </div>
    <div>
      <Button
        vdStyle={'primary'}
        vdSize={'normal'}
        onClick={props.onConfirm}
      >
        {props.buttonText || 'OK'}
      </Button>
    </div>
  </div>
);

SimpleAlertForm.propTypes = {
  message: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
};


export default CSSModules(SimpleAlertForm, styles);
