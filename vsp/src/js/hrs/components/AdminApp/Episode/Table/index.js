import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';
import { CheckboxGroup } from 'react-checkbox-duet';

import {
  toVideoClick,
} from '../../utils';

import Row from './Row';

import {
  WAITING,
  PROCESSING,
} from '../';

import styles from './Table.scss';

export const handleBoxWidth = filter => (className) => {
  let mapping;
  if (filter === WAITING) {
    mapping = {
      checkbox: '2.5%',
      number: '2.5%',
      seriesName: '25%',
      videoName: '25%',
      account: '15%',
      source: '10%',
      tagCount: '10%',
      priority: '10%',
    };
  }
  if (filter === PROCESSING) {
    mapping = {
      number: '5%',
      seriesName: '25%',
      videoName: '25%',
      account: '15%',
      source: '10%',
      tagCount: '20%',
    };
  }

  return mapping[className];
};


class Table extends React.PureComponent {
  render() {
    const handleBoxWidthByFilter = handleBoxWidth(this.props.filter);
    const updateOneVideoPriority = R.curry(this.props.updateOneVideoPriority);
    const sortedVideo = R.sortBy(R.prop('id'))(this.props.videos);
    return (
      <div styleName="container">
        <div styleName="row-container-header">
          <div
            styleName="checkbox-header"
            style={{
              width: handleBoxWidthByFilter('checkbox'),
            }}
          />
          <div
            styleName="number-header"
            style={{
              width: handleBoxWidthByFilter('number'),
            }}
          />
          <div
            styleName="seriesName-header"
            style={{
              width: handleBoxWidthByFilter('seriesName'),
            }}
          >
            <p>劇名</p>
          </div>
          <div
            styleName="videoName-header"
            style={{
              width: handleBoxWidthByFilter('videoName'),
            }}
          >
            <p>集數</p>
          </div>
          <div
            styleName="account-header"
            style={{
              width: handleBoxWidthByFilter('account'),
            }}
          >
            <p>帳戶</p>
          </div>
          <div
            styleName="source-header"
            style={{
              width: handleBoxWidthByFilter('source'),
            }}
          >
            <p>來源</p>
          </div>
          <div
            styleName="tagCount-header"
            style={{
              width: handleBoxWidthByFilter('tagCount'),
            }}
          >
            <p>標籤數</p>
          </div>
          {
            this.props.filter === 1 ?
              <div
                styleName="priority-header"
                style={{
                  width: handleBoxWidthByFilter('priority'),
                }}
              >
                <p>優先權</p>
              </div>
            : null
          }

        </div>
        <div
          styleName={this.props.checkedList.length > 0 ? 'pure-row-area__short' : 'pure-row-area'}
        >
          <CheckboxGroup
            checkedList={this.props.checkedList}
            onChange={this.props.checkedListOnChange}
          >
            {
              sortedVideo.map((video, index) => (
                <Row
                  key={video.id}
                  videoId={video.id}
                  number={index + 1}
                  seriesName={video.series_name}
                  videoName={video.video_name}
                  groupName={video.group_name}
                  source="VSP主站"
                  priority={video.priority}
                  tasks={this.props.tasks.filter(task => task.video_id === video.id)}
                  filter={this.props.filter}
                  toVideoClick={toVideoClick(video.id)}
                  updateOneVideoPriority={updateOneVideoPriority(video.id)}
                />
              ))
            }
          </CheckboxGroup>
        </div>
      </div>
    );
  }
}

Table.propTypes = {
  videos: PropTypes.arrayOf(PropTypes.object),
  tasks: PropTypes.arrayOf(PropTypes.object),
  updateOneVideoPriority: PropTypes.func,
  filter: PropTypes.number,
  checkedList: PropTypes.arrayOf(PropTypes.number),
  checkedListOnChange: PropTypes.func,
};

export default CSSModules(Table, styles);
