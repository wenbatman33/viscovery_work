import PropTypes from 'prop-types';
import React from 'react';

import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { NAME } from '../../constants';

import styles from './styles.scss';

const propTypes = {
  t: PropTypes.func.isRequired,
};

const EmptyPanel = ({ t }) => (
  <div styleName="panel">
    <h3>{t('noAnalysis')}</h3>
  </div>
);

EmptyPanel.propTypes = propTypes;

export default translate([NAME])(CSSModules(EmptyPanel, styles));
