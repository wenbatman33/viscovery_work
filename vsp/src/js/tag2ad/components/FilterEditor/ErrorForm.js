import React from 'react';
import PropTypes from 'prop-types';

import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { NAME } from '../../constants';
import core from '../../../core';

import styles from './ErrorForm.scss';

const ErrorForm = ({ message, onClick, t }) => (
  <div styleName="container">
    <h3>{message}</h3>
    <core.components.Button onClick={onClick}>{t('ok')}</core.components.Button>
  </div>
);

ErrorForm.propTypes = {
  message: PropTypes.node,
  onClick: PropTypes.func,
  t: PropTypes.func,
};

export default translate([NAME])(CSSModules(ErrorForm, styles));
