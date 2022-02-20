import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { Interpolate, translate } from 'react-i18next';

import { NAME } from '../../../constants';

import styles from './ExpandHeader.scss';

const ExpandHeader = ({ selected, count, tabClick, windowClick, clearClick }) => (
  <div styleName="box">
    <div styleName="left">
      <div styleName={selected === 1 ? 'tab' : 'untab'} onClick={() => tabClick(1)}>
        <Interpolate i18nKey="pendingUploadsSummary" count={count.uploadCount} />
      </div>
      <div styleName={selected === 2 ? 'tab' : 'untab'} onClick={() => tabClick(2)}>
        <Interpolate i18nKey="completedUploadsSummary" count={count.doneCount} />
      </div>
      <div styleName={selected >= 3 ? 'tab' : 'untab'} onClick={() => tabClick(3)}>
        <Interpolate i18nKey="failedUploadsSummary" count={count.failCount} />
      </div>
    </div>
    <div styleName="right">
      <i className="fa fa-window-minimize" onClick={windowClick} />
      <i className="fa fa-times" style={{ fontSize: '13pt' }} onClick={clearClick} />
    </div>
  </div>
);

ExpandHeader.propTypes = {
  selected: PropTypes.number,
  count: PropTypes.objectOf({
    uploadCount: PropTypes.number,
    doneCount: PropTypes.number,
    failCount: PropTypes.number,
  }),
  tabClick: PropTypes.func,
  windowClick: PropTypes.func,
  clearClick: PropTypes.func,
};

export default translate([NAME])(CSSModules(ExpandHeader, styles));
