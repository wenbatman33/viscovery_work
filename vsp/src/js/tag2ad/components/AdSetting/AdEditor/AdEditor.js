import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { TextInput } from 'vidya/Form';
import { Button } from 'vidya/Button';
import { Interpolate } from 'react-i18next';

import VideoPlayer from '../../VideoPlayer';
import styles from './AdEditor.scss';
import {
  getDefaultCategoryOption,
  findBrandById,
  getTagNameByLocale,
  isTimeStringValid,
} from '../../../utils';
import AdList from './AdList';
import AdCategoryDropDown from '../../AdCategoryDropDown';
import AdFormDropDown from '../../AdFormDropDown';
import AdListPlaceholder from './AdListPlaceholder';
import FeedbackedLabel from '../../FeedbackedLabel';

import { helper, Pagination } from '../../AdPodManagement';

import {
  reduceMergeDisabledList,
} from '../../../utils/feedbackHrs';

const TagInfoComponent = CSSModules(({ tagCount, tooltip }) => (
  <span styleName="tag-number" title={tooltip}>{tagCount}</span>
), styles);

const AdInfoComponent = CSSModules(({ adCount }) => (
  <span styleName="ad-number">{adCount}</span>
), styles);

class AdEditor extends React.Component {
  constructor(props) {
    super(props);
    const { video, selected } = this.props;
    // const defaultForm = findFormById(adForms, CREATE_AD_DEFAULT_FORM_ID);
    // const candidateFormId = adForms && adForms.length > 0 ? adForms[0].id() : null;

    this.state = {
      startTime: helper.startPosToTimeString(video.chances[selected].start, video.video_fps),
      startTimeInvalid: false,
      categoryOption: null,
      formOption: null,
    };
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.selected !== this.props.selected) {
      this.player.pause();
      this.setState({
        startTime: helper.startPosToTimeString(nextProps.video.chances[nextProps.selected].start,
          nextProps.video.video_fps),
      });
    }

