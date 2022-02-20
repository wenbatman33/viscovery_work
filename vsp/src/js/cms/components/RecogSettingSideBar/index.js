import React from 'react';

import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import Select from 'react-select-plus';

import 'react-select-plus/dist/react-select-plus.css';

import { Button } from 'vidya/Button';
import { NAME } from '../../constants';
import { ApiUtil, LogUtil } from '../../../utils';

import styles from './styles.scss';

const defaultChecked = {
  face: true,
  object: true,
  scene: true,
};

class RecogSettingSideBar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      checked: defaultChecked,
      faces: [],
      face: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFaceChange = this.handleFaceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    ApiUtil.get('/api/training_models')
      .then((response) => {
        this.setState({
          faces: response.face.map(face => ({ label: face, value: face })),
        });
      })
      .catch(() => {
        LogUtil.warn('Can\'t fetch face models');
      });
  }

  handleChange(event) {
    const isChecked = event.target.checked;
    const value = event.target.value;
    const result = Object.assign({}, this.state.checked);

    if (isChecked) {
      result[value] = true;
    } else {
      result[value] = false;
    }

    this.setState({
      checked: result,
    });
  }

  handleFaceChange(face) {
    this.setState({
      face: face ? face.value : null,
    });
  }

  handleSubmit() {
    const result = Object.assign({}, this.state.checked, {
      videoIds: this.props.videoIds,
      faceModel: this.state.face,
    });
    if (this.props.onSubmit) {
      this.props.onSubmit(result);
    }

    this.setState({
      checked: defaultChecked,
    });
  }

  handleCancel() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    this.setState({
      checked: defaultChecked,
    });
  }

  render() {
    const { checked, faces, face } = this.state;
    const { hide, t } = this.props;
    const disabled = Object.keys(checked).map(key => checked[key]).findIndex(value => value) === -1
      || (checked.face && !face);

    return (
      <div styleName={`panel-${!hide ? 'visible' : 'invisible'}`}>
        <div styleName="row-header">
          <h2 styleName="caption">{t('analysisSettings')}</h2>
          <div styleName="button-group">
            <Button vdStyle="secondary" vdSize="normal" onClick={this.handleCancel}>{t('cancel')}</Button>
            <Button
              disable={disabled}
              vdStyle="primary"
              vdSize="normal"
              onClick={this.handleSubmit}
            >
              {t('submit')}
            </Button>
          </div>
        </div>
        <Divider />
        <div styleName="row-item">
          <input type="checkbox" checked={checked.face} value={'face'} onChange={this.handleChange} />
          <h3>{t('face')}</h3>
        </div>
        {checked.face
          ? (
            <div styleName="row-select">
              <Select
                placeholder={t('selectFaceModel')}
                options={faces}
                value={face}
                onChange={this.handleFaceChange}
              />
            </div>
          )
          : null
        }
        <Divider />
        <div styleName="row-item">
          <input type="checkbox" checked={checked.object} value={'object'} onChange={this.handleChange} />
          <h3>{t('object')}</h3>
        </div>
        <Divider />
        <div styleName="row-item">
          <input type="checkbox" checked={checked.scene} value={'scene'} onChange={this.handleChange} />
          <h3>{t('scene')}</h3>
        </div>
        <Divider />
      </div>
    );
  }
}

const Divider = () => (
  <hr style={{ margin: '0px' }} />
);


RecogSettingSideBar.propTypes = {
  t: PropTypes.func,
  hide: PropTypes.bool.isRequired,
  videoIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default translate([NAME])(CSSModules(RecogSettingSideBar, styles));
