import React, { PropTypes, PureComponent } from 'react';

import CSSModules from 'react-css-modules';

import ExpandableItem from './ExpandableItem';

import styles from './ExpandableSelector.scss';

const propTypes = {
  expanded: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,
      items: PropTypes.array.isRequired,
    })
  ),
  value: PropTypes.array,
  onChange: PropTypes.func,
};

const defaultProps = {
  expanded: false,
  options: [],
  value: [],
  onChange: () => {},
};

class ExpandableSelector extends PureComponent {
  constructor(props) {
    super(props);

    const options = this.props.options.map(option => option.items);
    this.state = {
      options: [].concat(...options),
      entries: props.expanded ? props.options.map(option => option.value) : [],
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expanded) {
      this.setState({
        entries: nextProps.options.map(option => option.value),
      });
    } else if (nextProps.expanded !== this.props.expanded) {
      this.setState({
        entries: [],
      });
    }

    if (nextProps.options !== this.props.options) {
      const options = nextProps.options.map(option => option.items);
      this.setState({
        options: [].concat(...options),
      });
    }
  }

  handleClick(key, value) {
    if (typeof value === 'object') {
      this.handleExpand(key);
    } else {
      this.handleSelect(value);
    }
  }

  handleExpand(value) {
    const entries = this.state.entries.slice();
    const index = entries.indexOf(value);
    if (index === -1) {
      entries.push(value);
    } else {
      entries.splice(index, 1);
    }
    this.setState({
      entries,
    });
  }

  handleSelect(value) {
    const candidates = this.props.value.slice();
    const index = candidates.indexOf(value);
    if (index === -1) {
      candidates.push(value);
    } else {
      candidates.splice(index, 1);
    }

    const options = candidates
      .map(candidate => this.state.options.find(option => option.value === candidate))
      .filter(option => option);
    this.props.onChange(options);
  }

  render() {
    return (
      <div>
        {this.props.options.map(option => (
          <ExpandableItem
            key={option.value}
            label={option.label}
            items={option.items}
            expanded={this.state.entries.indexOf(option.value) !== -1}
            candidates={this.props.value}
            onClick={value => this.handleClick(option.value, value)}
          />
        ))}
      </div>
    );
  }
}

ExpandableSelector.propTypes = propTypes;
ExpandableSelector.defaultProps = defaultProps;

export default CSSModules(ExpandableSelector, styles);
