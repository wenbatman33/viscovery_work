import React, { PropTypes, PureComponent } from 'react';

import CSSModules from 'react-css-modules';

import core from '../../../core';

import styles from './CriterionEditor.scss';

const propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,
    })
  ),
  ratios: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ),
  ratio: PropTypes.number,
  durations: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ),
  duration: PropTypes.number,
  onTagAdd: PropTypes.func,
  onTagRemove: PropTypes.func,
  onRatioChange: PropTypes.func,
  onDurationChange: PropTypes.func,
  onRemove: PropTypes.func,
};

const defaultProps = {
  tags: [],
  ratios: [],
  ratio: -1,
  durations: [],
  duration: -1,
  onTagAdd: () => {},
  onTagRemove: () => {},
  onRatioChange: () => {},
  onDurationChange: () => {},
  onRemove: () => {},
};

class CriterionEditor extends PureComponent {
  constructor(props) {
    super(props);

    this.handleRatioChange = this.handleRatioChange.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
  }

  handleRatioChange(option) {
    this.props.onRatioChange(option.value);
  }

  handleDurationChange(option) {
    this.props.onDurationChange(option.value);
  }

  render() {
    return (
      <div styleName="container">
        <div styleName="tags">
          {this.props.tags.map(tag => (
            <core.components.Tag
              key={tag.value}
              label={tag.label}
              value={tag.value}
              onDelete={this.props.onTagRemove}
            />
          ))}
          <span onClick={this.props.onTagAdd}>+</span>
        </div>
        <div styleName="selections">
          <core.components.DropdownList
            options={this.props.ratios}
            value={this.props.ratio}
            onChange={this.handleRatioChange}
          />
          <core.components.DropdownList
            options={this.props.durations}
            value={this.props.duration}
            onChange={this.handleDurationChange}
          />
        </div>
        <div styleName="actions">
          <i className="fa fa-times" onClick={this.props.onRemove} />
        </div>
      </div>

    );
  }
}

CriterionEditor.propTypes = propTypes;
CriterionEditor.defaultProps = defaultProps;

export default CSSModules(CriterionEditor, styles);
