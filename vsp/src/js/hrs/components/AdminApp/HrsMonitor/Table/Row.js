import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import {
  msToString,
 } from 'utils/timeUtil';

import { handleBoxWidth } from './';

import styles from './Row.scss';

const modelNameMapping = {
  1: 'FACE',
  6: 'Object',
  7: 'Scene',
};

const brandTemplate = (total, undone) =>
  `(${total - undone}/${total})`;

const progressTemplate = (total, undone, latestStartDone) =>
  `${total - undone - latestStartDone}/${total - latestStartDone}`;

class Row extends React.PureComponent {
  render() {
    const {
      number,
      account,
      videoName,
      groupName,
      modelId,
      brand,
      total,
      undone,
      latestStartDone,
      startTime,
      toVideoClick,
      toUserClick,
    } = this.props;

    const currentTime = new Date();
    const spentTime = currentTime - new Date(startTime);

    return (
      <div styleName="row-container">
        <div
          styleName="number"
          style={{
            width: handleBoxWidth('number'),
          }}
        >
          <p>{ number }</p>
        </div>
        <div
          styleName="account"
          style={{
            width: handleBoxWidth('account'),
          }}
        >
          <p
            onClick={toUserClick}
            style={{
              cursor: 'pointer',
            }}
          >
            { account }
          </p>
        </div>
        <div
          styleName="videoName"
          style={{
            width: handleBoxWidth('videoName'),
          }}
        >
          {
            videoName ?
              <p
                onClick={toVideoClick}
                styleName="videoName__word"
              >
                { videoName }
              </p>
              :
              <p
                onClick={toVideoClick}
                style={{
                  color: 'black',
                }}
              >
                /
              </p>
          }
          <p
            styleName="groupName__word"
          >
            {groupName}
          </p>
        </div>
        <div
          styleName="model"
          style={{
            width: handleBoxWidth('model'),
          }}
        >
          <p>{ modelNameMapping[modelId] || '/' }</p>
        </div>
        <div
          styleName="brand"
          style={{
            width: handleBoxWidth('brand'),
          }}
        >
          <p
            styleName="brand__wording"
          >
            { brand || '/' } { brand ? brandTemplate(total, undone) : '/' }
          </p>
        </div>
        <div
          styleName="progress"
          style={{
            width: handleBoxWidth('progress'),
          }}
        >
          <p>{ !isNaN(latestStartDone) ? progressTemplate(total, undone, latestStartDone) : '/' }</p>
        </div>
        <div
          styleName="spentTime"
          style={{
            width: handleBoxWidth('spentTime'),
          }}
        >
          <p>{ spentTime ? msToString(spentTime, '%H hr %M min', false) : '/' }</p>
        </div>
      </div>
    );
  }
}

Row.propTypes = {
  number: PropTypes.number,
  account: PropTypes.string,
  videoName: PropTypes.string,
  groupName: PropTypes.string,
  modelId: PropTypes.number,
  brand: PropTypes.string,
  total: PropTypes.number,
  undone: PropTypes.number,
  latestStartDone: PropTypes.number,
  startTime: PropTypes.string,
  toVideoClick: PropTypes.func,
  toUserClick: PropTypes.func,
};

export default CSSModules(Row, styles);
