import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'vidya/Button';
import CSSModules from 'react-css-modules';
import AdFormDropDown from '../AdFormDropDown';
import AdCategoryDropDown from '../AdCategoryDropDown';

import styles from './BatchAdvertisingDialog.scss';

const BatchAdvertisingDialog = props => (
  <div styleName="container">
    <h2>{props.t('batchAdvertising')}</h2>
    <div styleName="header">{props.t('adCategory')}</div>
    <AdCategoryDropDown
      categories={props.categories}
      selected={props.categoryOption}
      onChange={props.onCategoryChange}
      placeholder={props.t('chooseCategory')}
      locale={props.locale}
    />
    <div styleName="header">{props.t('adForm')}</div>
    <AdFormDropDown
      adForms={props.forms}
      value={props.formOption ? props.formOption.value : null}
      onChange={props.onFormChange}
      placeholder={props.t('chooseForm')}
      locale={props.locale}
    />
    <div styleName="btn-group">
      <Button
        vdStyle={'secondary'}
        onClick={props.onCancel}
      >
        {props.t('cancel')}
      </Button>
      <Button
        vdStyle={'primary'}
        onClick={props.onSave}
        disable={!props.formOption || !props.categoryOption}
      >
        {props.t('save')}
      </Button>
    </div>
  </div>
);

BatchAdvertisingDialog.propTypes = {
  onCategoryChange: PropTypes.func,
  onFormChange: PropTypes.func,
  formOption: PropTypes.object,
  categoryOption: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  t: PropTypes.func,
  categories: PropTypes.array,
  forms: PropTypes.array,
  locale: PropTypes.string,
};


export default CSSModules(BatchAdvertisingDialog, styles);
