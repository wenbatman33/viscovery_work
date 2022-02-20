import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getVersion } from '../selectors';

const BUILD_BASE_URL = 'http://jenkins.viscovery.com:58080/job/vsp-dev/';
const VSP_BASE_URL = 'http://git-cn.viscovery.co/dreamcwli/vsp/commits/';
const VDS_BASE_URL = 'http://git-cn.viscovery.co/morton/vds3/commits/';

class LandingPage extends React.Component {
  render() {
    const { version } = this.props;
    const build = version ? version.split('.')[2] : null;
    return (
      <div>
        <h3>
          Build:{' '}
          <a href={build ? `${BUILD_BASE_URL}${build}/` : '#'}>
            {version || 'development'}
          </a>
        </h3>
        <h3>
          VSP:{' '}
          <a href={version ? VSP_BASE_URL + version : '#'}>
            {version || 'development'}
          </a>
        </h3>
        <h3>
          VDS:{' '}
          <a href={version ? VDS_BASE_URL + version : '#'}>
            {version || 'development'}
          </a>
        </h3>
      </div>
    );
  }
}

LandingPage.propTypes = {
  version: PropTypes.string,
};

export default connect(
  createStructuredSelector({
    version: getVersion,
  })
)(LandingPage);
