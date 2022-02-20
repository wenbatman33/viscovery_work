import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { Button } from 'vidya/Button';

import styles from './emptyTable.scss';

class EmptyTable extends React.Component {
  render() {
    return (
      <div styleName="container">
        <div styleName="box">
          <div styleName="title">
            <h1>您還沒有建立任何群組</h1>
          </div>
          <div styleName="btn">
            <Button vdSize="big" vdStyle="primary" onClick={() => this.props.createGroup()}>新增群組</Button>
          </div>
        </div>
      </div>
    );
  }
}

EmptyTable.propTypes = {
  createGroup: PropTypes.func,
};

export default CSSModules(EmptyTable, styles);
