import { host } from './urls';
import { useNavigate } from 'react-router-dom';

export const checkAuthenticated = () => {
    if (!localStorage.getItem('authToken')) {
        return false;
    }
    return true;
}

export const logout = async () => {
    const token = localStorage.getItem('authToken');
    const url = `${host}/api/logout/`;
    const requestOptions = {
        method: 'POST',
        headers: { Authorization: `Token ${token}`,
                'Content-Type': 'application/json' },
    }
    const response = await fetch(url, requestOptions);
    if (response.ok) {
        localStorage.removeItem('authToken');
        console.log('user logged out');
        
    }
}

export const login = async (email, password) => {
    const url = `${host}/api/login/`;
    const userUrl = `${host}/api/getUser/`;
    const userData = {
        'email': email,
        'password': password
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    }

    const response = await fetch(url, requestOptions);
    if (response.ok) {
        const jsonData = await response.json();
        localStorage.setItem('authToken', jsonData.token);

        const requestUserOptions = {
            method: 'GET',
            headers: { 
                Authorization: `Token ${jsonData.token}`,
                'Content-Type': 'application/json',
                }
        }

        localStorage.setItem('user', JSON.stringify(response.data));
        const userData = await fetch(userUrl, requestUserOptions);
        return response.status;
    } else {
        console.log(response.status);
        return response.status;
    }
}
    

export const register = async (email, password, first_name, last_name) => { 
    const url = `${host}/api/register/`;
    const userData = {
        'email': email,
        'password': password,
        'first_name': first_name,
        'last_name': last_name,
    };
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    };

    const response = await fetch(url, requestOptions);

    // if (response.ok) {
    //     const jsonData = await response.json();
    //     localStorage.setItem('authToken', jsonData.token);
    //     localStorage.setItem('user', JSON.stringify(response.data));
    // }

    return response.status;
    
    
    


}