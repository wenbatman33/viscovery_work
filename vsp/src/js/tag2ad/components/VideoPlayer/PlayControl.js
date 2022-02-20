import PropTypes from 'prop-types';
import React from 'react';
import PlayButton from './PlayButton';
import PauseButton from './PauseButton';

const PlayControl = ({ putPlay, onClick }) => (
  <div>
    {
      putPlay ? <PlayButton onClick={onClick} /> : <PauseButton onClick={onClick} />
    }
  </div>
);

PlayControl.propTypes = {
  putPlay: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default PlayControl;
