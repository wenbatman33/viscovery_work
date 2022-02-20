/**
 * Created by amdis on 2017/7/3.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getImgHost,
  getVideoHost,
} from '../selector';

const mapStateToProps = createStructuredSelector(({
  imgHost: getImgHost,
  videoHost: getVideoHost,
}));

const ApiConfigHOC = (Component) => {
  class ApiConfig extends React.Component {
    render() {
      return (
        <Component
          {...this.props}
        />
      );
    }
  }
  ApiConfig.propTypes = {
    imgHost: PropTypes.string,
    videoHost: PropTypes.string,
  };

  return connect(mapStateToProps)(ApiConfig);
};

export default ApiConfigHOC;
