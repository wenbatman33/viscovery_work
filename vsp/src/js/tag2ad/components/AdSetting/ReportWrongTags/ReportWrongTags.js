import React from 'react';
import PropTypes from 'prop-types';
import { translate, Interpolate } from 'react-i18next';

import {
  Button,
} from 'vidya/Button';

import { NAME } from '../../../constants';

const ReportWrongTags = ({ onKeep, onReport, t, count }) => (
  <div
    style={{
      textAlign: 'center',
      padding: '0 45px',
    }}
  >
    <h3
      style={{
        marginBottom: '32px',
      }}
    >
      <Interpolate i18nKey="sure_to_report_tags" count={count} />
    </h3>
    <Button
      vdStyle={'secondary'}
      onClick={onKeep}
      style={{
        marginRight: '16px',
      }}
    >
      {t('keep')}
    </Button>
    <Button
      vdStyle={'primary'}
      onClick={onReport}
    >
      {t('report')}
    </Button>
  </div>
);

ReportWrongTags.propTypes = {
  onReport: PropTypes.func,
  onKeep: PropTypes.func,
  t: PropTypes.func,
  count: PropTypes.number,
};

export default translate([NAME])(ReportWrongTags);
