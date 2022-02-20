import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { Button } from 'vidya/Button';

import { routerUtil } from 'utils';
import { NAME } from '../../constants';


import styles from './row.scss';

class Row extends React.Component {
  constructor(props) {
    super(props);

    this.modifiedUser = this.modifiedUser.bind(this);
  }

  modifiedUser() {
    routerUtil.pushHistory(`/${NAME}/user/${this.props.data.uid}`);
  }

  render() {
    const { data } = this.props;
    return (
      <div styleName="container">
        <div styleName="userId">{this.props.id + 1}</div>
        <div styleName="account">{data.account}</div>
        <div styleName="username">{data.username}</div>
        <div styleName="company">{data.company}</div>
        <div styleName="tel_number">{data.tel_number}</div>
        <div styleName="creator">
          <div styleName="subContent">{data.creator}</div>
          <div styleName="subContent">{data.register_time}</div>
        </div>
        <div styleName="manipulate">
          <Button vdSize="function" vdStyle="secondary" onClick={this.modifiedUser}>
            <i className="fa fa-cog" />
          </Button>
        </div>
      </div>
    );
  }
}

Row.propTypes = {
  data: PropTypes.object,
  id: PropTypes.number,
};

export default CSSModules(Row, styles);
