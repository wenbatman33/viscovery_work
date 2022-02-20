import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './styles.scss';

class TabGroup extends React.Component {

  render() {
    const { tabs, selected } = this.props;

    return (
      <div styleName="tab-group">
        {tabs.map(tab => (
          <h3
            key={tab.model_name}
            styleName={`tab${selected === tab.model_id ? '-selected' : ''}`}
            onClick={() => this.props.onChange(tab.model_id)}
          >
            {tab.model_name}

          </h3>
        ))}
      </div>
    );
  }
}

TabGroup.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    model_name: PropTypes.string,
    model_id: PropTypes.number,
  })),
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.number,
};

export default CSSModules(TabGroup, styles);
