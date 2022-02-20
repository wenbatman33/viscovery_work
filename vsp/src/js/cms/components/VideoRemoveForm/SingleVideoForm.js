import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { NAME } from '../../constants';

import styles from './styles.scss';

const SingleVideoForm = ({ videoName, t }) => (
  <div styleName="description">
    <div styleName="title">
      <h3>{t('deleteVideoConfirmation')}</h3>
    </div>
    <div styleName="name">
      <h3>{videoName}</h3>
    </div>
  </div>
);

SingleVideoForm.propTypes = {
  t: PropTypes.func.isRequired,
  videoName: PropTypes.string.isRequired,
};


export default translate([NAME])(CSSModules(SingleVideoForm, styles));
