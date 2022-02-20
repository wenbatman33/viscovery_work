import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { NAME } from '../../../constants';
import styles from './MemoArea.scss';

class MemoArea extends React.Component {
  render() {
    const { memoValue, showMemoAreaWarning, onMemoChange, t } = this.props;

    return (
      <div styleName="memo-container">
        <div styleName="memo-title">
          <h3>{t('memo')}</h3>
          <p styleName={`${showMemoAreaWarning ? 'memo-warning' : 'hide-warning'}`} >
            {t('memoAreaWarningMsg')}
          </p>
        </div>
        <textarea
          styleName="memo-area"
          placeholder={t('memoAreaPlaceholder')}
          value={memoValue}
          onChange={onMemoChange}
        />
      </div>
    );
  }
}

MemoArea.propTypes = {
  t: PropTypes.func,
  memoValue: PropTypes.string,
  showMemoAreaWarning: PropTypes.bool,
  onMemoChange: PropTypes.func,
};

export default new translate([NAME])(CSSModules(MemoArea, styles));
