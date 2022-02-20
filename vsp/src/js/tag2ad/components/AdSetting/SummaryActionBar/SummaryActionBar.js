import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import routerUtil from 'utils/routerUtil';
import { Button } from 'vidya/Button';
import {
  Summary,
} from '../../AdPodManagement';
import { localize } from '../../../utils';
import { PATH } from '../../../constants';
import styles from './SummaryAtionBar.scss';


class SummaryActionBar extends React.PureComponent {
  render() {
    return (
      <div styleName="container">
        {
          !this.props.hideSummary ?
            <Summary
              adCount={this.props.totalChances}
              videoCount={this.props.totalVideos}
            />
            :
            <div />
        }
        <div styleName="btn-container">
          {
            !this.props.hideSelectAll ?
              <Button
                vdStyle={'secondary'}
                onClick={this.props.onSelectAll}
                disable={this.props.disableSelectAll}
              >
                {this.props.t('operateAllAds')}
              </Button>
              :
              null
          }
          <Button
            vdStyle={'primary'}
            onClick={() => {
              routerUtil.pushHistory(`${PATH.AD_POD_SEARCH}/${this.props.campaignId}`);
            }}
          >
            {this.props.t('settingComplete')}
          </Button>
        </div>
      </div>
    );
  }
}

SummaryActionBar.propTypes = {
  t: PropTypes.func,
  totalChances: PropTypes.number.isRequired,
  totalVideos: PropTypes.number.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  campaignId: PropTypes.number.isRequired,
  hideSelectAll: PropTypes.bool,
  hideSummary: PropTypes.bool,
  disableSelectAll: PropTypes.bool,
};


export default localize(CSSModules(SummaryActionBar, styles));
