import PropTypes from 'prop-types';
import React from 'react';

import CSSModules from 'react-css-modules';

import routerUtil from 'utils/routerUtil';
import { Button } from 'vidya/Button';
import Summary from '../Summary';
import { PATH } from '../../../constants';
import { localize } from '../../../utils';

import styles from './SummaryAtionBar.scss';


class SummaryActionBar extends React.PureComponent {
  render() {
    return (
      <div styleName="container">
        {
          !this.props.hideSummary ?
            <Summary
              adCount={this.props.totalAds}
              videoCount={this.props.totalVideos}
            />
            :
            <div />
        }
        <div styleName="btn-container">
          {
            !this.props.hideSelectAll ?
              <Button
                vdStyle="secondary"
                disable={this.props.disableSelectAll}
                onClick={this.props.onSelectAll}
              >
                {this.props.t('operateAllAds')}
              </Button>
              :
              null
          }
          <Button
            vdStyle="primary"
            onClick={() => {
              routerUtil.pushHistory(`${PATH.CHANCE_SEARCH}/${this.props.campaignId}`);
            }}
          >
            {this.props.t('addAds')}
          </Button>
        </div>
      </div>
    );
  }
}

SummaryActionBar.propTypes = {
  t: PropTypes.func,
  totalAds: PropTypes.number.isRequired,
  totalVideos: PropTypes.number.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  campaignId: PropTypes.number.isRequired,
  hideSelectAll: PropTypes.bool,
  hideSummary: PropTypes.bool,
  disableSelectAll: PropTypes.bool,
};


export default localize(CSSModules(SummaryActionBar, styles));
