import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { Button } from 'vidya/Button';

import styles from './Modal.scss';

class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.toHide = this.toHide.bind(this);
    this.toShow = this.toShow.bind(this);
    this.toClear = this.toClear.bind(this);
    this.switchContent = this.switchContent.bind(this);

    this.state = {
      hide: true,
      content: <div />,
      footer: <div />,
    };
  }

  switchContent(node) {
    this.setState({
      content: node,
    });
  }

  toHide() {
    this.setState({
      hide: true,
    });
  }

  toShow() {
    this.setState({
      hide: false,
    });
  }

  toClear() {
    this.setState({
      content: null,
    });
  }

  render() {
    return (
      <div
        styleName={this.state.hide ? 'base' : 'baseShow'}
        onClick={(e) => {
          if (this.props.hideWhenBackground) return;
          if (e.target === this.base) {
            this.toHide();
          }
        }}
        ref={(node) => { this.base = node; }}
      >
        <div styleName={this.state.hide ? 'box' : 'boxShow'}>
          <div styleName={this.props.headerHide ? 'header' : 'headerShow'}>
            <div styleName={this.state.hide ? 'close' : 'closeShow'}>
              <Button vdSize="secondary" vdStyle="icon" onClick={this.toHide}>
                <i className="fa fa-times" aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div styleName={this.state.hide ? 'content' : 'contentShow'}>
            {this.state.content}
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  content: PropTypes.node,
  headerHide: PropTypes.bool,
  hideWhenBackground: PropTypes.bool,
};

Modal.defaultProps = {
  headerHide: false,
  hideWhenBackground: false,
};

export default CSSModules(Modal, styles);
