import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import style from './App.scss';
import { NAME } from '../constants';
import { routerUtil } from '../../utils';

class HeadSubNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: _navSelect(this.props.selected),
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
        routerUtil.pushHistory(`/${NAME}/versionReport`);
        break;
      case 2:
        routerUtil.pushHistory(`${NAME}/recognitionTasks`);
        break;
      default:
        break;
    }
  }

  render() {
    const location = this.state.location;
    return (
      <div styleName="HeadSubNav">
        <ul>
          <li styleName={location === 1 ? 'active' : ''} onClick={() => this.handleSelect(1)}><span>版本報告</span></li>
          <li styleName={location === 2 ? 'active' : ''} onClick={() => this.handleSelect(2)}><span>辨識優先權管理Beta</span></li>
        </ul>
      </div>
    );
  }
}

const _navSelect = (select) => {
  let locationState = 0;
  if (select !== `/${NAME}`) {
    const urlArr = select.split(`/${NAME}/`);
    if (urlArr[1] === 'versionReport') {
      locationState = 1;
    } else if (urlArr[1] === 'recognitionTasks') {
      locationState = 2;
    }
  }
  return locationState;
};

HeadSubNav.propTypes = {
  selected: PropTypes.string,
};

export default CSSModules(HeadSubNav, style);
