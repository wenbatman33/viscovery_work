import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import { localize } from '../../utils';

import styles from './FeedbackedLabel.scss';

const FeedbackedLabed = ({ t }) => (
  <span styleName="feedbacked">
    <p>{t('feedback_to_wrong')}</p>
  </span>
);

FeedbackedLabed.propTypes = {
  t: PropTypes.func,
};

export default localize(CSSModules(FeedbackedLabed, styles));

