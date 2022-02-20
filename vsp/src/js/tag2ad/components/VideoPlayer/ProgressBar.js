import PropTypes from 'prop-types';
import React from 'react';
import Markers from './Markers';


class ProgressBar extends React.Component {
  static propTypes = {
    currentRatio: PropTypes.number.isRequired,
    handleCurrentTime: PropTypes.func,
    markerPosition: PropTypes.array,
  }

  static defaultProps = {
    markerPosition: [],
  }

  render() {
    const { currentRatio, markerPosition, handleCurrentTime } = this.props;

    return (
      <div
        style={{
          position: 'relative',
          backgroundColor: 'grey',
          width: '100%',
          height: '20px',
        }}
        ref={(ref) => { this.parent = ref; }}
      >
        {/* progress-dispaly layer */}
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'black',
            height: '100%',
            width: '100%',
            top: '0',
            transform: `scaleX(${currentRatio})`,
            left: `-${(100 - (currentRatio * 100)) / 2}%`,
          }}
        />

        {/* control layer.
        put it to the top */}
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'black',
            height: '100%',
            width: '100%',
            zIndex: '100',
            opacity: '0',
          }}
          onClick={
            (e) => {
              e.stopPropagation();
              const mousePostition = e.clientX;
              const { left } = e.target.getBoundingClientRect();
              const { width } = this.parent.getBoundingClientRect();

              handleCurrentTime((mousePostition - left) / width);
            }
          }
        />
        <Markers
          markerPosition={markerPosition}
          handleCurrentTime={handleCurrentTime}
        />
      </div>
    );
  }
}

export default ProgressBar;
