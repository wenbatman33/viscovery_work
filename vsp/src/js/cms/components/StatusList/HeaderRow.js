import PropTypes from 'prop-types';
import React from 'react';

import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { NAME } from '../../constants';

import styles from './styles.scss';

const propTypes = {
  t: PropTypes.func.isRequired,
  onRetry: PropTypes.func,
};

const HeaderRow = ({ onRetry, t }) => (
  <div styleName="header-row">
    <div styleName="header-name">{t('videoTitle')}</div>
    <div styleName="header-job">{t('videoStatus')}</div>
    <div styleName="header-time">{t('analysisFinishedTime')}</div>
    {onRetry
      ? <div styleName="header-action">{t('videoOperations')}</div>
      : null
    }
  </div>
);

HeaderRow.propTypes = propTypes;

export default translate([NAME])(CSSModules(HeaderRow, styles));
