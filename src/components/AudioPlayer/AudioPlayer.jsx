import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './AudioPlayer.scss';
import './AudioPlayer-settings.scss'
import VolumeSlider from '../VolumeSlider/VolumeSlider';
import ColorPalette from '../ColorPalette/ColorPalette';

export const AudioPlayer = ({ tracks }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackChanged, setTrackChanged] = useState(false);

  const themeOptions = ['light', 'light-custom', 'dark', 'blue', 'green', 'purple', 'orange', 'red', 'yellow', 'custom'];
  const [theme, setTheme] = useState('light--app'); // css styles
  const [bgColor, setBgColor] = useState('29, 87, 194'); // Cor de fundo
  const [textColor, setTextColor] = useState('255, 255, 255'); // Cor do texto
  const [lightCustomColor, setLightCustomColor] = useState('37, 117, 209');
  

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme); // Atualiza o estado do tema

    // mostra as palletas de cores para custom
    const colorPaletteContainer = document.querySelector('.color__pallete_container');
    const palleteCustom1 = document.querySelector('.pallete__custom1');
    const palleteCustom2 = document.querySelector('.pallete__custom2');
    const palleteLightCustom = document.querySelector('.pallete__light__custom');

    if (newTheme === 'custom--app' || newTheme === 'light-custom--app') {
      colorPaletteContainer.style.display = 'block';

      if (newTheme === 'custom--app') {
        palleteCustom1.style.display = 'block';
        palleteCustom2.style.display = 'block';
        palleteLightCustom.style.display = 'none';
      } else {
        palleteCustom1.style.display = 'none';
        palleteCustom2.style.display = 'none';
        palleteLightCustom.style.display = 'block';
      }

    } else {
      colorPaletteContainer.style.display = 'none';
    }

    
      
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--ap-basic-color', bgColor);
  }, [bgColor]);

  useEffect(() => {
    // Criar uma nova regra CSS com !important
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --ap-color: rgb(${textColor});
        --plitem-color: rgb(${textColor});
        --btn-color: rgb(${textColor});
        --btn-color-hover: rgb(${textColor});
      }
    `;
    document.head.appendChild(style);

    // Limpar o estilo ao desmontar o componente
    return () => {
      document.head.removeChild(style);
    };
  }, [textColor]);

  useEffect(() => {
    // Criar uma nova regra CSS com !important
    const style = document.createElement('style');
    style.innerHTML = `
      .light-custom--app {
        --btn-bg: rgb(${lightCustomColor});
        --progress-fill: rgb(${lightCustomColor});
        --volume-slider-bg: rgb(${lightCustomColor});
      }
    `;
    document.head.appendChild(style);

    // Limpar o estilo ao desmontar o componente
    return () => {
      document.head.removeChild(style);
    };
  }, [lightCustomColor]);

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
        <div className="coluna-1">
          <h4>Audio Player Themes</h4>

          <select 
            className='select__theme' 
            value={theme} 
            onChange={(e) => handleThemeChange(e.target.value)}>
              {themeOptions.map((option) => (
                <option key={option} value={option + '--app'}>
                  {option}
                </option>
              ))}
          </select>

          <div className='color__pallete_container'>
            <div className='pallete__custom1'>
              <ColorPalette color={bgColor} onChange={setBgColor} />
              <span className='text__custom_color'>custom basic color</span>
            </div>
            
            <div className='pallete__custom2'>
              <ColorPalette color={textColor} onChange={setTextColor} />
              <span className='text__custom_color'>custom text color</span>
            </div>

            <div className='pallete__light__custom'>
              <ColorPalette color={lightCustomColor} onChange={setLightCustomColor} />
              <span className='text__custom_color'>light custom color</span>
            </div> 
          </div>
        </div>
        <div className="coluna-2">
          <h4>Audio Player Layout</h4>
        </div>
        <div className="coluna-3">
          <h4>Audio Player Statistics</h4>
        </div>
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
      </footer>
    </>
  );
};
