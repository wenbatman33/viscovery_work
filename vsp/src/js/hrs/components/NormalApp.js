import PropTypes from 'prop-types';
import React from 'react';
import { Route } from 'react-router-dom';
import CSSModules from 'react-css-modules';

import WorkNavContainer from '../containers/WorkNavContainer';
import WorkSpaceContainer from '../containers/WorkSpaceContainer';

import styles from './NormalApp.scss';

const NormalApp = ({ match, params: { videoId, modelId, brandId } }) => (
  <div styleName="container">
    <WorkNavContainer
      videoId={videoId}
      modelId={modelId}
      brandId={brandId}
    />
    <Route path={`${match.url}/model/:modelId/brand/:brandId`} component={WorkSpaceContainer} />
  </div>
);

NormalApp.propTypes = {
  match: PropTypes.object,
  params: PropTypes.object,
};

export default CSSModules(NormalApp, styles);
