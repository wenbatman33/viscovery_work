import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import Button from 'vidya/Button/Button';

import styles from './SelectAllButton.scss';

const SelectAllButton = ({ status, selectAll, cancelSelectAll }) => {
  if (status === 0) {
    return (
      <Button
        vdStyle="secondary"
        vdSize="normal"
        onClick={selectAll}
      >
        <i
          className="fa fa-square-o"
          aria-hidden="true"
          styleName="selectAllIcon"
        />
        全選
      </Button>
    );
  }

  if (status === 2) {
    return (
      <Button
        vdStyle="secondary"
        vdSize="normal"
        onClick={cancelSelectAll}
      >
        <i
          className="fa fa-check-square"
          aria-hidden="true"
          styleName="river"
        />
        取消全選
      </Button>
    );
  }

  return (
    <Button
      vdStyle="secondary"
      vdSize="normal"
      onClick={selectAll}
    >
      <i
        className="fa fa-minus-square"
        styleName="river"
      />
      全選
    </Button>
  );
};

// status: 0 - unselected, 1 - partial, 2 - all selected
SelectAllButton.propTypes = {
  status: PropTypes.number,
  selectAll: PropTypes.func,
  cancelSelectAll: PropTypes.func,
};

export default CSSModules(SelectAllButton, styles);
