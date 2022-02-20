import PropTypes from 'prop-types';
import React from 'react';

import CSSModules from 'react-css-modules';
import styles from '../../styles/pagination.scss';

class PageButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { disabled, onSelect, eventKey } = this.props;

    if (disabled) {
      return;
    }

    if (onSelect) {
      onSelect(eventKey, event);
    }
  }

  render() {
    const { active, disabled } = this.props;
    let cls = '';
    if (active) {
      cls = 'active';
    } else if (disabled) {
      cls = 'disabled';
    }

    return (
      <li styleName={cls} onClick={this.handleClick}>
        {this.props.label}
      </li>
    );
  }
}

PageButton.propTypes = {
  label: PropTypes.node.isRequired,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  onSelect: PropTypes.func,
  eventKey: PropTypes.number,
};

export default CSSModules(PageButton, styles);
