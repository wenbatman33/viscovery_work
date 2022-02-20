import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.scss';

class TableRow extends React.Component {

  render() {
    return (
      <div styleName="tag-table-row">
        {this.props.cells}
      </div>
    );
  }
}

TableRow.propTypes = {
  cells: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default CSSModules(TableRow, styles);
