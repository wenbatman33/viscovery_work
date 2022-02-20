import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import humanize from 'humanize';

import { NAME, ERROR_CODES } from '../../../constants';
import { routerUtil } from '../../../../utils';

import styles from './ExpandRow.scss';

const errorMessage = (errorCode, t) => {
  switch (errorCode) {
    case ERROR_CODES.UPLOAD_DENIED:
      return t('noPermission');
    case ERROR_CODES.QUOTA_EXCEEDED:
      return t('quotaExceeded');
    case ERROR_CODES.WRONG_SERIES:
      return t('noFolder');
    case ERROR_CODES.DUPLICATE_NAME:
      return t('duplicateVideo');
    default:
      return t('uploadFailed');
  }
};

const ExpandRow = ({
 status,
 fileName,
 size,
 progress,
 seriesId,
 errorCode,
 clearClick,
 redoClick,
 t,
}) => (
  <div styleName="box">
    <div styleName={![3, 4].includes(status) ? 'left' : 'noBarLeft'}>
      <div styleName="description">
        <div styleName="fileName">
          <span title={fileName}>{fileName}</span>
        </div>
        <div styleName={![3, 4].includes(status) ? 'progress' : 'failProgress'}>
          { status === 1 ? `${humanize.filesize(size)} (${progress}%)` : null }
          { status === 2 ? humanize.filesize(size) : null }
          { status === 3 ? errorMessage(errorCode, t) : null }
          { status === 4 ? t('fileUnavailable') : null }
        </div>
      </div>
      {![3, 4].includes(status)
        ? (
          <div styleName="progressBox">
            <progress styleName="progressBar" value={Number(progress)} max="100" />
          </div>
        )
        : null
      }
    </div>
    { status === 1 ? (
      <div styleName="right" onClick={clearClick}>
        <i className="fa fa-times-circle" aria-hidden="true" />
      </div>
    ) : null }
    {status === 2
      ? (
        <div styleName="right" onClick={() => routerUtil.pushHistory(`/${NAME}/series/${seriesId}`)}>
          <i className="fa fa-search" aria-hidden="true" />
        </div>
      )
      : null
    }
    { [3, 4].includes(status)
      ? (
        <div styleName="right" onClick={redoClick}>
          <i className="fa fa-refresh" aria-hidden="true" />
        </div>
      )
      : null
    }
  </div>
);

ExpandRow.propTypes = {
  t: PropTypes.func.isRequired,
  errorCode: PropTypes.number,
  status: PropTypes.number,
  fileName: PropTypes.string,
  size: PropTypes.number,
  progress: PropTypes.number,
  click: PropTypes.func,
  seriesId: PropTypes.number,
  clearClick: PropTypes.func,
  redoClick: PropTypes.func,
};

export default translate([NAME])(CSSModules(ExpandRow, styles));
