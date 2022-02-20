import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Button } from 'vidya/Button';

import { NAME } from '../../../constants';

const FailFeedbackHrs = ({ t, toHide }) => (
  <div
    style={{
      textAlign: 'center',
      margin: '0 70px',
    }}
  >
    <h3
      style={{
        marginBottom: '32px',
      }}
    >
      {t('feedbackFailMessage')}
    </h3>
    <Button
      vdStyle={'primary'}
      onClick={toHide}
    >
      {t('ok')}
    </Button>
  </div>
);

FailFeedbackHrs.propTypes = {
  t: PropTypes.func,
  toHide: PropTypes.func,
};

export default translate([NAME])(FailFeedbackHrs);
