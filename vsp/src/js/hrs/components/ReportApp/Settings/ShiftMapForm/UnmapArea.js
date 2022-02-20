import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { DropTarget } from 'react-dnd';
import { MEMBER } from './itemTypes';


import styles from './UnmapArea.scss';

import Member from './Member';
import { sortByKey } from '../../utils';

import {
  collect,
} from './MapArea';

const unMapAreaTarget = {
  drop: (props, monitor) => {
    const {
      deleteShiftMap,
    } = props;

    const {
      shiftId,
      memberUid,
    } = monitor.getItem();

    return deleteShiftMap(shiftId)(memberUid);
  },
};

class UnmapArea extends React.PureComponent {
  render() {
    const {
      members,
      connectDropTarget,
      isOver,
    } = this.props;

    return connectDropTarget(
      <div
        style={{
          width: '100%',
          padding: '16px',
          background: 'white',
          marginBottom: '16px',
          borderRadius: '4px',
        }}
        styleName={isOver ? 'over' : null}
      >
        <h2>
          {`未分組HRS人員（${members.length}）`}
          <hr
            styleName="line"
            style={{
              margin: '16px 0',
            }}
          />
        </h2>
        <div
          style={{
            display: 'grid',
            marginBottom: '20px',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridColumnGap: '16px',
          }}
        >
          {
            members.sort(sortByKey('account')).map(ele =>
              <Member
                key={ele.uid}
                memberName={ele.account}
                memberUid={ele.uid}
              />
            )
          }
        </div>
      </div>
    );
  }
}

UnmapArea.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object),
  deleteShiftMap: PropTypes.func,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
};

export default DropTarget(MEMBER, unMapAreaTarget, collect)(CSSModules(UnmapArea, styles));
