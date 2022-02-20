import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.scss';

class TableCell extends React.Component {

  render() {
    return (
      <div styleName="tag-table-cell">
        <div styleName="table-circle" style={{ background: `${this.props.circleColor}` }} />
        <div>{this.props.label}</div>
        <div>{`(${this.props.number})`}</div>
      </div>
    );
  }
}

TableCell.propTypes = {
  circleColor: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  number: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default CSSModules(TableCell, styles);
