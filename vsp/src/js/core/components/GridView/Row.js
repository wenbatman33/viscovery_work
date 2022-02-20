import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../styles/layout.scss';

class Row extends React.Component {
  render() {
    const { items, column } = this.props;
    return (

      <div styleName={`${'gv-row'}`}>
        {
          items.map((ele, index) => {
            if (index < column - 1) {
              return <div key={index} styleName={`${'col'}-${column}  ${(index + 1 === column ? '' : 'gap')}`}>{ele}</div>;
            }
            return <div key={index} styleName={`${'col'}-${column}`}>{ele}</div>;
          })
        }
      </div>
    );
  }
}

Row.propTypes = {
  items: PropTypes.array.isRequired,
  column: PropTypes.number.isRequired,
};

export default CSSModules(Row, styles, { allowMultiple: true });
