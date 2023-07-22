import React, { useContext, useState } from 'react';

const ThemeContext = React.createContext();
const ThemeUpdateContext = React.createContext();

export function useTheme() {
    return useContext(ThemeContext)
}

export function useThemeUpdate() {
    return useContext(ThemeUpdateContext)
}

export default function ThemeProvider({ children }) {
    const [darkTheme, setDarkTheme] = useState(true);

    const toggleTheme = () => {
        setDarkTheme(prevDarkTheme => !prevDarkTheme);
    }

    return ( // two contexts allow access to the theme AND the function to update the theme
        <ThemeContext.Provider value={darkTheme}>
            <ThemeUpdateContext.Provider value={toggleTheme}>
                {children}
            </ThemeUpdateContext.Provider>
        </ThemeContext.Provider>
    )
}