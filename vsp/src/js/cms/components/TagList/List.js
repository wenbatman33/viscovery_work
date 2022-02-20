import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './styles.scss';

class List extends React.Component {
  static propTypes = {
    labels: PropTypes.arrayOf(
      PropTypes.string
    ).isRequired,
    index: PropTypes.number.isRequired,
    onSelect: PropTypes.func,
  };

  static defaultProps = {
    labels: [],
    index: -1,
  };

  state = {
    index: this.props.index,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      index: nextProps.index,
    });
  }

  handleSelect = (index) => {
    this.setState({
      index,
    });

    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(index);
    }
  };

  render() {
    const { handleSelect } = this;
    const { labels } = this.props;
    return (
      <div styleName="list">
        {labels.map((label, index) => (
          <div key={index} styleName={index === this.state.index ? 'item selected' : 'item'} onClick={() => handleSelect(index)}>
            {label}
          </div>
        ))}
      </div>
    );
  }
}

export default CSSModules(List, styles, { allowMultiple: true });
