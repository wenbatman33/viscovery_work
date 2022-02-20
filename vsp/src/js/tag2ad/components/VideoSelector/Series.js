import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { Checkbox } from 'vidya/Form';
import Item from './Item';
import styles from './Series.scss';

class Series extends React.PureComponent {

  state = {
    expand: false,
    selected: this.props.selected || [], // video IDs
  };

  componentWillReceiveProps(nextProps) {
    const arrayEqual = (arr1, arr2) => {
      if (!arr1 || !arr2) { return false; }

      if (arr1.length !== arr2.length) { return false; }

      return arr1.every(ele => arr2.includes(ele));
    };
    if (!arrayEqual(this.props.selected, nextProps.selected)) {
      this.setState({
        selected: nextProps.selected,
      });
    }
    if (this.props.checked
      && this.props.videos.length === 0
      && nextProps.videos.length > 0
    ) {
      const videos = [];
      nextProps.videos.forEach((v) => {
        if (v.is_ready) { videos.push(v); }
      });
      this.updateSelected(videos, true);
    }
  }

  handleCheckboxChange = (checked) => {
    if (checked) {
      const videos = [];
      this.props.videos.forEach((v) => {
        if (v.is_ready) { videos.push(v); }
      });
      this.updateSelected(videos, true);
    } else {
      this.updateSelected([], false);
    }
    this.props.onCheck(checked, this.props.id);
  };

  handleVideoChange = (checked, videoId) => {
    const { selected } = this.state;
    const foundIx = selected.findIndex(v => v.video_id === videoId);
    if (checked) {
      if (foundIx < 0) {
        const nextSelected = [...selected, this.props.videos.find(v => v.video_id === videoId)];
        this.updateSelected(nextSelected);
      }
    } else if (foundIx > -1) {
      const nextSelected = [
        ...selected.slice(0, foundIx),
        ...selected.slice(foundIx + 1),
      ];
      this.updateSelected(nextSelected);
    }
  };

  updateSelected = (nextSelected) => {
    const seriesId = this.props.id;
    this.setState({
      selected: nextSelected,
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(seriesId, nextSelected);
      }
    });
  };

  handleFolderClick = () => {
    if (!this.props.disableExpand) {
      this.setState({
        expand: !this.state.expand,
      });
      if (this.props.onExpand) {
        this.props.onExpand(this.props.id);
      }
    }
  };

  render() {
    const { name, count, total, videos } = this.props;
    const label = `${name} (${count}/${total})`;
    return (
      <div>
        <div styleName="folder" onClick={this.handleFolderClick}>
          <Checkbox
            onChange={this.handleCheckboxChange}
            disabled={this.props.disableCheck}
            checked={this.props.checked}
          />
          <div styleName="folder-icon">
            <i className="fa fa-folder" aria-hidden="true" />
          </div>
          <div styleName="label" title={label}>
            {label}
          </div>
          {
            !this.props.disableExpand ?
              <div
                styleName="icon"
              >
                <i
                  className="fa fa-angle-right"
                  style={{
                    transform: `rotate(${this.state.expand ? '90deg' : '0'})`,
                  }}
                />
              </div>
              : null
          }
        </div>
        <div styleName={this.state.expand ? 'item' : 'hide'}>
          {
            !this.state.expand ?
              null :
            videos.map(v => (
              <Item
                key={v.video_id}
                label={v.video_name}
                value={v.video_id}
                onChange={this.handleVideoChange}
                checked={this.state.selected.findIndex(s => s.video_id === v.video_id) > -1}
                disabled={this.props.disableCheck || !v.is_ready}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

Series.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  videos: PropTypes.array,
  onChange: PropTypes.func,
  total: PropTypes.number,
  count: PropTypes.number,
  selected: PropTypes.array,
  onExpand: PropTypes.func,
  onCheck: PropTypes.func,
  disableExpand: PropTypes.bool,
  checked: PropTypes.bool,
  disableCheck: PropTypes.bool,
};


export default CSSModules(Series, styles);
