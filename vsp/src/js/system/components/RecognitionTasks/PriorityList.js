import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import style from './style.scss';

class PriorityList extends React.Component {
  handleClick = (str) => {
    this.props.handleClick(str);
  }
  render() {
    return (
      <div styleName="PriorityList">
        <h3>優先權列表</h3>
        <ul>
          {
            this.props.allLevel.map((item, index) => (
              <li
                key={index}
                onClick={() => this.handleClick(item)}
                styleName={this.props.priority === item ? 'onActive' : ''}
              >
                <a>優先級別 {item}</a>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

PriorityList.propTypes = {
  handleClick: PropTypes.func,
  allLevel: PropTypes.array,
  priority: PropTypes.string,
};

export default CSSModules(PriorityList, style);
