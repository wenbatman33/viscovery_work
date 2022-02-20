import React from 'react';
import PropTypes from 'prop-types';
import routerUtil from 'utils/routerUtil';
import CSSModules from 'react-css-modules';

import FilterListItem from '../FilterListItem';
import { PATH } from '../../constants';
import styles from '../SharedCustomItemSelector/CustomList.scss';
import * as helper from './helper';

import CustomFilterGroupLabel from './CustomFilterGroupLabel';
import GroupFilterList from './GroupFilterList';
import MyFilterList from './MyFilterList';

import {
  localize,
} from '../../utils';

export const FAKE_CREATE_ID = -99;

class FilterCustomList extends React.PureComponent {

  handleItemClick = (eventKey) => {
    if (eventKey === FAKE_CREATE_ID) {
      routerUtil.pushHistory(`${PATH.CHANCE_SEARCH}/${this.props.campaignId}/filter`);
      return;
    }

    const nextOptions = this.props.options.filter(option =>
      this.props.values.indexOf(option.value) > -1);
    const index = nextOptions.findIndex(o => o.value === eventKey);

    if (index > -1) {
      nextOptions.splice(index, 1);
    } else {
      const option = this.props.options.find(o => o.value === eventKey);
      if (option !== null) {
        nextOptions.push(option);
      }
    }

    this.props.onChange(nextOptions);
  };

  handleIconClick = (eventKey) => {
    routerUtil.pushHistory(`${PATH.CHANCE_SEARCH}/${this.props.campaignId}/filter/${eventKey}`);
  };

  _optionFilter = option => !this.props.values.includes(option.value);


  render() {
    const mine = this.props.options.filter(helper.myFilterOption).filter(this._optionFilter);
    const group = this.props.options.filter(helper.groupFilterOption).filter(this._optionFilter);

    return (
      <div>
        <div styleName="container">
          <FilterListItem
            eventKey={FAKE_CREATE_ID}
            onItemClick={this.handleItemClick}
            onIconClick={() => this.handleItemClick(FAKE_CREATE_ID)}
            icon={'plus'}
            hoverIcon={'none'}
          >
            {this.props.t('newFilter')}
          </FilterListItem>
        </div>
        {
          mine.length > 0 ?
            (
              <CustomFilterGroupLabel>
                {this.props.t('myFilters')}
              </CustomFilterGroupLabel>
            )
            : null
        }
        {
          mine.length > 0 ?
            <MyFilterList
              options={mine}
              onItemClick={this.handleItemClick}
              onIconClick={this.handleIconClick}
              onHoverIconClick={this.props.onRemoveFilter}
            />
            : null
        }
        {
          group.length > 0 ?
            (
              <CustomFilterGroupLabel>
                {this.props.t('groupFilters')}
              </CustomFilterGroupLabel>
            )
            : null
        }
        {
          group.length > 0 ?
            <GroupFilterList
              options={group}
              onItemClick={this.handleItemClick}
              onIconClick={this.handleIconClick}
              onHoverIconClick={this.props.onRemoveFilter}
            />
            : null
        }
      </div>
    );
  }
}

FilterCustomList.defaultProps = {
  options: [],
};
FilterCustomList.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      shared: PropTypes.bool,
      creator: PropTypes.bool,
    })
  ),
  onChange: PropTypes.func,
  // array of option values, eg. array of filter IDs
  values: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])
  ),
  onRemoveFilter: PropTypes.func.isRequired,
  t: PropTypes.func,
  campaignId: PropTypes.number,
};


export default localize(CSSModules(FilterCustomList, styles));
