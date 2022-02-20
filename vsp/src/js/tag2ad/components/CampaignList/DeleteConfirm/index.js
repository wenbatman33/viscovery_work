import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import Button from 'vidya/Button/Button';
import { Checkbox } from 'vidya/Form';

import {
  localize,
} from '../../../utils';

import styles from './DeleteConfirm.scss';

class DeleteConfirm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleConfirm = this.handleConfirm.bind(this);

    this.state = {
      confirmed: false,
    };
  }

  handleConfirm(confirmed) {
    this.setState({
      confirmed,
    });
  }

  render() {
    const { t, cancel, deleteCallback } = this.props;
    return (
      <div styleName="container">
        <div styleName="content">
          <div styleName="header">
            <h2>{t('sure_delete_campaign')}</h2>
          </div>
          <div styleName="body">
            <div>{t('batch_delete_unrecoverable')}</div>
            <div
              style={{
                marginTop: '12px',
              }}
            >
              <Checkbox
                style={{
                  display: 'inline-block',
                  marginRight: '10px',
                }}
                checked={this.state.confirmed}
                onChange={this.handleConfirm}
              />
              <p>{t('delete_campaign_include')}</p>
            </div>
          </div>
        </div>
        <div styleName="footer">
          <Button
            vdSize="normal"
            vdStyle="secondary"
            onClick={cancel}
          >{t('cancel')}</Button>
          <Button
            vdSize="normal"
            vdStyle="primary"
            onClick={deleteCallback}
            disable={!this.state.confirmed}
          >{t('confirm')}</Button>
        </div>
      </div>
    );
  }
}

DeleteConfirm.propTypes = {
  deleteCallback: PropTypes.func,
  cancel: PropTypes.func,
  t: PropTypes.func,
};

export default localize(CSSModules(DeleteConfirm, styles));
