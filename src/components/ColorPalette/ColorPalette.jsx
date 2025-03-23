import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import './ColorPalette.scss';

const ColorPalette = ({ onChange }) => {
  // console.log(onChange);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState('#555');

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color) => {
    // console.log(color.hex);
    setColor(color.hex);
    const { rgb } = color; // Desestruturando o objeto rgb
    //// const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`; // Criando a string RGB
    const rgbString = `${rgb.r}, ${rgb.g}, ${rgb.b}`; // Criando a string RGB  
    onChange(rgbString); // Chama a função para mudar a cor no player
    //// onChange(color.hex); // Chama a função para mudar a cor no player
  };

  return (
    <div>
      <button 
        onClick={handleClick}
        className='button__pallete_color'
        style={{
          backgroundColor: color,
        }}
      >
        {/* color */}
        Choose Color
      </button>

      {displayColorPicker ? (
        <div style={{ position: 'absolute', zIndex: 1000 }}>
          <div onClick={handleClose} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }} />
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
};

export default ColorPalette;
