import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { DragSource } from 'react-dnd';

import FAIcon from 'vidya/Freddicons/FAIcon';

import styles from './Member.scss';

import { MEMBER } from './itemTypes';


const memberSource = {
  beginDrag(props) {
    const {
      memberUid,
      shiftId,
    } = props;
    return {
      memberUid,
      shiftId,
    };
  },
};

const collect = (connect, monitor) => (
  {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
);


const Member = (
    { memberName, deletable, deleteShiftMap, connectDragSource, isDragging }
  ) => (
  connectDragSource(
    <div
      styleName="container"
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
        }}
      >
        <p>
          {memberName}
        </p>
        {
          deletable ?
            <FAIcon
              className={styles.icon}
              faClassName="fa-times"
              style={{
                position: 'absolute',
                right: '0',
                cursor: 'pointer',
              }}
              onClick={deleteShiftMap}
            /> : null
        }
      </div>
    </div>
  )
);

Member.propTypes = {
  memberName: PropTypes.string,
  memberUid: PropTypes.number,
  ShiftId: PropTypes.number,
  deletable: PropTypes.bool,
  deleteShiftMap: PropTypes.func,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
};

export default DragSource(MEMBER, memberSource, collect)(CSSModules(Member, styles));
