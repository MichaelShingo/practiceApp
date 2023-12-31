import { useState, useEffect } from 'react';
import PieceList from './components/PieceList.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import {ReactComponent as CheckMark} from './svg/circle-check-solid.svg';
import {ReactComponent as PlusMark} from './svg/circle-plus-solid.svg';
import {ReactComponent as OpenCircle} from './svg/circle-regular.svg';

const Home = ({ funcNav }) => {
    funcNav(true);
    const [pieces, setPieces] = useState();
    const [categories, setCategories] = useState();
    const [userPieces, setUserPieces] = useState();

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

    const togglePieceTable = (e, categoryKey) => {
        console.log(e.target);
        e.stopPropagation();
        console.log(categoryKey);
        const categoryElement = document.querySelector(`div[listID='${categoryKey.toString()}']`);
        const piecesTable = categoryElement.querySelector('table');
        piecesTable.classList.toggle('hide-pieces-table');
    }

    const handlePiecesTableClick = (e) => {
        e.stopPropagation();
    }

    const toggleCheckMark = (e) => {
        console.log(e.target.name);
        try {
            e.target.classList.toggle('hide-checkmark');
            const checkedElement = e.target.previousElementSibling;
            checkedElement.classList.toggle('hide-checkmark');
            const pieceRow = checkedElement.parentNode.parentNode;
            const categoryID = pieceRow.getAttribute("categoryID").toString();
            const masteryLevel = pieceRow.querySelector('.mastery-number');

            const fraction = document.querySelector(`.fraction[categoryID="${categoryID}"]`);
            const fractionText = fraction.textContent;
            const slashIndex = fractionText.indexOf('/');
            console.log(fractionText, slashIndex);
            let numerator = parseInt(fractionText.substring(0, slashIndex));
            const denominator = fractionText.substring(slashIndex + 1, fractionText.length);
            // console.log(fractionText.indexOf('/'));
            const progressBar = document.querySelector(`.progress-bar[categoryID="${categoryID}"]`);
            console.log(progressBar);
            

            if (checkedElement.classList.contains('hide-checkmark')) { 
                // When you uncheck it decrement mastery
                console.log('unchecked');
                // masteryLevel.value = 0;
                numerator = numerator - 1;
                console.log(`numerator = ${numerator}`);
            } else {
                console.log('checked');
                // masteryLevel.value = 10;
                numerator = numerator + 1; 
            }
            let percentage = numerator / denominator * 100;
            console.log(`percentage = ${percentage}`);
            progressBar.style.width = `${percentage.toString()}%`;
            fraction.textContent = numerator.toString() + '/' + denominator.toString();
            // set mastery 
            // update progress bar - calculate the fraction as a percentage, set inline style for width of progress bar 
            // update database
        } catch (error){
            e.target.classList.toggle('hide-checkmark');
            console.log(error.message);
        }
           
        
        
    }

    const mapColorRange = (value, x1, y1, x2, y2) => {
        return ((y2 - y1) / (x2 - x1)) * value;
    }

    const handleMasteryChange = (e) => {
        let masteryNumber = e.target;
        const categoryID = masteryNumber.getAttribute('categoryID').toString();        
        let masteryValue = parseInt(masteryNumber.value);
        console.log(typeof masteryValue);
        const hue = mapColorRange(parseInt(masteryNumber.value), 1, 1, 10, 118);
        masteryNumber.setAttribute('style', `background-color: hsl(${hue}, 100%, 38%);`);

        const progressBar = document.querySelector(`.progress-bar[categoryID="${categoryID}"]`);
        const allMastery = document.querySelectorAll(`.mastery-number[categoryID="${categoryID}"]`)
        let masterySum = 0;
        for (let mastery of allMastery) {
            let value = parseInt(mastery.value);
            if (typeof value == 'number') {
                console.log('it a number');
                masterySum = masterySum + value;
            }
            
        }
        console.log(masterySum);
        let masteryAverage = masterySum / allMastery.length;
        console.log(masteryAverage);
        let hueProgress = mapColorRange(masteryAverage, 0, 0, 10, 118);
        console.log(hueProgress);
        // get all mastery numbers 
        progressBar.style.backgroundColor = `hsl(${hueProgress}, 100%, 38%)`
    }



    
    
    return ( 
        <div id="practice-content">
            <div className="row">
                <div className="col-1"></div>
                <div className="col-10">
                    <div className="table-container">
                        <div className="row">
                            <div className="col-0-5"></div>
                            <div className="col-11">
                                { categories && pieces && categories.map((category) => (
                                    <div 
                                        className="category-row" 
                                        key={category.id}
                                        listID={category.id}
                                        onClick={(e) => togglePieceTable(e, category.id)}
                                    >
                                        <div className="row">
                                            <div className="col-6 no-margin">
                                                <h2>{ category.name }</h2>
                                            </div>
                                            <div className="col-6 progress-container no-margin">
                                                <h2 categoryID={category.id} className="fraction">22/{pieces.filter((piece) => piece.category.name === category.name).length}</h2>
                                                <div className="progress-bar-container">
                                                    <div categoryID={category.id} className="progress-bar" style={{}}></div>
                                                    <div className="progress-bar-back"></div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                        <div className="table-body" onClick={(e) => handlePiecesTableClick(e)}>
                                            <table className="pieces-table hide-pieces-table">
                                                <thead>
                                                    <tr>
                                                        <th className="title-head">Title</th>
                                                        <th>Complete</th>
                                                        <th>Difficulty</th>
                                                        <th>Mastery</th>
                                                        <th>More</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* <PieceList pieces={pieces.filter((piece) => piece.category.name === category.name)}/> */}
                                                    {pieces.filter((piece) => piece.category.name === category.name).map((piece) => (
                                                        <tr className="piece-preview" key={piece.id} listID={piece.id} categoryID={category.id} >
                                                            <td className="title-col">{ piece.title }</td>
                                                            <td>
                                                                <CheckMark 
                                                                    className="complete-icon"
                                                                    
                                                                />
                                                                <OpenCircle 
                                                                    className="open-icon hide-checkmark" 
                                                                    onClick={(e) => toggleCheckMark(e)} 
                                                                />
                                                                
                                                            </td>
                                                            <td>5</td>
                                                            <td className="mastery-row">
                                                                <input 
                                                                    className="mastery-number" 
                                                                    categoryID={category.id}
                                                                    type="number"  
                                                                    min="0" 
                                                                    max="10"
                                                                    onChange={(e) => handleMasteryChange(e)}
                                                                />
                                                                {/* <div className="mastery-rating"></div> */}
                                                            </td>
                                                            <td><PlusMark className="plus-icon" /></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="col-0-5"></div>
                        </div>
                    </div>
                </div>
                <div className="col-1"></div>
            </div>
            
        
          
        </div>
     );
}
 
export default Home;