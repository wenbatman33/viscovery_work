/**
 * Created by amdis on 2017/4/26.
 */

import React from 'react';
import PropTypes from 'prop-types';
import AdSettingLeftPane from '../containers/AdSettingLeftPaneContainer';

class Sandbox extends React.Component {
  state = {
    expanded: false,
  };

  render() {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
        }}
      >
        <div>
          <AdSettingLeftPane disabled={!!this.props.children} />
        </div>
        <div style={{ flex: 1, borderTop: '1px solid rgba(26, 10, 10, 0.2)' }}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Sandbox.propTypes = {
  children: PropTypes.node,
};

export default Sandbox;
