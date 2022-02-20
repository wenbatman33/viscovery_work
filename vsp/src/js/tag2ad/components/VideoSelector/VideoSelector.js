import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { TextInput } from 'vidya/Form';
import FAIcon from 'vidya/Freddicons/FAIcon';

import AdvancedFilterContainer from '../../containers/AdvancedFilterContainer';

import Series from './Series';

import styles from './VideoSelector.scss';
import {
  countRecognizedVideos,
  countVideos,
  filterRecognizedSeries,
  filterRecognizedVideos,
} from '../../models';
import { localize } from '../../utils';

const ALL_FOLDER_ID = -10;
const ALL_FOLDER_NAME = 'all';
const totalVideos = series => (
  series.map(s => s.summary.total).reduce((x, y) => x + y, 0)
);
const totalVideosCount = series => (
  series.map(s => s.summary.recognized).reduce((x, y) => x + y, 0)
);

class VideoSelector extends React.PureComponent {
  state = {
    input: '',
    advancedFilterExpand: false,
  };

  componentWillReceiveProps(nextProps) {
    if (!Object.is(this.props.series, nextProps.series)) {
      this.setState({
        totalVideos: totalVideos(nextProps.series),
        totalCount: totalVideosCount(nextProps.series),
      });
    }
  }

  getSelectedVideosBySeriesId = (seriesId) => {
    if (this.props.selected) {
      return this.props.selected[seriesId] || [];
    }
    return [];
  };

  handleInputChange = (value) => {
    this.clearTimer(this.timer);

    this.setState({ input: value });
  };

  clearTimer = (timer) => {
    clearTimeout(timer);
  };

  handleVideoChange = (seriesId, videoArr) => {
    const nextSelected = Object.assign({}, this.props.selected);

    if (videoArr.length > 0) {
      nextSelected[seriesId] = videoArr;
    }

    if (videoArr.length === 0 && seriesId in nextSelected) {
      delete nextSelected[seriesId];
    }

    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(nextSelected);
    }
  };

  handleFolderAllCheck = (checked) => {
    if (checked) {
      const nextSelected = {};
      const videos = this.props.videos;
      let series = this.props.series.filter(s => videos[s.series_id]);
      series = filterRecognizedSeries(series);
      series.forEach((s) => {
        const seriesId = s.series_id;
        nextSelected[seriesId] = filterRecognizedVideos(videos[seriesId]);
      });

      this.props.onSelectionChange(nextSelected);
    } else {
      this.props.onSelectionChange({});
    }
  };

  seriesFilter = (series) => {
    const keyword = this.state.input.trim().toLowerCase();
    return series.series_name.toLowerCase().indexOf(keyword) > -1;
  };

  handleSeriesCheck = (checked, seriesId) => {
    const nextSelected = Object.assign({}, this.props.selected);
    if (checked) {
      const seriesVideos = this.props.videos[seriesId].map(v => v.is_ready === true);
      nextSelected[seriesId] = seriesVideos;
      this.props.onSelectionChange(nextSelected);
    } else {
      delete nextSelected[seriesId];
      this.props.onSelectionChange(nextSelected);
    }

    if (this.props.onSeriesCheck) {
      this.props.onSeriesCheck(checked, seriesId);
    }
  };

  toggleAdvancedFilterExpand = () =>
    this.setState(state => ({
      advancedFilterExpand: !state.advancedFilterExpand,
    }));

  closeAdvancedFilterExpand = () =>
    this.setState({
      advancedFilterExpand: false,
    })

  render() {
    const {
      advancedFilterExpand,
    } = this.state;
    const { t, withAdvancedFilter } = this.props;
    const videos = this.props.videos;
    const series = this.props.series.filter(s => videos[s.series_id]);
    const validCount = countRecognizedVideos(series);
    const all = series.every(element => !videos[element.series_id]
      || videos[element.series_id].every(
        v =>
          !v.is_ready
          || (this.getSelectedVideosBySeriesId(element.series_id))
            .map(video => video.video_id)
            .includes(v.video_id)
      )
    );
    const totalCount = countVideos(series);

    return (
      <div styleName="container">
        <div
          style={{
            height: '100%',
            overflowY: 'auto',
          }}
        >
          {
            withAdvancedFilter ?
              <div
                onClick={() => this.toggleAdvancedFilterExpand()}
                styleName="tabs"
              >
                <span>
                  <p
                    style={{
                      marginRight: '6px',
                    }}
                  >
                    {t('advanced_filter')}
                  </p>
                  <FAIcon
                    faClassName={
                      `${advancedFilterExpand ?
                        'fa-angle-double-left' : 'fa-angle-double-right'}`
                    }
                  />
                </span>
              </div> : null
          }
          <div styleName="input-container">
            <TextInput
              placeholder={this.props.t('seriesSearchInputPlaceholder')}
              onChange={this.handleInputChange}
              value={this.state.input}
            />
          </div>
          {
            !this.state.input.trim() && series.length > 0 && Object.keys(videos).length > 0 ?
              <Series
                key={ALL_FOLDER_ID}
                id={ALL_FOLDER_ID}
                name={ALL_FOLDER_NAME}
                videos={[]}
                selected={[]}
                count={validCount}
                total={totalCount}
                onCheck={this.handleFolderAllCheck}
                checked={all}
                disableExpand
              />
              : null
          }
          {
            Object.keys(videos).length > 0 ?
              series.filter(this.seriesFilter).map((s) => {
                const selected = this.getSelectedVideosBySeriesId(s.series_id);
                const count = s.summary.recognized;
                const checked = count > 0 && videos[s.series_id] && videos[s.series_id].every(
                  element =>
                    !element.is_ready || selected.map(v => v.video_id).includes(element.video_id)
                );

                return (
                  <Series
                    key={s.series_id}
                    id={s.series_id}
                    name={s.series_name}
                    videos={videos[s.series_id] || []}
                    total={s.summary.total}
                    count={count}
                    selected={selected}
                    onChange={this.handleVideoChange}
                    onCheck={this.handleSeriesCheck}
                    checked={checked || false}
                    disableCheck={count === 0}
                  />
                );
              }) : null
          }
        </div>
        <div
          styleName={
            `float-${advancedFilterExpand ? 'show' : 'hide'}`
          }
        >
          {
            withAdvancedFilter ?
              <AdvancedFilterContainer
                close={this.closeAdvancedFilterExpand}
              /> : null
          }
        </div>
      </div>
    );
  }
}

VideoSelector.defaultProps = {
  withAdvancedFilter: true,
  series: [],
  selected: {},
};

VideoSelector.propTypes = {
  withAdvancedFilter: PropTypes.bool,
  series: PropTypes.array,
  videos: PropTypes.object,
  selected: PropTypes.object,
  onSelectionChange: PropTypes.func,
  onSeriesCheck: PropTypes.func,
  t: PropTypes.func,
};


export default localize(CSSModules(VideoSelector, styles));
