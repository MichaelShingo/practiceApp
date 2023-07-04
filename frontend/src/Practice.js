import { useState, useEffect } from 'react';
import PieceList from './components/PieceList.js';

const Home = ({ funcNav }) => {
    funcNav(true);
    const [pieces, setPieces] = useState();
    const [categories, setCategories] = useState();
    const [userPIeces, setUserPieces] = useState();

    useEffect( () => {
         fetchPieces();
         fetchCategories();
         fetchUserPieces();
    }, []);


    const fetchPieces = async () => {
        const url = 'http://localhost:8000/api/pieces/'
        try {
            const response = await fetch(url, {
                method: 'GET',
            
            });
            const jsonData = await response.json();
            setPieces(jsonData);
            console.log(pieces);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const fetchCategories = async () => {
        const url = 'http://localhost:8000/api/categories/'
        try {
            const response = await fetch(url,
                {
                    method: 'GET',
                });
            const jsonData = await response.json();
            setCategories(jsonData);
            console.log(categories);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    }

    const fetchUserPieces = async () => {
        const url = 'http://localhost:8000/api/user-piece/'
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(url,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            const jsonData = await response.json();
            setUserPieces(jsonData);
            console.log('SUCCESSFULLY FETCHED USER PIECES');
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    }



    
    
    return ( 
        <div className="home">
            <h2>Welcome to Violintice</h2>
            { categories && pieces && categories.map((category) => (
                <div>
                    <h2>{ category.name }</h2>
                    <PieceList pieces={pieces.filter((piece) => piece.category.name === category.name)}/>
                </div>
                
            ))}
            
          
        </div>
     );
}
 
export default Home;