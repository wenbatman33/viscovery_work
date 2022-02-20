import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { Button } from 'vidya/Button';

import styles from './emptyTable.scss';

class EmptyTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div styleName="container">
        <div styleName="box">
          <div styleName="title">
            <h1>您還沒有建立任何帳號</h1>
          </div>
          <div styleName="btn">
            <Button vdSize="big" vdStyle="primary" onClick={() => this.props.createUser()}>新增帳號</Button>
          </div>
        </div>
      </div>
    );
  }
}

EmptyTable.propTypes = {
  createUser: PropTypes.func,
};

export default CSSModules(EmptyTable, styles);
