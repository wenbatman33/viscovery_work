import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { Interpolate } from 'react-i18next';

import BatchDeleteForm from '../BatchDeleteForm';
import styles from './FilterDeleteConfirmForm.scss';

const FilterNameComponent = CSSModules(({ name }) =>
  (
    <span styleName="filter-name">{name}</span>
  )
, styles);

const FilterDeleteConfirmForm = (props) => {
  const filterName = <FilterNameComponent name={props.filterName} />;
  const title = <Interpolate i18nKey="deleteFilterTitle" name={filterName} />;
  return (
    <BatchDeleteForm
      title={title}
      message={props.warningMessage}
      onConfirm={
        () => {
          props.onConfirm(props.filterId);
        }
      }
      onCancel={props.onCancel}
    />
  );
};

FilterDeleteConfirmForm.propTypes = {
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  filterName: PropTypes.string.isRequired,
  filterId: PropTypes.string.isRequired,
  warningMessage: PropTypes.string.isRequired,
};


export default FilterDeleteConfirmForm;
