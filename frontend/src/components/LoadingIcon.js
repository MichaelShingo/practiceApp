import { useContext, useEffect } from 'react';
import fermata from '../icons/fermata.png';
import fermataWhite from '../icons/fermataWhite.png';
import { ThemeContext } from '../App';

const LoadingIcon = () => {
  const theme = useContext(ThemeContext);
  console.log('theme');
  useEffect(() => {
    console.log(theme);
  }, [theme]);
  return (
    <div className="loading-container">
      <div className="fermata-container">
        {theme === 'light' ? (
          <img id="fermata" alt="Fermata loading animation." src={fermata} />
        ) : (
          <img
            id="fermata"
            alt="Fermata loading animation."
            src={fermataWhite}
          />
        )}

        <div className="loading-circle" id="c1"></div>
        <div className="loading-circle" id="c2"></div>
        <div className="loading-circle" id="c3"></div>
      </div>
    </div>
  );
};

export default LoadingIcon;
