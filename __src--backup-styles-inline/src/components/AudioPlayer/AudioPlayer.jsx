import React, { useState, useRef, useEffect } from 'react';
//// import { useTheme } from '../ThemeContext/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './AudioPlayer.scss';
import './AudioPlayer-settings.scss'
import VolumeSlider from '../VolumeSlider/VolumeSlider';

export const AudioPlayer = ({ tracks }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackChanged, setTrackChanged] = useState(false);
  //// const { theme, toggleTheme, themeName } = useTheme();


  const themeOptions = ['light', 'dark', 'blue', 'green', 'purple', 'orange', 'red', 'yellow', 'custom'];
  const [theme, setTheme] = useState('light--app'); // Estado para o tema

  const handleThemeChange = (newTheme) => {
    // alert(newTheme)
    setTheme(newTheme); // Atualiza o estado do tema
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (trackChanged) {
        audioRef.current.src = tracks[currentTrackIndex];
        setTrackChanged(false);
      }
      
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, isPlaying, tracks, trackChanged]);


  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    setTrackChanged(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length);
    setTrackChanged(true);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleProgressClick = (e) => {
    const progressElement = e.currentTarget;
    const rect = progressElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const totalWidth = rect.width;
    const percentage = offsetX / totalWidth;
    if (audioRef.current && duration) {
      audioRef.current.currentTime = percentage * duration;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };



  return (
    <>
      <header className='header'>
        <h4>Audio Player Themes</h4>
        <select 
          style={{ /* height: '40px', width: '150px', padding: '5px', outline: 'none' */ }}
          className='select__theme' 
          value={theme} 
          onChange={(e) => handleThemeChange(e.target.value)}>
            {themeOptions.map((option) => (
              <option key={option} value={option + '--app'}>
                {option}
              </option>
            ))}
        </select>
      </header>

      <div className={`audio__player ${theme}`}>

        <audio ref={audioRef} src={tracks[0]} id="audio" preload="auto" volume={volume}></audio>

        <div className={`audio__player__elements`}>
          <div className="audio__player__buttons">
              <button onClick={handlePrev} id="prev" className="buttons"><FontAwesomeIcon icon={faChevronLeft} /></button>
              <button className='buttons' onClick={handlePlay}>
                {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
              </button>
              <button onClick={handleNext} id="next" className="buttons"><FontAwesomeIcon icon={faChevronRight} /></button>


              <div className="audio__player__volume">
                <label htmlFor="volume"></label>
                <VolumeSlider volume={volume} onVolumeChange={handleVolumeChange} />
              </div>
          </div>

          <div className="audio__player__progress">
              <div className="progress" id="progress" onClick={handleProgressClick}>
                  <div className="progress__fill" id="progress__fill" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
              </div>

              <div className="audio__player__time">
                <span id="current-time">{formatTime(currentTime)}</span><span id="duration">{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <div className="audio__player__playlist">
          <ul className="audio__player__playlist__list">
            {tracks.map((track, index) => (
              <li
                key={index}
                className={`audio__player__playlist__item ${
                  index === currentTrackIndex ? 'isActive' : ''
                }`}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setTrackChanged(true);
                }}
              >
                {`Faixa ${index + 1}`}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className='footer'>
        footer
        <p className='light'>teste de paragrafo</p>
        <p className='dark'>teste de paragrafo</p>
      </footer>
    </>
  );
};
