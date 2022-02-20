import PropTypes from 'prop-types';
import React from 'react';
import routerUtil from 'utils/routerUtil';
import CSSModules from 'react-css-modules';
import { NAME } from '../../constants';
import styles from './styles.scss';

class Link extends React.PureComponent {
  handleClick = (e) => {
    e.preventDefault();
    if (this.props.to) {
      routerUtil.pushHistory(`${NAME}${this.props.to}`);
    }
  };

  render() {
    return (
      <div
        styleName={`link-${this.props.selected ? 'selected' : 'unselected'}`}
        onClick={this.handleClick}
      >
        {this.props.children}
      </div>
    );
  }
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  children: PropTypes.string,
};


export default CSSModules(Link, styles);
