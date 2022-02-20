import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import CSSModules from 'react-css-modules';
import { DropTarget } from 'react-dnd';

import { MEMBER } from './itemTypes';

import Member from './Member';
import { sortByKey } from '../../utils';

import styles from './MapArea.scss';

const mapAreaTarget = {
  drop: (props, monitor) => {
    const {
      shiftId: preShiftId,
      memberUid,
    } = monitor.getItem();

    const {
      updateShiftMap,
      postShiftMap,
    } = props;

    if (!preShiftId) {
      return postShiftMap(memberUid);
    }

    return updateShiftMap(preShiftId)(memberUid);
  },
};

export const collect = (connect, monitor) => (
  {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }
);

class MapArea extends PureComponent {
  render() {
    const {
      members,
      shiftName,
      shiftId,
      deleteShiftMap,
      connectDropTarget,
      isOver,
    } = this.props;

    return connectDropTarget(
      <div
        style={{
          width: '100%',
          padding: '16px',
          background: 'white',
          borderRadius: '4px',
        }}
        styleName={isOver ? 'over' : null}
      >
        <h2>
          {`${shiftName}（${members.length}）`}
          <hr
            styleName="line"
            style={{
              margin: '16px 0',
            }}
          />
        </h2>
        <div
          style={{
            marginBottom: '20px',
          }}
        >
          {
            members.sort(sortByKey('account')).map(ele =>
              <Member
                key={ele.uid}
                memberName={ele.account}
                memberUid={ele.uid}
                shiftId={shiftId}
                deletable
                deleteShiftMap={() => deleteShiftMap(ele.uid)}
              />
            )
          }
        </div>
      </div>
    );
  }
}

MapArea.propTypes = {
  shiftName: PropTypes.string,
  shiftId: PropTypes.number,
  members: PropTypes.arrayOf(PropTypes.object),
  deleteShiftMap: PropTypes.func,
  updateShiftMap: PropTypes.func,
  postShiftMap: PropTypes.func,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
};

export default DropTarget(MEMBER, mapAreaTarget, collect)(CSSModules(MapArea, styles));
