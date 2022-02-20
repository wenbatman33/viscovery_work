import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import CustomList from './CustomList';
import * as helper from './helper';


import { NAME } from '../../constants';
import core from '../../../core';

import styles from './SharedCustomItemSelector.scss';

const propTypes = {
  options: PropTypes.array,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      shared: PropTypes.bool,
    })
  ),
  onChange: PropTypes.func,
  customList: PropTypes.element,
  inputPlaceholder: PropTypes.string,
  t: PropTypes.func,
  defaultTab: PropTypes.oneOf([0, 1]),
  withTabs: PropTypes.bool,
};

const defaultProps = {
  options: [],
  value: [],
  defaultTab: 0,
  withTabs: true,
};

const hoc = (Component, injectProps) => React.cloneElement(Component, injectProps, null);

class SharedCustomItemSelector extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tab: this.props.defaultTab,
      pattern: '',
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCustomListChange = this.handleCustomListChange.bind(this);
    this.getNextValues = this.getNextValues.bind(this);
  }

  getNextValues(prevOptions, newOptions) {
    const added = helper.computeAdded(prevOptions, newOptions);
    const removed = helper.computeRemoved(prevOptions, newOptions);

    let nextValues = this.props.value.slice();

    added.forEach(option => nextValues.push(option));
    removed.forEach((option) => {
      nextValues = helper.removeOptionByValue(nextValues, option.value);
    });

    return nextValues;
  }

  handleChange(options) {
    const prevShared = helper.optionFilter(this.props.value, true);
    const nextValues = this.getNextValues(prevShared, prevShared.concat(options));

    if (this.props.onChange) { this.props.onChange(nextValues); }
  }

  handleCustomListChange(options) {
    const prevCustoms = helper.optionFilter(this.props.value, false);
    const nextValues = this.getNextValues(prevCustoms, prevCustoms.concat(options));

    if (this.props.onChange) { this.props.onChange(nextValues); }
  }

  handleSearch(value) {
    this.setState({
      pattern: value,
    });
  }

  render() {
    const { customList, withTabs } = this.props;
    const value = this.props.value.map(v => v.value);
    const ReplacedCustomList = this.props.customList;
    const customListProps = {
      options: helper.optionFilter(this.props.options, false, this.state.pattern),
      values: value,
      onChange: this.handleCustomListChange,
    };

    return (
      <div styleName="container">
        {withTabs
          ? (
            <div styleName="tabs">
              <span styleName={this.state.tab === 0 ? 'active' : ''} onClick={() => { this.setState({ tab: 0 }); }}>
                {this.props.t('recommendedFilters')}
              </span>
              <span styleName={this.state.tab === 1 ? 'active' : ''} onClick={() => { this.setState({ tab: 1 }); }}>
                {this.props.t('custom')}
              </span>
            </div>
          )
          : null
        }
        <div styleName="search">
          <core.components.TextInput
            value={this.state.pattern}
            placeholder={this.props.inputPlaceholder}
            onChange={this.handleSearch}
          />
        </div>
        {
          this.state.tab === 0 ?
            <core.components.ExpandableSelector
              expanded={!!this.state.pattern.length}
              options={helper.optionFilter(this.props.options, true, this.state.pattern)}
              value={value}
              onChange={this.handleChange}
            /> :
            null
        }
        {
          this.state.tab === 1 && (customList === undefined || customList === null) ?
            <CustomList
              {...customListProps}
            /> :
            null
        }
        {
          this.state.tab === 1 && (customList !== undefined && customList !== null) ?
            hoc(ReplacedCustomList, customListProps)
            :
            null
        }
      </div>
    );
  }
}

SharedCustomItemSelector.propTypes = propTypes;
SharedCustomItemSelector.defaultProps = defaultProps;

export default translate([NAME])(CSSModules(SharedCustomItemSelector, styles));
