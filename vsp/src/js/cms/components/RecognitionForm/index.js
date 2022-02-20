import PropTypes from 'prop-types';
import React from 'react';

import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import Select from 'react-select-plus';

import 'react-select-plus/dist/react-select-plus.css';

import { ApiUtil, LogUtil } from 'utils';
import { NAME } from '../../constants';

import styles from './styles.scss';

const propTypes = {
  t: PropTypes.func,
  onChange: PropTypes.func,
};

class RecognitionForm extends React.Component {
  constructor(props) {
    super(props);

    this.input = {};
    this.state = {
      advanced: false,
      faces: [],
      face: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleFaceChange = this.handleFaceChange.bind(this);
    this.getModelIds = this.getModelIds.bind(this);
    this.getFaceModel = this.getFaceModel.bind(this);
  }

  componentDidMount() {
    this.handleModelChange();

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

  getModelIds() {
    const modelIds = [];
    for (const key of Object.keys(this.input)) {
      if (this.input[key].checked) {
        const id = parseInt(this.input[key].value, 10);
        modelIds.push(id);
      }
    }
    return modelIds;
  }

  getFaceModel() {
    const { face } = this.state;
    return face;
  }

  handleChange(modelIds, faceModel) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(modelIds, faceModel);
    }
  }

  handleModelChange() {
    const { face } = this.input;
    this.setState({
      advanced: face.checked,
      face: face.checked ? this.state.face : null,
    });

    const { getModelIds, getFaceModel } = this;
    const modelIds = getModelIds();
    const faceModel = getFaceModel();
    this.handleChange(modelIds, faceModel);
  }

  handleFaceChange(face) {
    this.setState({
      face: face ? face.value : null,
    });

    const { handleChange, getModelIds } = this;
    const modelIds = getModelIds();
    handleChange(modelIds, face ? face.value : null);
  }

  render() {
    const { handleModelChange, handleFaceChange } = this;
    const { t } = this.props;
    const { advanced, faces, face } = this.state;
    return (
      <div>
        <div styleName="option">
          <input
            type="checkbox"
            value="1"
            ref={(node) => { this.input.face = node; }}
            defaultChecked
            onChange={handleModelChange}
          />
          <h3>{t('face')}</h3>
        </div>
        {advanced
          ? (
            <div styleName="select">
              <Select placeholder={t('selectFaceModel')} options={faces} value={face} onChange={handleFaceChange} />
            </div>
          )
          : null
        }
        <div styleName="option">
          <input
            type="checkbox"
            value="6"
            ref={(node) => { this.input.object = node; }}
            defaultChecked
            onChange={handleModelChange}
          />
          <h3>{t('object')}</h3>
        </div>
        <div styleName="option">
          <input
            type="checkbox"
            value="7"
            ref={(node) => { this.input.scene = node; }}
            defaultChecked
            onChange={handleModelChange}
          />
          <h3>{t('scene')}</h3>
        </div>
      </div>
    );
  }
}

RecognitionForm.propTypes = propTypes;

export default translate([NAME])(CSSModules(RecognitionForm, styles));
