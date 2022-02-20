import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import LeftPaneCard from '../LeftPaneCard';
import FilterListItem from '../FilterListItem';
import {
  GeneralCardPlaceholder,
} from '../AdSettingLeftPane';
import { localize } from '../../utils';
import styles from './CategoryCard.scss';

class CategoryCard extends React.PureComponent {
  getItems = () => (
    this.props.selectedCategories.map(filterOption => (
      <FilterListItem
        key={filterOption.value}
        eventKey={filterOption.value}
        icon={'times'}
        onItemClick={() => this.handleItemClick(filterOption.value)}
        onIconClick={() => {
          this.props.onRemoveClick(filterOption.value);
        }}
      >
        {filterOption.label}
      </FilterListItem>
    ))
  );

  handleItemClick = (filterId) => {
    if (this.props.onItemClick) {
      this.props.onItemClick(filterId);
    }
  };

  render() {
    return (
      <LeftPaneCard
        eventKey={this.props.eventKey}
        title={this.props.t('classification')}
        onExpandChange={() =>
          this.props.onExpandChange(this.props.eventKey)
        }
        expanded={this.props.expanded}
        hideBorder
      >
        {
          this.props.selectedCategories && this.props.selectedCategories.length > 0 ?
            (
              <div styleName="categories">
                {this.getItems()}
              </div>
            )
            :
              <GeneralCardPlaceholder
                text={this.props.t('selectLookedUpCategories')}
              />
        }
      </LeftPaneCard>
    );
  }
}

CategoryCard.propTypes = {
  eventKey: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
  onExpandChange: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
  selectedCategories: PropTypes.array,
  onRemoveClick: PropTypes.func,
  onItemClick: PropTypes.func,
  categories: PropTypes.array,
};


export default localize(CSSModules(CategoryCard, styles));
