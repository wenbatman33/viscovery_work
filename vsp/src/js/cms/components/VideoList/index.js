import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { ContextMenu, Item } from 'react-contexify';
import { translate } from 'react-i18next';

import { ListView } from 'vidya';
import Header from './Header';
import Row from './Row';
import { NAME } from '../../constants';

import styles from './styles.scss';

class VideoList extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    videos: PropTypes.arrayOf(
      PropTypes.shape({
        video_id: PropTypes.number.isRequired,
        video_name: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
      })
    ).isRequired,
    uploads: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.number.isRequired,
        progress: PropTypes.number.isRequired,
        video: PropTypes.shape({
          video_id: PropTypes.number.isRequired,
        }),
      })
    ).isRequired,
    checkedIds: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onBatchDelete: PropTypes.func,
    onMove: PropTypes.func,
    onRecogBtnClick: PropTypes.func.isRequired,
    onEditButtonClick: PropTypes.func.isRequired,
    models: PropTypes.arrayOf(
      PropTypes.shape({
        model_id: PropTypes.number,
        model_name: PropTypes.string,
      })
    ).isRequired,
    actionsVisible: PropTypes.bool,
    locale: PropTypes.string,
  };

  static defaultProps = {
    checkedIds: [],
    actionsVisible: true,
  };

  state = {
    headerChecked: false,
    headerIndeterminate: false,
    videosChecked: this.props.videos.map(
      video => !!this.props.checkedIds.find(id => id === video.video_id)
    ),
  };

  componentWillReceiveProps(nextProps) {
    const { onChange } = this.props;
    const same = nextProps.videos.length === this.props.videos.length && nextProps.videos.every(
      video => this.props.videos.find(item => item.video_id === video.video_id)
    );
    if (!same) {
      this.setState({
        headerChecked: false,
        headerIndeterminate: false,
        videosChecked: nextProps.videos.map(() => false),
      });

      if (onChange) {
        onChange([]);
      }
    } else if (nextProps.checkedIds.length !== this.props.checkedIds.length) {
      const videosChecked = nextProps.videos.map(
        video => !!nextProps.checkedIds.find(id => id === video.video_id)
      );
      this.setState({
        headerChecked: videosChecked.some(value => value),
        headerIndeterminate: videosChecked.some(value => value)
          && videosChecked.some(value => !value),
        videosChecked,
      });
    }
  }

  handleHeaderChange = (checked) => {
    const { videos, onChange } = this.props;
    this.setState({
      headerChecked: checked,
      headerIndeterminate: false,
      videosChecked: videos.map(() => checked),
    });

    if (onChange) {
      const ids = checked ? videos.map(video => video.video_id) : [];
      onChange(ids);
    }
  };

  handleRowChange = (index, checked) => {
    const videosChecked = this.state.videosChecked.slice();
    videosChecked[index] = checked;
    this.setState({
      headerChecked: videosChecked.some(value => value),
      headerIndeterminate: videosChecked.some(value => value)
        && videosChecked.some(value => !value),
      videosChecked,
    });

    const { videos, onChange } = this.props;
    if (onChange) {
      const ids = videos.filter((video, i) => videosChecked[i]).map(video => video.video_id);
      onChange(ids);
    }
  };

  handleUpdate = (item, target) => {
    const id = parseInt(target.dataset.id ? target.dataset.id : target.children[0].dataset.id, 10);
    if (this.props.onUpdate) {
      this.props.onUpdate(id);
    }
  };

  handleDelete = (item, target) => {
    const id = parseInt(target.dataset.id ? target.dataset.id : target.children[0].dataset.id, 10);
    if (this.props.onDelete) {
      this.props.onDelete(id);
    }
  };

  handleMove = (item, target) => {
    const id = parseInt(target.dataset.id ? target.dataset.id : target.children[0].dataset.id, 10);
    if (this.props.onMove) {
      this.props.onMove(id);
    }
  };

  showList = () => {
    const { videos, actionsVisible, locale } = this.props;
    const { videosChecked } = this.state;
    const items = videos.map((video, index) => (
      <Row
        key={video.video_id}
        checked={videosChecked[index]}
        video={video}
        upload={this.props.uploads.find(upload => upload.video
          && upload.video.video_id === video.video_id)
        }
        onChange={checked => this.handleRowChange(index, checked)}
        onRecogBtnClick={this.props.onRecogBtnClick}
        onEditButtonClick={this.props.onEditButtonClick}
        models={this.props.models}
        actionsVisible={actionsVisible}
        locale={locale}
      />
    ));
    return <ListView divider elements={items} />;
  };

  render() {
    const { t } = this.props;
    const { headerChecked, headerIndeterminate } = this.state;
    return (
      <div styleName="list">
        <Header
          checked={headerChecked}
          indeterminate={headerIndeterminate}
          onChange={this.handleHeaderChange}
        />
        {this.showList()}
        <ContextMenu id="video">
          <Item label={t('editVideo')} onClick={this.handleUpdate} />
          <Item label={t('deleteVideo')} onClick={this.handleDelete} />
          <Item label={t('moveVideo')} onClick={this.handleMove} />
        </ContextMenu>
      </div>
    );
  }
}

export default translate([NAME])(CSSModules(VideoList, styles));
