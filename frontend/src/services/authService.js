import { host } from './urls';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';



export const checkAuthenticated = () => {

    if (localStorage.getItem('authToken') === null) {
        console.log('no token')
        return false;
    }
    console.log('returning true')
    console.log(localStorage.getItem('authToken'));
    return true;

    // const url = 'http://localhost:8000/api/user-piece/'
    // try {
    //     const token = localStorage.getItem('authToken');
    //     const response = await fetch(url,
    //         {
    //             method: 'GET',
    //             headers: {
    //                 Authorization: `Token ${token}`,
    //                 'Content-Type': 'application/json',
    //             }
    //         });
        
    //     if (!response.ok) { 
    //         console.log('invalid token')
    //         return false;
    //     }
    //     console.log('still authenticated')
    //     return true; 

    // } catch (error) {
    //     console.log('Error fetching data:', error);
    //     return false;
    // }
 

    
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
        localStorage.clear();
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
        console.log(`login returned data = ${jsonData}`);   
        console.log(`auth token = ${jsonData.token}`); 

        localStorage.setItem('authToken', jsonData.token);
        console.log(`auth token in storage = ${localStorage.getItem('authToken')}`); 
        const requestUserOptions = {
            method: 'GET',
            headers: { 
                Authorization: `Token ${jsonData.token}`,
                'Content-Type': 'application/json',
                }
        }

        
        const userDataResponse = await fetch(userUrl, requestUserOptions);
        if (userDataResponse.ok) {
            const userDataJson = await userDataResponse.json();
            console.log(userDataJson);
            localStorage.setItem('userID', userDataJson.id);
            localStorage.setItem('userFirstName', userDataJson.first_name);
            localStorage.setItem('userLastName', userDataJson.last_name);
            localStorage.setItem('userEmail', userDataJson.email);
        }
        
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

    return response;
    
    
    


}