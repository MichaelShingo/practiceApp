import { useState, useEffect, useRef, useReducer, useMemo } from 'react';

import { checkAuthenticated } from './services/authService.js';
import Category from './components/Category.js';
import Search from './components/Search.js';

export const ACTIONS = {
    UPDATE_SEARCH: 'update-search',
    UPDATE_DIFF_COMP: 'update-diff-param',
    UPDATE_DIFF_NUM: 'update-diff-num',
    UPDATE_SORT: 'update-sort',
    UPDATE_PERIOD: 'update-period',
    UPDATE_TECHNIQUE: 'update-technique',
    UPDATE_TYPE: 'update-type',
}

const searchReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.UPDATE_SEARCH:
            return {...state, search: action.payload.value}

        case ACTIONS.UPDATE_DIFF_COMP:
            return {...state, difficultyComp: action.payload.value}

        case ACTIONS.UPDATE_DIFF_NUM:
            return {...state, difficultyNum: action.payload.value}

        case ACTIONS.UPDATE_SORT:
            return {...state, sortBy: action.payload.value}

        case ACTIONS.UPDATE_PERIOD:
            return {...state, period: action.payload.value}
        
        case ACTIONS.UPDATE_TYPE:
            return {...state, type: action.payload.value}

        case ACTIONS.UPDATE_TECHNIQUE: // watch out because set is MUTABLE
            const id = action.payload.value;
            if (state.techniqueTags.has(id)) {
                const temp = new Set(state.techniqueTags);
                temp.delete(id);
                return {...state, techniqueTags: temp } 
            } else {
                return {...state, techniqueTags: new Set(state.techniqueTags).add(id)}
            }
        }
}

