import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { Button } from 'vidya/Button';

import { NAME } from '../../../../constants';
import styles from './AlertForm.scss';

const AlertForm = props => (
  <div styleName="form-container">
    <h3>{ props.children }</h3>
    <div style={{ marginTop: '32px' }}>
      <Button
        vdStyle="primary"
        style={{ width: '60px' }}
        onClick={() => {
          props.modalInstance.toHide();
          props.dispatchCancelModal();
        }}
      >
        {props.t('okay')}
      </Button>
    </div>
  </div>
);

AlertForm.propTypes = {
  t: PropTypes.func,
  children: PropTypes.string,
  modalInstance: PropTypes.shape({
    toHide: PropTypes.func,
  }),
  dispatchCancelModal: PropTypes.func,
};

export default translate([NAME])(CSSModules(AlertForm, styles));
