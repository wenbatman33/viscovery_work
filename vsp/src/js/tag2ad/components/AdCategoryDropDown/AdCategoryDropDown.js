import PropTypes from 'prop-types';
import React from 'react';
import { MultiLevelDL } from 'vidya/Form';
import { AdCategory } from '../../models';

import * as helper from './helper';

import { localize } from '../../utils';

export const OPTIONS = {
  CUSTOM: 1,
  DEFAULT: 2,
};

class AdCategoryDropDown extends React.PureComponent {
  state = {
    // group: helper.getCategoryGroupByOption(this.props.selected, this.props.categories),
    group: OPTIONS.DEFAULT,
  };

  // componentWillReceiveProps(nextProps) {
  //   if (!Object.is(nextProps.selected, this.props.selected)) {
  //     this.setState({
  //       group: helper.getCategoryGroupByOption(nextProps.selected, this.props.categories),
  //     });
  //   }
  // }

  BUTTON_OPTIONS = [
    {
      label: this.props.t('customAdCategories'),
      value: OPTIONS.CUSTOM,
    },
    {
      label: this.props.t('defaultAdCategories'),
      value: OPTIONS.DEFAULT,
    },
  ];

  handleGroupChange = (option) => {
    this.setState({
      group: option.value,
    });
  };

  render() {
    return (
      <MultiLevelDL
        options={helper.toDropDownOptions(
          this.props.categories, this.state.group === OPTIONS.DEFAULT)
        }
        onChange={this.props.onChange}
        selected={this.props.selected}
        placeholder={this.props.placeholder}
      />
    );
  }

}

AdCategoryDropDown.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.instanceOf(AdCategory)),
  // an option { label : 'xxx', value : 'ooo', shared: true }
  selected: PropTypes.object,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  t: PropTypes.func,
  locale: PropTypes.string,
};


export default localize(AdCategoryDropDown);
