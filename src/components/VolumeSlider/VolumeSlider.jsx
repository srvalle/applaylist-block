import React, { useState, useRef, useEffect } from 'react';

const VolumeSlider = ({ volume, onVolumeChange }) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.clientWidth);
    }
  }, []);

  const handleInput = (e) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const newVolume = Math.min(1, Math.max(0, x / sliderWidth));
    onVolumeChange(newVolume);
  };

  const thumbPosition = volume * sliderWidth;

  return (
    <div
      className='volume__bar'
      ref={sliderRef}
      onMouseDown={handleInput}
      onTouchStart={handleInput}
      onTouchMove={handleInput}
    >
      <div
        className='volume__slider'
        style={{
          width: `${thumbPosition}px`,
        }}
      />
      <div
        className='volume__thumb'
        style={{
          left: `${thumbPosition - 12}px`,
        }}
      />
    </div>
  );
};

export default VolumeSlider;
