import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { ApiUtil } from 'utils';
import { TextInput } from 'vidya/Form';
import { Button } from 'vidya/Button';
import { NAME } from '../../constants';

import styles from './styles.scss';

class EditVideoForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      name: this.props.name,
      nameInvalid: false,
      nameInvalidMessage: null,
      sourceVideoId: this.props.sourceVideoId,
      sourceVideoIdInvalid: false,
      sourceVideoIdInvalidMessage: null,
      sourceVideoUrl: this.props.sourceVideoUrl,
      sourceVideoUrlInvalid: false,
      sourceVideoUrlInvalidMessage: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.name,
      nameInvalid: false,
      nameInvalidMessage: null,
      sourceVideoId: nextProps.sourceVideoId,
      sourceVideoIdInvalid: false,
      sourceVideoIdInvalidMessage: null,
      sourceVideoUrl: nextProps.sourceVideoUrl,
      sourceVideoUrlInvalid: false,
      sourceVideoUrlInvalidMessage: null,
    });
  }

  handleSubmit = () => {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.name, this.state.sourceVideoId, this.state.sourceVideoUrl);
    }
    this.clearInput();
  };

  handleCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    this.clearInput();
  };

  clearInput = () => {
    this.setState({
      name: '',
      nameInvalid: false,
      nameInvalidMessage: null,
      sourceVideoId: '',
      sourceVideoIdInvalid: false,
      sourceVideoIdInvalidMessage: null,
      sourceVideoUrl: '',
      sourceVideoUrlInvalid: false,
      sourceVideoUrlInvalidMessage: null,
    });
  };

  handleNameChange = (input) => {
    const { id } = this.props;
    const trimmed = input.trim();
    if (trimmed.length) {
      const data = encodeURI(trimmed);
      ApiUtil.get(`/api/videos?video_name=${data}`)
        .then((response) => {
          const invalid = !!response.video_lst.length && response.video_lst[0].video_id !== id;
          this.setState({
            nameInvalid: invalid,
            nameInvalidMessage: invalid ? '影片名稱不可以重複' : null,
          });
        });
    } else {
      this.setState({
        nameInvalid: false,
        nameInvalidMessage: null,
      });
    }

    this.setState({
      name: input,
    });
  };

  handleSourceVideoIdChange = (input) => {
    const { id } = this.props;
    if (input.length) {
      const data = new FormData();
      data.append('source_video_id', input);
      ApiUtil.post(`/api/videos/${id}/validate`, data)
        .then((response) => {
          const invalid = !!response.rowcount && response.rowcount !== 0;
          this.setState({
            sourceVideoIdInvalid: invalid,
            sourceVideoIdInvalidMessage: invalid ? '來源Video ID已於此群組存在，無法輸入重複的資料' : null,
          });
        });
    } else {
      this.setState({
        sourceVideoIdInvalid: false,
        sourceVideoIdInvalidMessage: null,
      });
    }

    this.setState({
      sourceVideoId: input,
    });
  };

  handleSourceVideoUrlChange = (input) => {
    const { id } = this.props;
    if (input.length) {
      const data = new FormData();
      data.append('source_video_url', input);
      ApiUtil.post(`/api/videos/${id}/validate`, data)
        .then((response) => {
          const invalid = !!response.rowcount && response.rowcount !== 0;
          this.setState({
            sourceVideoUrlInvalid: invalid,
            sourceVideoUrlInvalidMessage: invalid ? '來源Video URL已於此群組存在，無法輸入重複的資料' : null,
          });
        });
    } else {
      this.setState({
        sourceVideoUrlInvalid: false,
        sourceVideoUrlInvalidMessage: null,
      });
    }

    this.setState({
      sourceVideoUrl: input,
    });
  };

  render() {
    const { t } = this.props;
    const {
      nameInvalid,
      nameInvalidMessage,
      sourceVideoIdInvalid,
      sourceVideoIdInvalidMessage,
      sourceVideoUrlInvalid,
      sourceVideoUrlInvalidMessage,
    } = this.state;
    const disabled = !this.state.name.trim() || nameInvalid || sourceVideoIdInvalid
      || sourceVideoUrlInvalid;
    return (
      <div styleName="container">
        <h3 styleName="header">{t('editVideoTitle')}</h3>
        <div styleName="unit">
          <p>{t('videoTitle')}</p>
          <TextInput
            invalid={nameInvalid}
            invalidMessage={nameInvalidMessage}
            placeholder={t('newVideoTitle')}
            value={this.state.name}
            onChange={this.handleNameChange}
          />
        </div>
        <div styleName="unit">
          <p>{t('sourceVideoId')}</p>
          <TextInput
            invalid={sourceVideoIdInvalid}
            invalidMessage={sourceVideoIdInvalidMessage}
            placeholder={t('newSourceVideoId')}
            value={this.state.sourceVideoId}
            onChange={this.handleSourceVideoIdChange}
          />
        </div>
        <div styleName="unit">
          <p>{t('sourceVideoUrl')}</p>
          <TextInput
            invalid={sourceVideoUrlInvalid}
            invalidMessage={sourceVideoUrlInvalidMessage}
            placeholder={t('newSourceVideoUrl')}
            value={this.state.sourceVideoUrl}
            onChange={this.handleSourceVideoUrlChange}
          />
        </div>
        <div styleName="control-btn-group">
          <Button
            onClick={this.handleCancel}
            vdSize={'normal'}
            vdStyle={'secondary'}
          >
            {t('cancel')}
          </Button>
          <Button
            disable={disabled}
            onClick={this.handleSubmit}
            vdSize={'normal'}
            vdStyle={'primary'}
          >
            {t('submit')}
          </Button>
        </div>
      </div>
    );
  }
}

EditVideoForm.propTypes = {
  t: PropTypes.func.isRequired,
  id: PropTypes.number,
  name: PropTypes.string,
  sourceVideoId: PropTypes.string,
  sourceVideoUrl: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};
EditVideoForm.defaultProps = {
  name: '',
  sourceVideoId: '',
  sourceVideoUrl: '',
};

export default translate([NAME])(CSSModules(EditVideoForm, styles));
