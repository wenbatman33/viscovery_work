import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { localize } from '../../utils';

import styles from './LeftPaneCard.scss';

class LeftPaneCard extends React.PureComponent {


  render() {
    return (
      <div
        styleName={this.props.hideBorder ? 'container' : 'container-bordered'}
        onClick={() => {
          if (this.props.onExpandChange) { this.props.onExpandChange(this.props.eventKey); }
        }}
      >
        <div styleName="card-content">
          <div styleName="header-row">
            <div styleName="title">{this.props.title}</div>
          </div>
          <div styleName="description">
            {this.props.children}
          </div>
        </div>
        <div
          styleName="expand-state"
        >
          {
            !this.props.expanded
            ? <i className="fa fa-angle-right" aria-hidden="true" />
            : <i className="fa fa-angle-left" aria-hidden="true" />
          }
        </div>
      </div>
    );
  }
}

LeftPaneCard.defaultProps = {
  title: '',
  expanded: false,
};
LeftPaneCard.propTypes = {
  eventKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  title: PropTypes.string,
  children: PropTypes.node,
  expanded: PropTypes.bool,
  hideBorder: PropTypes.bool,
  onExpandChange: PropTypes.func,
  t: PropTypes.func,
};


export default localize(CSSModules(LeftPaneCard, styles));
