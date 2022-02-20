import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'vidya/Button';
import CSSModules from 'react-css-modules';
import styles from './SingleDeleteForm.scss';

const SingleDeleteForm = props => (
  <div styleName="container">
    <h2>{props.t('single_delete_title')}</h2>
    <div styleName="btn-group">
      <Button vdStyle={'secondary'} onClick={props.onCancel}>{props.t('keep')}</Button>
      <Button vdStyle={'primary'} onClick={props.onConfirm}>{props.t('remove')}</Button>
    </div>
  </div>
);

SingleDeleteForm.propTypes = {
  t: PropTypes.func,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};


export default CSSModules(SingleDeleteForm, styles);
