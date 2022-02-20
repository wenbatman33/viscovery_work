import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import Select from 'react-select-plus';

import 'react-select-plus/dist/react-select-plus.css';

import { ApiUtil } from 'utils';
import { Button } from 'vidya/Button';
import { TextInput, DropdownList } from 'vidya/Form';
import UploadPanel from './UploadPanel';
import RecognitionForm from '../RecognitionForm';
import UploadForm from '../UploadForm';
import { NAME } from '../../constants';

import styles from './styles.scss';

class SeriesForm extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    countries: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    series: PropTypes.shape({
      series_id: PropTypes.number.isRequired,
      series_name: PropTypes.string.isRequired,
      alias: PropTypes.arrayOf(PropTypes.string).isRequired,
      country_id: PropTypes.number.isRequired,
    }),
    uploadEnabled: PropTypes.bool,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    uploadEnabled: true,
  };

  state = {
    name: this.props.series ? this.props.series.series_name : '',
    nameInvalid: false,
    nameInvalidMessage: null,
    aliases: this.props.series ? this.props.series.alias : [],
    countryId: this.props.series ? this.props.series.country_id : null,
    files: [],
    recognition: false,
    modelIds: [],
    faceModel: null,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.series ? nextProps.series.series_name : '',
      nameInvalid: false,
      nameInvalidMessage: null,
      aliases: nextProps.series ? nextProps.series.alias : [],
      countryId: nextProps.series ? nextProps.series.country_id : null,
      files: [],
      recognition: false,
      modelIds: [],
      faceModel: null,
    });
  }

  handleNameChange = (name) => {
    const { series } = this.props;
    const trimmed = name.trim();
    if (trimmed.length) {
      const data = encodeURI(trimmed);
      ApiUtil.get(`/api/series?series_name=${data}`)
        .then((response) => {
          const invalid = !!response.series_lst.length
            && (!series || response.series_lst[0].series_id !== series.series_id);
          this.setState({
            nameInvalid: invalid,
            nameInvalidMessage: invalid ? '資料夾名稱不可以重複' : null,
          });
        });
    } else {
      this.setState({
        nameInvalid: false,
        nameInvalidMessage: null,
      });
    }

    this.setState({
      name,
    });
  };

  handleAliasesChange = (options) => {
    this.setState({
      aliases: options.map(option => option.value),
    });
  };

  handleCountryChange = (option) => {
    this.setState({
      countryId: option.value,
    });
  };

  handleFileChange = (files) => {
    this.setState({
      files,
    });
  };

  handleFileDelete = (file) => {
    const files = this.state.files.filter(item => item !== file);
    const recognition = !!files.length && this.state.recognition;
    this.setState({
      files,
      recognition,
    });
  };

  handleRecognitionToggle = (recognition) => {
    this.setState({
      recognition,
    });
  };

  handleRecognitionChange = (modelIds, faceModel) => {
    this.setState({
      modelIds,
      faceModel,
    });
  };

  handleCancel = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.props.onSubmit) {
      if (this.props.series) {
        this.props.onSubmit(
          this.state.name, this.state.aliases, this.state.countryId, this.props.series);
      } else {
        this.props.onSubmit(
          this.state.name,
          this.state.aliases,
          this.state.countryId,
          this.state.files,
          this.state.modelIds,
          this.state.faceModel
        );
      }
    }
  };

  render() {
    const { uploadEnabled, t } = this.props;
    const { nameInvalid, nameInvalidMessage, files, recognition, modelIds, faceModel } = this.state;
    const aliases = this.state.aliases.map(alias => ({
      label: alias,
      value: alias,
    }));
    const options = this.props.countries.map(country => ({
      label: country.name,
      value: country.id,
    }));
    const disabled = !this.state.name.trim() || nameInvalid || !this.state.countryId
      || (recognition && (!modelIds.length || (modelIds.includes(1) && !faceModel)));
    let upload = null;
    if (!this.props.series) {
      if (files.length) {
        upload = (
          <div styleName="list">
            <UploadForm
              files={files}
              onChange={this.handleRecognitionToggle}
              onDelete={this.handleFileDelete}
            />
          </div>
        );
      } else if (uploadEnabled) {
        upload = <UploadPanel onChange={this.handleFileChange} />;
      }
    }
    return (
      <div styleName="form">
        <div styleName="settings">
          <div styleName="upload">
            <h3>{this.props.series ? t('editFolder') : t('createFolder')}</h3>
            <TextInput
              invalid={nameInvalid}
              invalidMessage={nameInvalidMessage}
              placeholder={t('folderTitle')}
              value={this.state.name}
              onChange={this.handleNameChange}
            />
            <Select.Creatable
              multi
              placeholder={t('folderAlias')}
              value={aliases}
              onChange={this.handleAliasesChange}
            />
            <DropdownList
              placeholder={t('folderCountry')}
              options={options}
              value={this.state.countryId}
              onChange={this.handleCountryChange}
            />
            {upload}
          </div>
          {recognition
            ? (
              <div styleName="recognition">
                <h3>{t('analysisSettings')}</h3>
                <RecognitionForm onChange={this.handleRecognitionChange} />
              </div>
            )
            : null
          }
        </div>
        <div styleName="actions">
          <Button vdSize="normal" vdStyle="secondary" onClick={this.handleCancel}>{t('cancel')}</Button>
          <Button disable={disabled} vdSize="normal" vdStyle="primary" onClick={this.handleSubmit}>{t('submit')}</Button>
        </div>
      </div>
    );
  }
}

export default translate([NAME])(CSSModules(SeriesForm, styles));
