import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './main.scss';

import { NAME } from '../../constants';
import { routerUtil } from '../../../utils';

class AMSideNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: _navSelect(props.selected),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      location: _navSelect(nextProps.selected),
    });
  }

  handleSelect = (key) => {
    switch (key) {
      case 1:
        routerUtil.pushHistory(`/${NAME}/group`);
        break;
      case 2:
        routerUtil.pushHistory(`/${NAME}/user`);
        break;
      default:
        break;
    }
  }

  render() {
    const location = this.state.location;
    return (
      <div styleName="container">
        <div styleName={location === 1 ? 'selectedRow' : 'row'} onClick={() => this.handleSelect(1)}>
          <p>群組管理</p>
        </div>
        <div styleName={location === 2 ? 'selectedRow' : 'row'} onClick={() => this.handleSelect(2)}>
          <p>帳號管理</p>
        </div>
      </div>
    );
  }
}

const _navSelect = (select) => {
  let locationState = 0;
  if (select !== `/${NAME}`) {
    const urlArr = select.split(`/${NAME}/`);

    if (urlArr[1] === 'group') {
      locationState = 1;
    }

    if (urlArr[1] === 'user') {
      locationState = 2;
    }
  }
  return locationState;
};

AMSideNav.propTypes = {
  selected: PropTypes.string,
};


export default CSSModules(AMSideNav, styles);
