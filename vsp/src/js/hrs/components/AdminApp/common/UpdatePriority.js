import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { Button } from 'vidya/Button';
import { DropdownList } from 'vidya/Form';

import styles from './AssignTask.scss';

const options = [
  {
    value: 1,
    label: 1,
  },
  {
    value: 2,
    label: 2,
  },
  {
    value: 3,
    label: 3,
  },
  {
    value: 4,
    label: 4,
  },
  {
    value: 5,
    label: 5,
  },
];

class UpdatePriority extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handlePriority = this.handlePriority.bind(this);

    this.state = {
      priority: 5,
    };
  }

  handlePriority(priority) {
    this.setState({
      priority,
    });
  }

  render() {
    return (
      <div styleName="container">
        <div styleName="dropdownList">
          <DropdownList
            options={options}
            value={this.state.priority}
            onChange={({ value }) => {
              this.handlePriority(value);
            }}
          />
        </div>
        <Button
          vdSize="icon"
          vdStyle="primary"
          onClick={() => {
            this.props.updatePriority(this.state.priority);
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

UpdatePriority.propTypes = {
  updatePriority: PropTypes.func,
  toExit: PropTypes.func,
};

export default CSSModules(UpdatePriority, styles);
