import './App.scss';

import React from 'react';
import { AudioPlayer } from './components/AudioPlayer/AudioPlayer';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlay, faPause, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import music1 from './audios/music1.mp3';
import music2 from './audios/music2.mp3';
import music3 from './audios/music3.mp3';

const tracks = [music1, music2, music3];

function App() {
  return (
    <div className="App">
      <AudioPlayer tracks={tracks} />
    </div>
  );
}

export default App;
