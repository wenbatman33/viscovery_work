import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './Dropdown.scss';

class Dropdown extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleHide = this.handleHide.bind(this);
    this.toggleHide = this.toggleHide.bind(this);

    this.state = {
      hide: true,
    };
  }

  componentDidMount() {
    const clickHandler = (event) => {
      if (this.button && !(this.button.contains(event.target))) {
        this.handleHide(true);
      }
    };

    window.addEventListener('click', clickHandler);
  }

  handleHide(hide) {
    this.setState({
      hide,
    });
  }

  toggleHide() {
    const { hide } = this.state;
    this.handleHide(!hide);
  }

  render() {
    const {
      style,
      children,
      dropdownMenu,
    } = this.props;

    return (
      <div
        styleName="container"
        style={style}
      >
        <div
          styleName="button"
          ref={(node) => { this.button = node; }}
          id={this.id}
          onClick={() => {
            this.toggleHide();
          }}
        >
          {children}
        </div>
        <div
          role="menu"
          styleName={this.state.hide ? 'hide' : 'dropdownMenu'}
        >
          {dropdownMenu}
        </div>
      </div>
    );
  }
}

Dropdown.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  children: PropTypes.node,
  dropdownMenu: PropTypes.node,
};

export default CSSModules(Dropdown, styles);
