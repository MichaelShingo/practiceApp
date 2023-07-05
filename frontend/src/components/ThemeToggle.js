import { useState, useEffect } from 'react';
import '../styles/toggle.css';
import { ReactComponent as MoonIcon } from '../icons/moon.svg';
import { ReactComponent as SunIcon } from '../icons/sun.svg';

const ThemeToggle = () => {
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        updateTheme(isEnabled);
    }, [isEnabled])

    const toggleState = () => {
        setIsEnabled((prevState) => !prevState);
    }

    const updateTheme = (isDarkEnabled) => {
        const styles = getComputedStyle(document.body); // get all style properties in body
        const black = styles.getPropertyValue('--color-black'); // get values for variables
        const white = styles.getPropertyValue('--color-white');
        const docEl = document.documentElement;
        if (isDarkEnabled) {
            docEl.style.setProperty('--background', black);
            docEl.style.setProperty('--foreground', white);
            document.querySelector('html').classList.add('darkmode');
        } else {
            docEl.style.setProperty('--background', white);
            docEl.style.setProperty('--foreground', black);
            document.querySelector('html').classList.remove('darkmode');
        }
    }

    return (
        <label className="toggle-wrapper" htmlFor="toggle">
            <div className={`toggle ${isEnabled ? "enabled" : "disabled"}`}>
                <span className="hidden">
                    {isEnabled ? "Enable" : "Disable"}
                </span>
                <div className="icons">
                    <SunIcon />
                    <MoonIcon />
                </div>
                <input
                    id="toggle"
                    name="toggle"
                    type="checkbox"
                    checked={isEnabled}
                    onClick={toggleState}
                />
            </div>
        </label>

        )
}

export default ThemeToggle;