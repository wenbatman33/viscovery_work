import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './TableTitle.scss';

const TableTitle = ({ account, taskCount }) => (
  <div styleName="container">
    <div>
      <h3> { account } </h3>
    </div>
    <div>
      <h2
        styleName="taskCount-number"
      >
        { taskCount }
      </h2>
      <p>工作排程</p>
    </div>
  </div>
);

TableTitle.propTypes = {
  account: PropTypes.string,
  taskCount: PropTypes.number,
};

TableTitle.defaultProps = {
  account: '',
  taskCount: '0',
};

export default CSSModules(TableTitle, styles);
