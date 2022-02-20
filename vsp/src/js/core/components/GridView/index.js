import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../styles/layout.scss';
import Row from './Row';

class GridView extends React.Component {
  constructor(props) {
    super(props);
    this.computeRender = this.computeRender.bind(this);
  }

  computeRender() {
    const { elements, column } = this.props;
    const rows = elements.length > 0 ? Math.ceil(elements.length / column) : 0;
    const result = [];
    for (let i = 0; i < rows; i += 1) {
      const start = i * column;
      const end = column * (i + 1);
      const items = elements.slice(start, end);
      result.push(<Row key={`${start}-${end}`} items={items} column={column} />);
    }

    return result;
  }

  render() {
    return (
      <div styleName="gv-container">
        { this.computeRender() }
      </div>
    );
  }
}

GridView.defaultProps = {
  column: 3,
};

GridView.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.element).isRequired,
  column: PropTypes.oneOf([3, 4, 5]).isRequired,
};

export default CSSModules(GridView, styles);
