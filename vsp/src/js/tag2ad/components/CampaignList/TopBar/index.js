import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { Button } from 'vidya/Button';
import { Interpolate } from 'react-i18next';

import { localize } from '../../../utils';
import styles from './TopBar.scss';

import SearchBox from './SearchBox';

class TopBar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.renderTopBar = this.renderTopBar.bind(this);
  }

  renderTopBar() {
    const { campaigns,
            currentPage,
            totalPageCount,
            totalCampaignCount,
            handleChangePage,
            setSearchText,
            handleSubmitSearch,
            isCampaignExist,
            onePageCount,
            t,
          } = this.props;
    const isMeetCampaigns = campaigns.length > 0;

    return (
      <div styleName="top-bar">
        <div>
          <Button
            vdStyle={`${isCampaignExist ? 'secondary' : 'primary'}`}
            style={{ marginRight: '25px', height: '34px', borderRadius: '0' }}
            onClick={this.props.addCampaign}
          >
            {t('add_campaign')}
          </Button>
          {
            isCampaignExist ?
              <SearchBox
                setSearchText={setSearchText}
                handleSubmitSearch={handleSubmitSearch}
              /> :
              null
          }
        </div>
        {
          isCampaignExist ?
            <div>
              <Interpolate
                i18nKey="campaignPagination"
                total={totalCampaignCount}
                from={campaigns.length > 0 ? ((currentPage - 1) * onePageCount) + 1 : 0}
                to={((currentPage - 1) * onePageCount) + campaigns.length}
                page={currentPage}
              />
              <Button
                vdStyle="secondary"
                style={{ marginLeft: '8px', borderRadius: '0' }}
                disable={!isMeetCampaigns || currentPage === 1}
                onClick={() => handleChangePage(currentPage - 1)}
              >
                <i className="fa fa-angle-left" />
              </Button>
              <Button
                vdStyle="secondary"
                style={{ marginLeft: '8px', borderRadius: '0' }}
                disable={!isMeetCampaigns || currentPage === totalPageCount}
                onClick={() => handleChangePage(currentPage + 1)}
              >
                <i className="fa fa-angle-right" />
              </Button>
            </div> :
            null
        }
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderTopBar()}
      </div>
    );
  }
}

TopBar.propTypes = {
  t: PropTypes.func,
  campaigns: PropTypes.arrayOf(
    PropTypes.shape({
      campaign_id: PropTypes.number,
    }),
  ),
  isCampaignExist: PropTypes.bool,
  setSearchText: PropTypes.func,
  handleSubmitSearch: PropTypes.func,
  currentPage: PropTypes.number,
  totalPageCount: PropTypes.number,
  totalCampaignCount: PropTypes.number,
  onePageCount: PropTypes.number,
  handleChangePage: PropTypes.func,
  addCampaign: PropTypes.func,
};

export default localize(CSSModules(TopBar, styles));
