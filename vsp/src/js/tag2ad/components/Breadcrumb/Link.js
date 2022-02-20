import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import routerUtil from 'utils/routerUtil';
import { NAME } from '../../constants';
import styles from './Link.scss';

class Link extends React.Component {

  handleClick = (event) => {
    event.preventDefault();
    const { onSelect, eventKey } = this.props;
    routerUtil.pushHistory(`/${NAME}/${this.props.to}`);
    if (onSelect) {
      if (eventKey !== 'undefined' && eventKey !== null) { onSelect(eventKey); }
    }
  };
  render() {
    return (
      <div styleName={`link ${this.props.selected ? 'selected' : ''}`} onClick={this.handleClick}>
        {this.props.children}
      </div>
    );
  }
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  eventKey: PropTypes.number,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  children: PropTypes.node,
};


export default CSSModules(Link, styles, { allowMultiple: true });
