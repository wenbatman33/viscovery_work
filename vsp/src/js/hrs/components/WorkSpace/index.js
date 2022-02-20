import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import io from 'socket.io-client';

import Modal from 'vidya/Dialogs/Modal';

import {
  categorizeArray,
} from '../../utils';

import StatusBoardContainer from '../../containers/StatusBoardContainer';
import BrandsEditorContainer from '../../containers/BrandsEditorContainer';
import DrawRectPreviewContent from './DrawRectPreviewContent';
import FinishJobWindow from '../DispatchFlow/FinishJobWindow';
import GroupArea from './GroupArea';

import styles from './WorkSpace.scss';

class WorkSpace extends React.Component {
  constructor(props) {
    super(props);

    this.getTagsDetail = this.getTagsDetail.bind(this);
    this.openPreviewModal = this.openPreviewModal.bind(this);
    this.updateResult = this.updateResult.bind(this);
    this.updateMultipleResult = this.updateMultipleResult.bind(this);
    this.handleSelectedList = this.handleSelectedList.bind(this);
    this.cancelSelectAll = this.cancelSelectAll.bind(this);
    this.handleBrandsEditor = this.handleBrandsEditor.bind(this);
    this.openSubmitWindow = this.openSubmitWindow.bind(this);
    this.connectToSocketIO = this.connectToSocketIO.bind(this);

    this.state = {
      selectedList: [],
    };
  }

  componentDidMount() {
    this.getTagsDetail();

    window.onbeforeunload = () => {
      if (this.props.isUnitStackEmpty) {
        return null;
      }
      this.props.forcePatchUnitStack();
      return 'check your work?';
    };

    window.onunload = () => {
      if (this.props.isUnitStackEmpty) {
        return null;
      }
      this.props.forcePatchUnitStack();
      return 'check your work?';
    };

    if (this.props.userId) {
      this.connectToSocketIO(this.props.userId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentFilter !== this.props.currentFilter
      || nextProps.units.length === 0
    ) {
      this.cancelSelectAll();
    }

    if (nextProps.userId && nextProps.userId !== this.props.userId) {
      this.connectToSocketIO(nextProps.userId);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.currentVideoId !== this.props.currentVideoId
      || prevProps.currentBrandId !== this.props.currentBrandId
    ) this.getTagsDetail();

    window.onbeforeunload = () => {
      if (this.props.isUnitStackEmpty) {
        return null;
      }
      this.props.forcePatchUnitStack();
      return 'check your work?';
    };

    window.onunload = () => {
      if (this.props.isUnitStackEmpty) {
        return null;
      }
      this.props.forcePatchUnitStack();
      return 'check your work?';
    };
  }

  componentWillUnmount() {
    this.socketio.disconnect();
  }

  getTagsDetail() {
    const {
      currentBrandId,
      currentModelId,
      currentVideoId,
    } = this.props;
    this.props.requestTags(currentVideoId, currentModelId, currentBrandId);
    this.props.changeVisibilityFilterToDefault();
  }

  handleSelectedList(selectedList) {
    this.setState({
      selectedList,
    });
  }

  cancelSelectAll() {
    this.handleSelectedList([]);
  }

  handleBrandsEditor(selectedList) {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (selectedList.length === 0) return;
      const area = this.workspace.getBoundingClientRect();

      const {
        clientX,
        clientY,
      } = e;

      const client = {
        clientX,
        clientY,
      };

      this.contextMenu.getWrappedInstance().toShow(client, area, selectedList);
    };
  }

  openSubmitWindow() {
    this.previewModal.switchContent(
      <FinishJobWindow
        submitTask={this.props.submitTask}
        wrappedLogout={this.props.wrappedLogout}
        getDispatch={this.props.getDispatch}
        toHide={this.previewModal.toHide}
      />
    );
    this.previewModal.toShow();
  }

  openPreviewModal(previewUrl, rect, resolution) {
    return () => {
      this.previewModal.toClear();
      this.previewModal.switchContent(
        <DrawRectPreviewContent
          imageHost={this.props.imageHost}
          previewUrl={previewUrl}
          rect={rect}
          resolution={resolution}
        />
      );
      this.previewModal.toShow();
    };
  }

  updateMultipleResult(idList) {
    return result =>
      (event) => {
        event.stopPropagation();
        this.cancelSelectAll();
        this.props.updateResult(idList.map(id => (
          {
            id,
            result,
          }
        )));
      };
  }

  updateResult(id) {
    return result =>
      (event) => {
        event.stopPropagation();
        this.cancelSelectAll();
        this.props.updateResult(
          [
            {
              id,
              result,
            },
          ]
        );
      };
  }

  connectToSocketIO(userId) {
    this.socketio = io.connect(`${process.env.SIO_HOST}/socketio/hrs_operation`, {
      transports: ['websocket', 'polling'],
    });

    this.socketio.on('connect', () => {
      this.socketio.emit('online', {
        uid: userId,
      });
    });
  }

  render() {
    const categorizeArrayByGroupId = categorizeArray('group_id');
    const groupedUnits = categorizeArrayByGroupId(this.props.units);
    return (
      <div
        styleName={this.props.workNavShow ? 'normal' : 'wholeWindow'}
        onContextMenu={this.handleBrandsEditor(this.state.selectedList)}
        ref={(node) => { this.workspace = node; }}
      >
        <StatusBoardContainer
          brandId={this.props.currentBrandId}
          modelId={this.props.currentModelId}
          multipleMode={this.state.selectedList.length !== 0}
          multipleAction={this.updateMultipleResult(this.state.selectedList)}
          editTag={this.handleBrandsEditor(this.state.selectedList)}
          disabledSubmit={!this.props.isFinish}
          submit={this.openSubmitWindow}
        />
        <div styleName="fixed-height">
          <BrandsEditorContainer
            ref={(node) => { this.contextMenu = node; }}
            modelId={this.props.currentModelId}
            updateMultipleResult={this.updateMultipleResult}
          />
          {
            Object.keys(groupedUnits).sort().map(groupId =>
              <GroupArea
                key={groupId}
                imageHost={this.props.imageHost}
                units={groupedUnits[groupId]}
                groupId={groupId}
                selectedList={this.state.selectedList}
                currentFilter={this.props.currentFilter}
                brandsRef={this.props.brandsRef}
                updateMultipleResult={this.updateMultipleResult}
                updateResult={this.updateResult}
                handleBrandsEditor={this.handleBrandsEditor}
                handleParentSelectedList={this.handleSelectedList}
                cancelSelectAll={this.cancelSelectAll}
                openPreviewModal={this.openPreviewModal}
              />
            )
          }
        </div>
        <Modal
          ref={(modal) => { this.previewModal = modal; }}
          headerHide
        />
      </div>
    );
  }
}

WorkSpace.propTypes = {
  units: PropTypes.arrayOf(PropTypes.object),
  imageHost: PropTypes.string,
  requestTags: PropTypes.func,
  updateResult: PropTypes.func,
  workNavShow: PropTypes.bool,
  currentFilter: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  brandsRef: PropTypes.object,
  forcePatchUnitStack: PropTypes.func,
  isUnitStackEmpty: PropTypes.bool,
  currentModelId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  currentBrandId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  currentVideoId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  submitTask: PropTypes.func,
  submitTaskButLogout: PropTypes.func,
  changeVisibilityFilterToDefault: PropTypes.func,
  isFinish: PropTypes.bool,
  getDispatch: PropTypes.func,
  wrappedLogout: PropTypes.func,
  userId: PropTypes.number,
};

WorkSpace.defaultProps = {
  units: [],
};

export default CSSModules(WorkSpace, styles);
