import { useState, useEffect } from 'react';
import '../styles/toggle.css';
import { ReactComponent as MoonIcon } from '../icons/moon.svg';
import { ReactComponent as SunIcon } from '../icons/sun.svg';

const ThemeToggle = ({ toggleMode }) => {
    const [isEnabled, setIsEnabled] = useState(true);

    const toggleState = () => {
        setIsEnabled((prevState) => !prevState);
        toggleMode();

    }

    return (
        <label className="toggle-wrapper" htmlFor="toggle">
            <div className={`toggle ${isEnabled ? "enabled" : "disabled"}`}>
                <span className="hidden">
                    {isEnabled ? "Enable" : "Disable"}
                </span>
                <div className="icons">
                    <SunIcon style={{
                        transform: isEnabled ? 'translateX(0px)' : 'translateX(50px)',
                        opacity: isEnabled ? '0' : '1',
                        transition: '1s',
                 
                }}/>
                    <MoonIcon 
                        style={{
                            transform: !isEnabled ? 'translateX(-65px)' : 'translateX(10px)',
                            opacity: !isEnabled ? '0' : '1',
                            transition: '1s'
                    }}
                    
                    />
                </div>
                <input
                    id="toggle"
                    name="toggle"
                    type="checkbox"
                    defaultChecked={isEnabled}
                    onClick={toggleState}
                />
            </div>
        </label>

        )
}

export default ThemeToggle;