import React, { useState } from 'react';
import '../styles/toggleSwitch.css'; // Create this CSS file for styling

const ToggleSwitch = ({isChecked, setIsChecked, scale}) => {

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="toggle-switch" onClick={handleToggle} style={{transform: scale}}>
      <div 
        className={`switch ${isChecked ? 'checked' : ''}`}
        style={{backgroundColor: isChecked ? 'var(--color-accent)' : 'var(--color-grey-3)'}}
      >

      </div>
    </div>
  );
};

export default ToggleSwitch;
