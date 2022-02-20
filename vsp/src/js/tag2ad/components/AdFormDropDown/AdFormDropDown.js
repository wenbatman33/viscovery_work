import PropTypes from 'prop-types';
import React from 'react';
import { DropdownList } from 'vidya/Form';
import AdForm from '../../models/AdForm';
import * as helper from './helper';

const AdFormDropDown = props => (
  <DropdownList
    options={helper.toDropDownOptions(props.adForms, props.locale)}
    placeholder={props.placeholder}
    onChange={props.onChange}
    value={props.value}
  />
);

AdFormDropDown.propTypes = {
  adForms: PropTypes.arrayOf(PropTypes.instanceOf(AdForm)),
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
  ]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  locale: PropTypes.string,
};


export default AdFormDropDown;