    if (nextProps.selected !== this.props.selected) {
      this.setState({
        categoryOption: this.props.defaultCategory == null
          ? null
          : getDefaultCategoryOption(nextProps.adCategories, this.props.defaultCategory),
      });
    }
  }

  getTooltip = (chance) => {
    const tags = chance.tag_infos;
    const names = tags.map(tag =>
      getTagNameByLocale(findBrandById(this.props.brands, tag.tag_id), this.props.locale)
    );
    return names.toString();
  };

  isOverlapped = (fps, startTimeStr, endTimeStr, ad) => {
    const chanceStart = helper.timeStringToFrame(startTimeStr, fps);
    const chanceEnd = helper.timeStringToFrame(endTimeStr, fps);
    const adStart = ad.start();
    return (adStart >= chanceStart && adStart <= chanceEnd);
  };

  handleSubmitBtnClick = () => {
    // validate fields
    const { video, selected, adForms } = this.props;
    const { startTime, categoryOption, formOption } = this.state;
    const startFrame = helper.timeStringToFrame(startTime, video.video_fps);
    const endFrame = startFrame +
      (adForms.find(form => form.id() === formOption).duration() * video.video_fps);

    const ad = {
      video_id: video.video_id,
      video_fps: video.video_fps,
      content: {
        campaign_id: this.props.campaignId,
        start_position: startFrame,
        end_position: endFrame,
        thumbnail: video.chances[selected].thumbnail,
        tag_infos: video.chances[selected].tag_infos,
        filter_id: categoryOption.value,
        form: formOption,
        org_start_position: video.chances[selected].start,
        org_end_position: video.chances[selected].end,
      },
    };
    this.handleCreate(ad);
  };

  handleFeedback = () => {
    const {
      selected,
      video,
      requestFeedbackApi,
    } = this.props;
    const {
      video_id,
      chances,
    } = video;

    const chance = chances[selected];
    const {
      start,
      end,
    } = chance;

    const payload = {
      data: [
        {
          video_id,
          brand_ids: chance.tag_infos.map(tagInfo => tagInfo.tag_id),
          key_moment: {
            start,
            end,
          },
        },
      ],
    };

    const mergeSingleToDisabledList = state => ({
      disabledList: reduceMergeDisabledList(state.disabledList)(
        [
          {
            videoId: video_id,
            index: [selected],
          },
        ]
      ),
    });

    return requestFeedbackApi(payload, mergeSingleToDisabledList, 1, false);
  };

  handleDelete = (id) => {
    const { onDelete } = this.props;
    if (onDelete) {
      onDelete(id);
    }
  };

  handleCreate = (ad) => {
    const { onCreate } = this.props;
    if (onCreate) {
      onCreate(ad);
    }
  };

  render() {
    const { handleDelete, isOverlapped } = this;
    const {
      video,
      selected,
      adCategories,
      adForms,
      t,
      onSelect,
      onEditorClose,
      disabled,
    } = this.props;
    const { formOption, categoryOption, startTime } = this.state;
    const start = helper.startPosToTimeString(video.chances[selected].start, video.video_fps);
    const end = helper.endPosToTimeString(video.chances[selected].end, video.video_fps);
    const ads = this.props.ads.filter(ad =>
      ad.video() === video.video_id &&
      isOverlapped(video.video_fps, start, end, ad)
    );
    const tagInfo = (<TagInfoComponent
      tooltip={this.getTooltip(video.chances[selected])}
      tagCount={video.chances[selected].tag_infos.length}
    />);

    const adInfo = (
      <AdInfoComponent adCount={ads.length} />
    );

    const invalid = !isTimeStringValid(startTime) ||
      !formOption ||
      !categoryOption ||
      startTime.length === 0;

    return (
      <div styleName="container">
        {
          disabled ?
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-100%, -100%)',
                zIndex: '10',
              }}
            >
              <FeedbackedLabel />
            </div>
            : null
        }
        <div styleName="bottom">
          <div styleName="left">
            <div styleName="top">
              <div styleName="info">
                <h3>{t('ad_chance_period')} {start} - {end}</h3>
                <Pagination
                  total={video.chances.length}
                  selected={selected + 1}
                  onSelect={number => onSelect(number - 1)}
                />
              </div>
            </div>
            <VideoPlayer
              ref={(node) => { this.player = node; }}
              src={helper.addHostPrefix(video.video_url, this.props.videoHost)}
              time={
                helper.startPosToTimeOffset(video.chances[selected].start, video.video_fps) / 1000
              }
              autoPlay={false}
              controls
              styleName={`player ${disabled ? 'disabled' : ''}`}
            />
          </div>
          <div styleName="right">
            <div styleName="top">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Button vdStyle="secondary" onClick={onEditorClose}>{t('close')}</Button>
              </div>
            </div>
            <div
              styleName={disabled ? 'disabled' : null}
            >
              <div styleName="ads">
                <div
                  styleName="right-upper-text"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '9px',
                  }}
                >
                  <h3>
                    <Interpolate i18nKey="num_of_tags_contained" tagCount={tagInfo} />
                  </h3>
                  <div>
                    <Interpolate i18nKey="created_ads" adCount={adInfo} />
                  </div>
                </div>
                <div styleName="body">
                  { ads.length > 0
                      ?
                        <AdList
                          fps={video.video_fps}
                          ads={ads}
                          adCategories={adCategories}
                          adForms={adForms}
                          onDelete={handleDelete}
                          locale={this.props.locale}
                        />
                      :
                        <AdListPlaceholder>
                          {t('ad_list_empty_placeholder')}
                        </AdListPlaceholder>
                  }
                </div>
              </div>
              <div styleName="settings">
                <div styleName={'row'}>
                  <div
                    style={{
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        marginBottom: '4px',
                      }}
                    >
                      {t('start_time')}
                    </div>
                    <TextInput
                      placeholder="hh:mm:ss"
                      value={this.state.startTime}
                      onChange={(value) => { this.setState({ startTime: value }); }}
                      // invalid={!isTimeStringValid(startTime)}
                      // invalidMessage="期望格式：'時時:分分:秒秒'"
                    />
                  </div>
                </div>
              </div>
              <div styleName={'row'}>
                <div
                  style={{
                    flexGrow: '1',
                    marginRight: '16px',
                  }}
                >
                  <div
                    style={{
                      marginBottom: '4px',
                    }}
                  >
                    {t('adCategory')}
                  </div>
                  <div>
                    <AdCategoryDropDown
                      categories={adCategories}
                      placeholder={t('chooseCategory')}
                      onChange={(option) => { this.setState({ categoryOption: option }); }}
                      selected={categoryOption}
                      locale={this.props.locale}
                    />
                  </div>
                </div>
                <div
                  style={{
                    flexGrow: '1',
                  }}
                >
                  <div
                    style={{
                      marginBottom: '4px',
                    }}
                  >
                    {t('adForm')}
                  </div>
                  <div>
                    <AdFormDropDown
                      adForms={adForms}
                      placeholder={t('chooseForm')}
                      onChange={(option) => { this.setState({ formOption: option.value }); }}
                      value={formOption == null ? -1 : formOption}
                      locale={this.props.locale}
                    />
                  </div>
                </div>
              </div>
              <div
                styleName="report-hrs"
              >
                <p
                  onClick={this.handleFeedback}
                  style={{
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {t('report_the_wrong_tag')}
                </p>
              </div>
              <Button
                vdStyle="primary"
                vdSize={'normal'}
                style={{ width: '100%' }}
                onClick={this.handleSubmitBtnClick}
                disable={invalid}
              >
                {t('setting')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AdEditor.defaultProps = {
  ads: [],
};

AdEditor.propTypes = {
  video: PropTypes.shape({
    video_id: PropTypes.number,
    video_name: PropTypes.string,
    video_fps: PropTypes.number,
    video_url: PropTypes.string,
    chances: PropTypes.arrayOf(
      PropTypes.shape({
        start: PropTypes.number,
        end: PropTypes.number,
        thumbnail: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.number),
      })
    ),
  }),
  ads: PropTypes.array,
  adCategories: PropTypes.array,
  adForms: PropTypes.array,
  defaultCategory: PropTypes.string,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onEditorClose: PropTypes.func,
  selected: PropTypes.number.isRequired,
  onSelect: PropTypes.func, // respond to next / prev item change
  t: PropTypes.func,
  brands: PropTypes.array,
  locale: PropTypes.string,
  tagNames: PropTypes.string,
  videoHost: PropTypes.string,
  requestFeedbackApi: PropTypes.func,
  disabled: PropTypes.bool,
  campaignId: PropTypes.number.isRequired,
};


export default CSSModules(AdEditor, styles, { allowMultiple: true });
