import PropTypes from 'prop-types';
import React from 'react';
import { Checkbox } from 'vidya/Form';

import { Button } from 'vidya/Button';

import CSSModules from 'react-css-modules';
import styles from './BatchDeleteForm.scss';
import { localize } from '../../utils';


class BatchDeleteForm extends React.PureComponent {
  state = {
    checked: false,
  };

  handleCancel = () => {
    this.props.onCancel();
    this.reset();
  };

  handleConfirm = () => {
    this.props.onConfirm();
    this.reset();
  };

  reset = () => {
    this.setState({
      checked: false,
    });
  };

  handleChange = (checked) => {
    this.setState({ checked });
  };

  render() {
    return (
      <div styleName="container">
        <h2 styleName="title">
          {this.props.title}
        </h2>
        <div styleName="description">{this.props.t('batch_delete_unrecoverable')}</div>
        <div styleName="statement">
          <Checkbox
            style={{ marginRight: '30px' }}
            checked={this.state.checked}
            onChange={this.handleChange}
          />
          {this.props.message}
        </div>
        <div styleName="btn-group">
          <Button
            vdStyle={'secondary'}
            onClick={this.handleCancel}
          >
            {this.props.t('cancel')}
          </Button>
          <Button
            vdStyle={'primary'}
            disable={!this.state.checked}
            onClick={this.handleConfirm}
          >
            {this.props.t('confirm')}
          </Button>
        </div>
      </div>
    );
  }
}

BatchDeleteForm.propTypes = {
  t: PropTypes.func,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  title: PropTypes.node.isRequired,
  message: PropTypes.string.isRequired,
};


export default localize(CSSModules(BatchDeleteForm, styles));
