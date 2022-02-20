import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { Button } from 'vidya/Button';
import RecognitionForm from '../RecognitionForm';
import UploadForm from '../UploadForm';
import { NAME } from '../../constants';

import styles from './styles.scss';

class UploadSettingsForm extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    files: PropTypes.arrayOf(
      PropTypes.instanceOf(File)
    ).isRequired,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  state = {
    files: this.props.files,
    recognition: false,
    modelIds: [],
    faceModel: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.files !== this.props.files) {
      this.setState({
        files: nextProps.files,
        recognition: false,
        modelIds: [],
        faceModel: null,
      });
    }
  }

  handleUploadChange = (checked) => {
    this.setState({
      recognition: checked,
    });
  };

  handleUploadDelete = (file) => {
    const files = this.state.files.slice();
    const index = files.indexOf(file);
    if (index !== -1) {
      files.splice(index, 1);
    }
    this.setState({
      files,
    });
  };

  handleRecognitionChange = (modelIds, faceModel) => {
    this.setState({
      modelIds,
      faceModel,
    });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { files, modelIds, faceModel } = this.state;
    if (onSubmit) {
      onSubmit(files, modelIds, faceModel);
    }
  };

  render() {
    const { handleUploadChange, handleUploadDelete, handleRecognitionChange } = this;
    const { t } = this.props;
    const { files, recognition, modelIds, faceModel } = this.state;
    const disabled = !files.length
      || (recognition && !modelIds.length)
      || (recognition && modelIds.indexOf(1) !== -1 && !faceModel);
    return (
      <div styleName="form">
        <div styleName="settings">
          <div styleName="upload">
            <h3>{t('uploadVideo')}</h3>
            <div styleName="content">
              <UploadForm
                files={files}
                onChange={handleUploadChange}
                onDelete={handleUploadDelete}
              />
            </div>
          </div>
          {recognition
            ? (
              <div styleName="recognition">
                <h3>{t('analysisSettings')}</h3>
                <RecognitionForm onChange={handleRecognitionChange} />
              </div>
            )
            : null
          }
        </div>
        <div styleName="actions">
          <Button vdSize="normal" vdStyle="secondary" onClick={this.handleCancel}>{t('cancel')}</Button>
          <Button vdSize="normal" vdStyle="primary" disable={disabled} onClick={this.handleSubmit}>
            {t('submit')}
          </Button>
        </div>
      </div>
    );
  }
}

export default translate([NAME])(CSSModules(UploadSettingsForm, styles));
