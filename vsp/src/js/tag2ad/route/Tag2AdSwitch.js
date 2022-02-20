import React from 'react';
import PropTypes from 'prop-types';

import { Redirect, Switch, Route } from 'react-router-dom';

import { PATH } from '../constants';
import FilterEditorContainer from '../containers/FilterEditorContainer';

import AdPodLeftPaneContainer from '../containers/AdPodLeftPaneContainer';
import AdPodManageContainer from '../containers/AdPodManageContainer';

import AdSettingLeftPaneContainer from '../containers/AdSettingLeftPaneContainer';
import AdSettingContainer from '../containers/AdSettingContainer.js';
import CampaignListContainer from '../containers/CampaignListContainer';

import TwoPaneRoute from './TwoPaneRoute';

const Tag2AdSwitch = ({ match }) => (
  <Switch>
    <Route exact path={PATH.CAMPAIGN_LIST} component={CampaignListContainer} />
    <TwoPaneRoute
      exact
      path={`${PATH.AD_POD_SEARCH}/:campaignId`}
      sidebar={AdPodLeftPaneContainer}
      main={AdPodManageContainer}
    />
    <TwoPaneRoute
      exact
      path={`${PATH.CHANCE_SEARCH}/:campaign`}
      sidebar={AdSettingLeftPaneContainer}
      main={AdSettingContainer}
    />
    <TwoPaneRoute
      exact
      path={`${PATH.CHANCE_SEARCH}/:campaign/filter`}
      sidebar={AdSettingLeftPaneContainer}
      main={FilterEditorContainer}
    />
    <TwoPaneRoute
      exact
      path={`${PATH.CHANCE_SEARCH}/:campaign/filter/:id`}
      sidebar={AdSettingLeftPaneContainer}
      main={FilterEditorContainer}
    />
    <Redirect from={match.url} to={PATH.CAMPAIGN_LIST} />
  </Switch>
);

Tag2AdSwitch.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Tag2AdSwitch;
