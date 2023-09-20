import { useNavigate } from 'react-router-dom';
import LoadingIcon from './LoadingIcon';
import { host } from '../services/urls';

const CheckAuth = ({ funcNav }) => {
  funcNav(false);
  const navigate = useNavigate();

  const fetchAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    } else {
      const url = `${host}/api/check-auth/`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const jsonData = await response.json();
      console.log(jsonData);
      if (jsonData.authenticated) {
        navigate('/practice');
      }
    }
  };

  fetchAuth();

  return (
    <div
      className="practice-loading-container"
      style={{ backgroundColor: 'var(--color-white)' }}
    >
      <LoadingIcon style={{ position: 'fixed !important' }} />
    </div>
  );
};

export default CheckAuth;
