import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { Button } from 'vidya/Button';

import AssignTaskContainer from '../../../../containers/AdminAppContainer/AssignTaskContainer';

import styles from './AssigneeAccount.scss';

class AssigneeAccount extends React.PureComponent {
  constructor(props) {
    super(props);

    this.buttonStatusMapping = this.buttonStatusMapping.bind(this);
    this.handleStage = this.handleStage.bind(this);


    this.state = {
      stage: 0,
    };
  }

  buttonStatusMapping(status) {
    switch (status) {
      case 0:
        return (
          <Button
            vdSize="label"
            vdStyle="secondary"
            onClick={() => {
              this.handleStage(1);
            }}
          >
            分派
          </Button>
        );
      case 1:
        return (
          <Button
            vdSize="label"
            vdStyle="secondary"
            onClick={() => {
              this.handleStage(1);
            }}
          >
            重新分派
          </Button>
        );
      default:
        return null;
    }
  }

  handleStage(stage) {
    this.setState({
      stage,
    });
  }

  render() {
    const {
      assigneeName,
      toUserClick,
      status,
    } = this.props;
    return (
      <div styleName="container">
        {
          this.state.stage === 0 && assigneeName ?
            <p
              styleName="assigneeName"
              onClick={toUserClick}
            >
              {assigneeName}
            </p>
          : null
        }
        {
          this.state.stage === 0 ?
            this.buttonStatusMapping(status)
          :
            <AssignTaskContainer
              userId={this.props.assigneeId}
              updateTaskAssignee={this.props.updateOneTaskAssignee}
              toExit={() => { this.handleStage(0); }}
            />
        }
      </div>
    );
  }
}

AssigneeAccount.propTypes = {
  assigneeName: PropTypes.string,
  assigneeId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  toUserClick: PropTypes.func,
  updateOneTaskAssignee: PropTypes.func,
  status: PropTypes.number,
};

export default CSSModules(AssigneeAccount, styles);
