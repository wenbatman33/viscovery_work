import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import Header from './Header';
import Row from './Row';

import styles from './table.scss';

class Table extends React.Component {
  render() {
    const { data, countries } = this.props;
    return (
      <div styleName="container">
        <Header />
        <div styleName="content">
          {data.map((group, id) => (
            <Row
              key={id}
              groupId={id}
              data={group}
              countries={countries}
            />
          ))}
        </div>
      </div>
    );
  }
}

Table.propTypes = {
  countries: PropTypes.array,
  data: PropTypes.array,
};

export default CSSModules(Table, styles);
