import PropTypes from 'prop-types';
import React from 'react';
import Marker from './Marker';

const Markers = ({ markerPosition, handleCurrentTime }) => (
  <div
    style={{
      position: 'relative',
      top: '-10px',
    }}
  >
    {
      markerPosition.map((ele, index) => (
        <Marker
          location={ele}
          key={index}
          onClick={
            () => {
              handleCurrentTime(ele / 100);
            }
          }
        />
      ))
    }
  </div>
);

Markers.propTypes = {
  markerPosition: PropTypes.array.isRequired,
  handleCurrentTime: PropTypes.func,
};

export default Markers;
