import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { Button } from 'vidya/Button';
import { DropdownList } from 'vidya/Form';

import { isHrsDisptach } from '../../../utils';

import styles from './AssignTask.scss';

const getOptions = users => users.map(user => (
  {
    label: user.account,
    value: user.uid,
  }
));

class AssignTask extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleUserId = this.handleUserId.bind(this);

    this.state = {
      userId: this.props.userId,
    };
  }

  handleUserId(userId) {
    this.setState({
      userId,
    });
  }

  render() {
    return (
      <div styleName="container">
        <div styleName="dropdownList">
          <DropdownList
            options={getOptions(this.props.users.filter(isHrsDisptach))}
            value={this.state.userId}
            placeholder="選擇Hrs組員"
            onChange={({ value }) => {
              this.handleUserId(value);
            }}
          />
        </div>
        <Button
          vdSize="icon"
          vdStyle="primary"
          onClick={() => {
            this.props.updateTaskAssignee(this.state.userId);
            this.props.toExit();
          }}
          style={{
            background: '#A5DC67',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            marginRight: '8px',
          }}
        >
          <i className="fa fa-check" />
        </Button>
        <Button
          vdSize="icon"
          vdStyle="primary"
          onClick={this.props.toExit}
          style={{
            background: '#EB5757',
            border: '1px solid rgba(0, 0, 0, 0.2)',
          }}
        >
          <i className="fa fa-times" />
        </Button>
      </div>
    );
  }
}

AssignTask.propTypes = {
  userId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  users: PropTypes.arrayOf(PropTypes.object),
  updateTaskAssignee: PropTypes.func,
  toExit: PropTypes.func,
};

export default CSSModules(AssignTask, styles);
