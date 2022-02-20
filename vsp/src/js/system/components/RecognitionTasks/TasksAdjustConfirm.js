import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import style from './style.scss';

class TasksAdjustConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clickLevel: '' };
  }
  componentWillMount() {
    this.setState({ clickLevel: this.props.priority });
  }
  showTasksAdjustConfirm = () => {
    this.props.showTasksAdjustConfirm();
  }
  selectLevel =(level) => {
    this.state = { clickLevel: '' };
    this.setState({ clickLevel: level });
  }

  adjustConfirm = () => {
    this.props.adjustConfirm(this.state.clickLevel);
  }
  render() {
    return (
      <div styleName="TasksAdjustConfirm">
        <h3 styleName="title">調整優先級</h3>
        <p>選擇調整優先級為：</p>
        <div styleName="btn-group">
          {
            this.props.allLevel.map((item, index) => (
              <button
                type="button"
                key={index}
                styleName={this.state.clickLevel === item ? 'active' : 'btn'}
                onClick={() => this.selectLevel(item)}
              >
                {item}
              </button>
            ))
          }
        </div>
        <div styleName="btn-ConfirmGroup">
          <button styleName="button" onClick={() => this.showTasksAdjustConfirm()}>取消</button>
          <button styleName="btn__primary" onClick={() => this.adjustConfirm()} >確認</button>
        </div>
      </div>
    );
  }
}

TasksAdjustConfirm.propTypes = {
  priority: PropTypes.string,
  allLevel: PropTypes.array,
  showTasksAdjustConfirm: PropTypes.func,
  adjustConfirm: PropTypes.func,
};

export default CSSModules(TasksAdjustConfirm, style);
