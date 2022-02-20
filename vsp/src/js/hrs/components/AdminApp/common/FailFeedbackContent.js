import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { Button } from 'vidya/Button';

import styles from './FailFeedbackContent.scss';

class FailFeedbackContent extends React.PureComponent {
  render() {
    return (
      <div styleName="container">
        <h3
          style={{
            marginBottom: '32px',
          }}
        >
          {this.props.text}
        </h3>
        <div>
          <Button
            vdSize="normal"
            vdStyle="primary"
            onClick={this.props.toExit}
            style={{
              background: '#EB5757',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              width: '100%',
            }}
          >
            瞭解了
          </Button>
        </div>
      </div>
    );
  }
}

FailFeedbackContent.propTypes = {
  text: PropTypes.string,
  toExit: PropTypes.func,
};

export default CSSModules(FailFeedbackContent, styles);
