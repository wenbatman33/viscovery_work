import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import R from 'ramda';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import {
  arrayToObject,
} from 'utils/dataTypeUtil';

import styles from './ShiftMapForm.scss';

import Navbar from '../Navbar';
import UnmapArea from './UnmapArea';
import MapArea from './MapArea';

const groupByShiftId = R.groupBy(shift => shift.hrs_shift_id);

const handleShiftMap = R.compose(
  R.map(ele => ele.map(d => d.hrs_member_uid)),
  groupByShiftId
);

const handleUnMapMember = mappedUids => R.filter(member => !mappedUids.includes(member.uid));

class ShiftMapForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleState = this.handleState.bind(this);
    this.postShiftMap = this.postShiftMap.bind(this);
    this.updateShiftMap = this.updateShiftMap.bind(this);
    this.deleteShiftMap = this.deleteShiftMap.bind(this);
    this.confirmChange = this.confirmChange.bind(this);

    this.state = {
      shiftMaps: props.shiftMaps,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      shiftMaps: nextProps.shiftMaps,
    });
  }

  handleState(key) {
    return value =>
      this.setState({
        [key]: value,
      });
  }

  postShiftMap(hrsShiftId) {
    const {
      shiftMaps,
    } = this.state;

    return hrsMemberUid =>
      this.handleState('shiftMaps')([
        ...shiftMaps,
        {
          hrs_shift_id: hrsShiftId,
          hrs_member_uid: hrsMemberUid,
        },
      ]);
  }

  updateShiftMap(postHrsShiftId) {
    const {
      shiftMaps,
    } = this.state;

    return preHrsShiftId => hrsMemberUid =>
      this.handleState('shiftMaps')([
        ...shiftMaps.filter(ele => ele.hrs_member_uid !== hrsMemberUid),
        {
          ...shiftMaps.find(ele =>
            ele.hrs_shift_id === preHrsShiftId && ele.hrs_member_uid === hrsMemberUid
          ),
          hrs_shift_id: postHrsShiftId,
        },
      ]);
  }

  deleteShiftMap(hrsShiftId) {
    const {
      shiftMaps,
    } = this.state;

    return hrsMemberUid =>
      this.handleState('shiftMaps')([
        ...shiftMaps.filter(ele =>
          ele.hrs_shift_id !== hrsShiftId || ele.hrs_member_uid !== hrsMemberUid
        ),
      ]);
  }

  confirmChange() {
    const {
      updateShiftMapRecords,
      shiftMaps,
    } = this.props;

    return updateShiftMapRecords(shiftMaps, this.state.shiftMaps);
  }

  render() {
    const {
      pathname,
      search,
    } = this.props.location;

    const {
      hrsMembers,
      shifts,
    } = this.props;

    const {
      shiftMaps,
    } = this.state;

    const mapping = handleShiftMap(shiftMaps);
    const memberMapping = arrayToObject('uid')(hrsMembers);

    const mappingForMembers = R.compose(
      R.map(ele => ele.map(d => memberMapping[d]))
    )(mapping);

    return (
      <div
        style={{
          height: '100%',
        }}
      >
        <Navbar
          pathname={pathname}
          search={search}
          confirm={this.confirmChange}
        />
        <div styleName="container">
          <UnmapArea
            members={handleUnMapMember(shiftMaps.map(ele => ele.hrs_member_uid))(hrsMembers)}
            deleteShiftMap={this.deleteShiftMap}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${shifts.length}, 1fr)`,
              gridColumnGap: '16px',
            }}
          >
            {
              shifts.map(ele =>
                <MapArea
                  key={ele.hrs_shift_id}
                  shiftId={ele.hrs_shift_id}
                  shiftName={ele.hrs_shift_name}
                  members={
                    mappingForMembers[ele.hrs_shift_id] ?
                      mappingForMembers[ele.hrs_shift_id].filter(d => d)
                     : []
                  }
                  deleteShiftMap={this.deleteShiftMap(ele.hrs_shift_id)}
                  postShiftMap={this.postShiftMap(ele.hrs_shift_id)}
                  updateShiftMap={this.updateShiftMap(ele.hrs_shift_id)}
                />
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

ShiftMapForm.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  shiftMaps: PropTypes.arrayOf(PropTypes.object),
  shifts: PropTypes.arrayOf(PropTypes.object),
  hrsMembers: PropTypes.arrayOf(PropTypes.object),
  updateShiftMapRecords: PropTypes.func,
};

export default DragDropContext(HTML5Backend)(CSSModules(ShiftMapForm, styles));