const Home = ({ funcNav }) => {
    funcNav(true);
    const [pieces, setPieces] = useState(null);
    const [categories, setCategories] = useState();
    const [userPieces, setUserPieces] = useState();
    const [userName, setUserName] = useState('');
    let [pieceIDSet, setPieceIDSet] = useState();
    const [pieceCount, setPieceCount] = useState(0);
    const [firstFetch, setFirstFetch] = useState(true);
    const [filteredPieceIDs, setFilteredPieceIDs] = useState(new Set());

    const [searchState, searchDispatch] = useReducer(searchReducer, { 
        search: '',
        sortBy: 'title',
        period: '',
        difficultyComp: 'gt',
        difficultyNum: 1,
        type: '',
        techniqueTags: new Set()
    })

    useEffect(() => {
        console.log(searchState);

    }, [searchState])

    

    const filteredPieces = useMemo(() => { // returns list of objects
        // FILTER BY SEARCH TERM
        let searched = [];
        if (searchState.search === '') {
            searched = pieces && pieces;
        } else {
            searched = pieces && (pieces.filter(piece => {
                const pieceString = `${piece.title} 
                    ${piece.composer.first_name} 
                    ${piece.composer.last_name}
                    ${piece.category.name}`;
                return (pieceString.toLowerCase())
                    .includes(searchState.search.toLowerCase())
        }))};

        // FILTER BY DIFFICULTY
        let difficultyFiltered = [];

        if (searchState.difficultyComp === 'gt') {
            difficultyFiltered = searched && searched.filter(piece => {
                return piece.difficulty >= parseInt(searchState.difficultyNum)
            })
        } else if (searchState.difficultyComp === 'lt') {
            difficultyFiltered = searched && searched.filter(piece => {
                return piece.difficulty <= parseInt(searchState.difficultyNum)
            })

        } else {
            difficultyFiltered = searched && searched.filter(piece => {
                return piece.difficulty === parseInt(searchState.difficultyNum)
            })
        }

        // FILTER BY PERIOD
        let periodFiltered;
        if (searchState.period !== '') {
            periodFiltered = difficultyFiltered && difficultyFiltered.filter(piece => {
                console.log(`${piece.period.name} ${searchState.period}`)
                return piece.period.name === searchState.period
            })
        } else {
            periodFiltered = difficultyFiltered;
        }

        // FILTER BY TYPE
        let typeFiltered;
        if (searchState.type !== '') {
            typeFiltered = periodFiltered && periodFiltered.filter(piece => {
                return piece.type_of_piece.name === searchState.type
            })
        } else {
            typeFiltered = periodFiltered;
        }        

        // FILTER BY TECHNIQUE
        let techniqueFiltered = [];
        if (searchState.techniqueTags.size === 0) {
            techniqueFiltered = typeFiltered;
        } else {
            techniqueFiltered = typeFiltered && typeFiltered.filter(piece => {
                let pieceTechIDs = new Set();
                for (let technique of piece.techniques) {
                    pieceTechIDs.add(technique.id);
                }
                for (let element of searchState.techniqueTags) {
                    if (!pieceTechIDs.has(element)) {
                        return false;
                    }
                }
                return true;
                })
            }
        setPieceCount(techniqueFiltered && techniqueFiltered.length);

        console.log(userPieces);
        return techniqueFiltered;

        

        
        // SORTING
        let sorted = [] // sorting is last
        switch (searchState.sortBy) {
            case 'title':
                sorted = searched && searched.sort((a, b) => a.title > b.title ? 1 : - 1);
                break;
            case 'mastery':
                break;
            case 'difficulty':
                break;
            case 'composer':
                break;
            case 'date-updated':
                break;
            default:
                sorted = searched;
        }
        return sorted;
    }, [pieces, searchState])

    useEffect(() => {
        let idSet = new Set();
        if (filteredPieces) {
            for (let piece of filteredPieces) {
                idSet.add(piece.id);
                console.log(`TYPE OF IDset ???? = ${typeof piece.id}`);
            }
            // console.log(`filteredPieceIDS = ${idSet}`)
            setFilteredPieceIDs(idSet);
        }
    
    }, [filteredPieces])

    const randomRef = useRef();
    const categoryRefs = useRef([]);
    categoryRefs.current = [];

    useEffect( () => {
         fetchPieces();
         fetchCategories();
         if (checkAuthenticated()) {
            fetchUserPieces();
         } else {
            setUserPieces([{}]);
            setPieceIDSet(new Set([0]));
         }
         
         setUserName(localStorage.getItem('userFirstName'));
    }, []);

    const addCategoryRefs = (element) => {
        if (element && !categoryRefs.current.includes(element)) {
            categoryRefs.current.push(element);
        }
    }


    const fetchPieces = async () => {
        const url = 'http://localhost:8000/api/pieces/'
        try {
            const response = await fetch(url, {
                method: 'GET',
            
            });
            const jsonData = await response.json();
            setPieces(jsonData);
            console.log('fetched pieces');
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
            console.log('fetched categories');
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    }

    const fetchUserPieces = async () => {
        const url = 'http://localhost:8000/api/user-piece/';
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
            console.log(`fetch user pieces json = ${jsonData}`);
            
            setUserPieces(jsonData);

            let idSet = new Set();
            for (let userPiece of jsonData) {
                console.log(userPiece.piece.id);
                idSet.add(userPiece.piece.id);
            }
            setPieceIDSet(idSet);
            // can you run above code in a promise, then set state??
            console.log(`LENGTH = ${userPieces.length}`);
            // setReady(true);
            console.log(pieceIDSet);
            
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    }

    // const togglePieceTable = (e, categoryKey) => {
    //     e.stopPropagation();
    //     console.log(e);
    //     const categoryElement = document.querySelector(`div[listID='${categoryKey.toString()}']`);
    //     const piecesTable = categoryElement.querySelector('table');
    //     piecesTable.classList.toggle('hide-pieces-table');
    // }

    
    const updateGlobalProgress = (increment) => {
        if (increment) {
            console.log('add');
        } else {
            console.log('subtract');
        }
        
    }
    const oldHandleCheckFunction= (e) => {
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
            // update database
        } catch (error){
            e.target.classList.toggle('hide-checkmark');
            console.log(error.message);
        }  
    }

    const mapColorRange = (value, x1, y1, x2, y2) => {
        return ((y2 - y1) / (x2 - x1)) * value;
    }

    const updateGlobalMastery = (e) => {
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
        // update database (but can you timeout before updating the database so that you don't make unecessary calls?)
    }

    return ( 
        <div id="practice-content">
            <div className="row">
                <div className="col-1"></div>
                <div className="col-10">
                    <h2>Hello {userName}!</h2>
                    <Search 
                        searchDispatch={searchDispatch}
                        searchState={searchState}
                        pieceCount={pieceCount}
                        />
                    <div className="table-container">
                        <div className="row">
                            <div className="col-0-5"></div>
                            <div className="col-11">
                                { categories && pieces && userPieces && filteredPieces && pieceIDSet && categories.map((category) => (
                                    <Category 
                                        key={category.id}
                                        category={category} 
                                        userPieces={userPieces}
                                        pieces={pieces}
                                        filteredPieces={filteredPieces}
                                        updateGlobalProgress={updateGlobalProgress}
                                        updateGlobalMastery={updateGlobalMastery}
                                        ref={addCategoryRefs}
                                        pieceIDSet={pieceIDSet}
                                        setPieceIDSet={setPieceIDSet}
                                        setUserPieces={setUserPieces} 
                                        pieceCount={pieceCount} 
                                        firstFetch={firstFetch}
                                        setFirstFetch={setFirstFetch}
                                        searchState={searchState}
                                        filteredPieceIDs={filteredPieceIDs}
                                    />
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