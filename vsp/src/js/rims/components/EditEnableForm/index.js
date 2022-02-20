import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { Button } from 'vidya/Button';
import { Switch } from 'vidya/Form';

import { NAME } from '../../constants';
import styles from './EditEnableForm.scss';

class EditEnableForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleRecgSwitchChange = this.handleRecgSwitchChange.bind(this);
    this.handleInUseSwitchChange = this.handleInUseSwitchChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);

    this.state = {
      id: '',
      isRecognizable: false,
      isInUse: false,
    };
  }

  componentWillMount() {
    const { brandData } = this.props;

    this.setState({
      id: brandData.id,
      isRecognizable: brandData.recognizable,
      isInUse: brandData.in_use,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { brandData } = nextProps;

    this.setState({
      id: brandData.id,
      isRecognizable: brandData.recognizable,
      isInUse: brandData.in_use,
    });
  }

  handleRecgSwitchChange(bool) {
    this.setState({
      isRecognizable: bool === true ? 1 : 0,
    });
  }

  handleInUseSwitchChange(bool) {
    this.setState({
      isInUse: bool === true ? 1 : 0,
    });
  }

  handleCloseModal() {
    this.props.closeModal();
  }

  submitForm() {
    const editedBrand = {
      id: this.state.id,
      recognizable: this.state.isRecognizable,
      in_use: this.state.isInUse,
    };

    this.props.submitForm(editedBrand, this.handleCloseModal);
  }

  render() {
    const { t } = this.props;
    return (
      <div styleName="form-container">
        <h2 styleName="modal-title">
          {t('editEnable')}
        </h2>
        <div styleName="switch-container">
          <div styleName="switch-item">
            <h3 styleName="switch-title">{t('enableRecognize')}</h3>
            <Switch
              checked={this.state.isRecognizable === 1}
              onChange={this.handleRecgSwitchChange}
            />
          </div>
          <div styleName="switch-item">
            <h3 styleName="switch-title">{t('enableInUse')}</h3>
            <Switch
              checked={this.state.isInUse === 1}
              onChange={this.handleInUseSwitchChange}
            />
          </div>
        </div>
        <div styleName="btn-container">
          <Button
            vdStyle="secondary"
            style={{ marginRight: '16px' }}
            onClick={this.handleCloseModal}
          >{t('cancel')}</Button>
          <Button
            vdStyle="primary"
            onClick={this.submitForm}
          >{t('save')}</Button>
        </div>
      </div>
    );
  }
}

EditEnableForm.propTypes = {
  t: PropTypes.func,
  brandData: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }),
  submitForm: PropTypes.func,
  closeModal: PropTypes.func,
};

export default new translate([NAME])(CSSModules(EditEnableForm, styles));
