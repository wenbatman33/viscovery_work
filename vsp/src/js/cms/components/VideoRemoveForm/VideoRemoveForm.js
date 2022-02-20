import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { Button } from 'vidya/Button';
import MultiVideoForm from './MultiVideoForm';
import SingleVideoForm from './SingleVideoForm';
import { NAME } from '../../constants';

import styles from './styles.scss';

class VideoRemoveForm extends React.Component {

  render() {
    const { videos, onCancel, onRemove, t } = this.props;
    const multi = videos.length > 1;
    const form = multi
      ? <MultiVideoForm videoNum={videos.length} />
      : <SingleVideoForm videoName={videos[0].video_name} />;

    return (
      <div styleName="container">
        {form}
        <div styleName={multi ? 'btn-group-multi' : 'btn-group-single'}>
          <Button vdStyle={'secondary'} vdSize={'normal'} onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button vdStyle={'primary'} vdSize={'normal'} onClick={onRemove}>
            {t('submit')}
          </Button>
        </div>
      </div>
    );
  }
}

VideoRemoveForm.propTypes = {
  t: PropTypes.func.isRequired,
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      video_id: PropTypes.number.isRequired,
      video_name: PropTypes.string.isRequired,
      status: PropTypes.number.isRequired,
    })
  ).isRequired,
  onCancel: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default translate([NAME])(CSSModules(VideoRemoveForm, styles));

