import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { createStructuredSelector } from 'reselect';

import { Modal } from 'vidya/Dialogs';
import { Button } from 'vidya/Button';

import { redoUpload, removeUpload, processUpload, cancelUpload } from '../../actions';
import { CheckForm, UploadStatusIndicator } from '../../components';
import { NAME } from '../../constants';
import { filterPendingUploads, filterActiveUploads } from '../../models';
import { getUploads } from '../../selectors';


import styles from './styles.scss';

const MAX_SIMULTANEOUS_UPLOADS = 3;
const UNLOAD_MESSAGE = '影片正在上傳中，確定要離開嗎？';

class UploadContainer extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    t: PropTypes.func,
    route: PropTypes.object,
    router: PropTypes.object,
    uploads: PropTypes.array,
  };

  componentDidMount() {
    this.checkUploads();
    window.addEventListener('beforeunload', this.handleUnload);
    if (this.props.route) {
      this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    }
  }

  componentDidUpdate() {
    this.checkUploads();
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload);
  }

  handleUnload = (event) => {
    const pending = filterPendingUploads(this.props.uploads);
    const active = filterActiveUploads(this.props.uploads);
    if (pending.length || active.length) {
      /* eslint-disable no-param-reassign */
      event.returnValue = UNLOAD_MESSAGE;
      /* eslint-enable */
      return UNLOAD_MESSAGE;
    }
    return null;
  };

  checkUploads = () => {
    const pending = filterPendingUploads(this.props.uploads);
    const active = filterActiveUploads(this.props.uploads);
    if (!pending.length || active.length >= MAX_SIMULTANEOUS_UPLOADS) {
      return;
    }

    const upload = pending[0];
    const action = processUpload(upload);
    this.props.dispatch(action);
  };

  handleUploadCancel = (upload) => {
    const { t } = this.props;
    const handleCancel = () => {
      this.form.toHide();
    };
    const handleSubmit = () => {
      if (upload) {
        const action = cancelUpload(upload);
        this.props.dispatch(action);
      }
      this.form.toHide();
    };
    const form = (
      <CheckForm
        message={t('cancelUploadConfirmation')}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    );
    this.form.switchContent(form);
    this.form.toShow();
  };

  handleRedoUpload = (upload) => {
    if (upload) {
      const action = redoUpload(upload);
      this.props.dispatch(action);
    }
  };

  handleFullUploadCancel = (uploads) => {
    const NewModal = CSSModules(this.returnModal, styles);
    this.alertModal.switchContent(<NewModal uploads={uploads} />);
    this.alertModal.toShow();
  };

  routerWillLeave = () => {
    const pending = filterPendingUploads(this.props.uploads);
    const active = filterActiveUploads(this.props.uploads);
    if (pending.length || active.length) {
      return UNLOAD_MESSAGE;
    }
    return null;
  };

  returnModal = ({ uploads }) => {
    const { t } = this.props;
    return (
      <div styleName="modalBox">
        <div styleName="modalText">
          {t('cancelUploadsConfirmation')}
        </div>
        <div styleName="modalBtnGroup">
          <div styleName="modalBtn">
            <Button
              vdStyle="secondary"
              vdSize="normal"
              onClick={() => this.alertModal.toHide()}
            >
              {t('cancel')}
            </Button>
          </div>
          <div styleName="modalBtn">
            <Button
              vdStyle="primary"
              vdSize="normal"
              onClick={() => {
                uploads.forEach((upload) => {
                  if (upload.status === 1) {
                    const action = cancelUpload(upload);
                    this.props.dispatch(action);
                  }
                  const action = removeUpload(upload);
                  this.props.dispatch(action);
                });
                this.alertModal.toHide();
              }}
            >
              {t('submit')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { handleUploadCancel, handleRedoUpload, handleFullUploadCancel } = this;
    const { uploads } = this.props;
    return (
      <div>
        {uploads.length
          ? (
            <UploadStatusIndicator
              uploads={uploads}
              onDelete={handleUploadCancel}
              onRedo={handleRedoUpload}
              onFullDelete={handleFullUploadCancel}
            />
          )
          : null
        }
        <Modal headerHide hideWhenBackground ref={(node) => { this.form = node; }} />
        <Modal headerHide hideWhenBackground ref={(node) => { this.alertModal = node; }} />
      </div>
    );
  }
}

export default translate([NAME])(connect(
  createStructuredSelector({
    uploads: getUploads,
  })
)(withRouter(UploadContainer)));
