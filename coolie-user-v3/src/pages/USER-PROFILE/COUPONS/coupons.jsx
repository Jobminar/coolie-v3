import React, { useState } from 'react';
import './coupons.css';

const Coupons = () => {
  const [fontClass, setFontClass] = useState('');

  const handleFontChange = (font) => {
    setFontClass(font);
  };

  return (
    <div className={`font-change ${fontClass}`}>
      coupons
      <button className='roboto' onClick={() => handleFontChange('roboto')}>Roboto</button>
      <button className='inter' onClick={() => handleFontChange('inter')}>Inter</button>
    </div>
  );
};

export default Coupons;
