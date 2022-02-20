import React, { PropTypes, PureComponent } from 'react';

import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { NAME } from '../../constants';
import core from '../../../core';

import styles from './TagSelector.scss';

const propTypes = {
  t: PropTypes.func.isRequired,
  options: PropTypes.array,
  value: PropTypes.array,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
};

const defaultProps = {
  options: [],
  value: [],
  onChange: () => {},
  onClose: () => {},
};

class TagSelector extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pattern: '',
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSearch(value) {
    this.setState({
      pattern: value,
    });
  }

  handleChange(value) {
    const values = this.props.value.slice();
    for (const option of value) {
      if (values.indexOf(option.value) === -1) {
        values.push(option.value);
      }
    }
    this.props.onChange(values);
  }

  render() {
    const pattern = this.state.pattern.toLowerCase();
    return (
      <div>
        <div styleName="title">
          <span>{this.props.t('tagSelector')}</span>
          <i className="fa fa-times" onClick={this.props.onClose} />
        </div>
        <div styleName="search">
          <core.components.TextInput
            value={this.state.pattern}
            placeholder={this.props.t('searchTags')}
            onChange={this.handleSearch}
          />
        </div>
        <core.components.ExpandableSelector
          expanded={!!this.state.pattern.length}
          options={this.props.options.map(option => ({
            label: option.label,
            value: option.value,
            items: option.items.filter(o => o.label.toLowerCase().includes(pattern)),
          })).filter(option => option.items.length)}
          value={this.props.value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

TagSelector.propTypes = propTypes;
TagSelector.defaultProps = defaultProps;

export default translate([NAME])(CSSModules(TagSelector, styles));
