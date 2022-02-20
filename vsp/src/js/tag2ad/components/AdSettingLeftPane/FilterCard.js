import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import routerUtil from 'utils/routerUtil';

import LeftPaneCard from '../LeftPaneCard';
import GeneralCardPlaceholder from './GeneralCardPlaceholder';

import FilterListItem from '../FilterListItem';
import styles from './FilterCard.scss';

import { getFilterById, localize, isFilterCreator } from '../../utils';

import { PATH } from '../../constants';

class FilterCard extends React.PureComponent {

  getItems = () => {
    const filterIds = this.props.selectedFilters.map(o => o.value);
    const filters = [];
    filterIds.forEach((id) => {
      const f = getFilterById(this.props.filters, id);
      if (f) { filters.push(f); }
    });

    return filters.map((filter) => {
      if (filter.isShared() === false) {
        const creator = isFilterCreator(filter, this.props.userId);
        return (
          <FilterListItem
            key={filter.id()}
            eventKey={filter.id()}
            icon={
              creator ?
                'cog' :
                null
            }
            hoverIcon={'times'}
            onIconClick={() => {
              routerUtil.pushHistory(`${PATH.CHANCE_SEARCH}/${this.props.campaignId}/filter/${filter.id()}`);
            }}
            onItemClick={() => {
              if (creator) {
                this.props.onItemClick(filter.id());
              }
            }}
            onHoverIconClick={() => {
              this.props.onRemoveClick(filter.id());
            }}
          >
            {filter.name()}
          </FilterListItem>
        );
      }
      return (
        <FilterListItem
          key={filter.id()}
          eventKey={filter.id()}
          hoverIcon={'times'}
          onHoverIconClick={() => {
            this.props.onRemoveClick(filter.id());
          }}
        >
          {filter.name()}
        </FilterListItem>
      );
    });
  };

  render() {
    return (
      <LeftPaneCard
        eventKey={this.props.eventKey}
        title={`${this.props.t('selectFilter')} *`}
        onExpandChange={() =>
          this.props.onExpandChange(this.props.eventKey)
        }
        expanded={this.props.expanded}
        hideBorder
      >
        {
          this.props.selectedFilters && this.props.selectedFilters.length > 0 ?
            <div styleName="filters">
              {this.getItems()}
            </div>
            :
            <GeneralCardPlaceholder
              text={this.props.t('emptyFilterCardPlaceholder')}
            />
        }
      </LeftPaneCard>
    );
  }
}

FilterCard.defaultProps = {};
FilterCard.propTypes = {
  eventKey: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
  onExpandChange: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
  selectedFilters: PropTypes.array,
  onRemoveClick: PropTypes.func,
  onItemClick: PropTypes.func,
  filters: PropTypes.array,
  userId: PropTypes.number,
  campaignId: PropTypes.number,
};


export default localize(CSSModules(FilterCard, styles));
