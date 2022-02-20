import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import Header from './Header';
import Row from './Row';

import styles from './table.scss';

class Table extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <div styleName="container">
        <Header />
        <div styleName="content">
          {data.map((user, idx) => (
            <Row
              key={idx}
              id={idx}
              data={user}
            />
          ))}
        </div>
      </div>
    );
  }
}

Table.propTypes = {
  data: PropTypes.array,
};

export default CSSModules(Table, styles);
