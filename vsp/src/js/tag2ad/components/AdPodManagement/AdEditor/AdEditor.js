import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { TextInput } from 'vidya/Form';
import { Button } from 'vidya/Button';
import VideoPlayer from '../../VideoPlayer';
import AdCategoryDropDown from '../../AdCategoryDropDown';
import AdFormDropDown from '../../AdFormDropDown';
import Pagination from './Pagination';

import {
  findCategoryById,
  findFormById,
  getCategoryOption,
  connectApiConfig,
  isTimeStringValid,
} from '../../../utils';
import {
  timeToFrame,
  addHostPrefix,
  frameToSeconds,
  startPosToTimeString,
} from '../helper';
import styles from './AdEditor.scss';

class AdEditor extends React.Component {
  constructor(props) {
    super(props);
    const { video, selected, adCategories, adForms } = this.props;
    const category = getCategory(video, selected, adCategories);
    const form = findFormById(adForms, video.content[selected].form);
    this.state = {
      startTime: startPosToTimeString(video.content[selected].start_position, video.video_fps),
      startTimeInvalid: false,
      categoryOption: adCategories && adCategories.length > 0 && category
        ? getCategoryOption(category) : null,
      formOption: form ? form.id() : null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { video } = nextProps;
    const startTime = startPosToTimeString(video.content[nextProps.selected].start_position,
      nextProps.video.video_fps);

    const category = nextProps.adCategories.length > 0 ?
      getCategory(video, nextProps.selected, nextProps.adCategories) :
      null;

    const form = findFormById(nextProps.adForms, video.content[nextProps.selected].form);

    if (this.props.selected !== nextProps.selected) {
      this.player.pause();
    }

    this.setState(
      {
        startTime,
        categoryOption: category
          ? getCategoryOption(category)
          : null,
        formOption: form ? form.id() : null,
      }
    );
  }

  handleModifyClick = () => {
    const { video, selected } = this.props;
    const ad = Object.assign({}, video.content[selected]);
    const timeArr = this.state.startTime.split(':');
    const selectedForm = this.props.adForms.find(form => form.id() === this.state.formOption);
    ad.filter_id = this.state.categoryOption.value;
    ad.form = this.state.formOption;
    ad.start_position = timeToFrame(video.video_fps, timeArr[0], timeArr[1], timeArr[2]);
    ad.end_position = ad.start_position +
      timeToFrame(video.video_fps, 0, 0, selectedForm.duration());

    this.props.onUpdate(ad);
  };


  render() {
    const { video, selected, adCategories, adForms, t } = this.props;
    const { categoryOption, formOption, startTime } = this.state;
    const invalid = !isTimeStringValid(startTime) ||
      !categoryOption ||
      !formOption ||
      startTime.trim().length === 0;

    return (
      <div styleName="container">
        <div styleName="left">
          <div
            styleName="top"
          >
            <div
              styleName="info"
            >
              <h3>{t('editAd')}</h3>
              <Pagination
                total={video.content.length}
                selected={selected + 1}
                onSelect={number => this.props.onSelect(number - 1)}
              />
            </div>
          </div>
          <VideoPlayer
            ref={(node) => { this.player = node; }}
            styleName="player"
            src={addHostPrefix(video.video_url, this.props.videoHost)}
            autoPlay={false} controls
            time={frameToSeconds(video.content[selected].start_position, video.video_fps)}
          />
        </div>
        <div styleName="right">
          <div styleName="control">
            <Button vdSize={'normal'} vdStyle={'secondary'} onClick={this.props.onClose}>{t('close')}</Button>
          </div>
          <div
            styleName="row"
            style={{
              marginBottom: '4px',
            }}
          >
            <p>{t('start_time')}</p>
          </div>
          <div
            styleName="row"
            style={{
              marginBottom: '16px',
            }}
          >
            <TextInput
              value={this.state.startTime}
              onChange={(value) => { this.setState({ startTime: value }); }}
              placeholder="hh:mm:ss"
            />
          </div>
          <div
            styleName="row"
            style={{
              marginBottom: '4px',
            }}
          >
            <p>{t('adCategory')}</p>
          </div>
          <div
            styleName="row"
            style={{
              marginBottom: '28px',
            }}
          >
            <AdCategoryDropDown
              categories={adCategories}
              placeholder={t('chooseCategory')}
              onChange={(option) => { this.setState({ categoryOption: option }); }}
              selected={this.state.categoryOption}
              locale={this.props.locale}
            />
          </div>
          <div
            styleName="row"
            style={{
              marginBottom: '4px',
            }}
          >
            <div>{t('adForm')}</div>
          </div>
          <div
            style={{
              marginBottom: '16px',
            }}
            styleName="row"
          >
            <AdFormDropDown
              adForms={adForms}
              placeholder={t('chooseForm')}
              onChange={(option) => { this.setState({ formOption: option.value }); }}
              value={this.state.formOption}
              locale={this.props.locale}
            />
          </div>
          <div
            styleName="delete__ad"
            onClick={() => this.props.onDelete(video, selected)}
          >
            <p
              style={{
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {t('deleteAd')}
            </p>
          </div>
          <div styleName="btn-modify">
            <Button
              style={{ width: '100%' }}
              vdStyle={'primary'}
              onClick={this.handleModifyClick}
              disable={invalid}
            >
              {t('setting')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const getCategory = (video, selected, categories) => {
  const categoryId = video.content[selected].category;
  const filterId = video.content[selected].filter_id;
  return findCategoryById(categories, filterId || categoryId);
};

AdEditor.propTypes = {
  video: PropTypes.shape({
    gid: PropTypes.string,
    uid: PropTypes.number,
    video_id: PropTypes.number,
    video_fps: PropTypes.number,
    video_url: PropTypes.string,
    updated_time: PropTypes.string,
    created_time: PropTypes.string,
    content: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        start_position: PropTypes.number,
        end_position: PropTypes.number,
        form: PropTypes.number,
        thumbnail: PropTypes.string,
        filter_id: PropTypes.string,
      })
    ),
  }),
  adCategories: PropTypes.array,
  adForms: PropTypes.array,
  onSubmit: PropTypes.func,
  selected: PropTypes.number.isRequired,
  onSelect: PropTypes.func, // respond to next / prev item change
  t: PropTypes.func,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  locale: PropTypes.string,
  videoHost: PropTypes.string,
};


export default connectApiConfig(CSSModules(AdEditor, styles));
