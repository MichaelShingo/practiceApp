import { useState, useEffect, useRef, useReducer, useMemo } from 'react';
import { checkAuthenticated } from './services/authService.js';
import Category from './components/Category.js';
import Search from './components/Search.js';
import PieceDetail from './components/PieceDetail.js';
import LoadingIcon from './components/LoadingIcon.js';

export const ACTIONS = {
    UPDATE_SEARCH: 'update-search',
    UPDATE_DIFF_COMP: 'update-diff-param',
    UPDATE_DIFF_NUM: 'update-diff-num',
    UPDATE_SORT: 'update-sort',
    UPDATE_PERIOD: 'update-period',
    UPDATE_TECHNIQUE: 'update-technique',
    UPDATE_TYPE: 'update-type',
    UPDATE_COMPLETE: 'update-complete',
    UPDATE_CATEGORY_SORT: 'update-category-sort',
    CLEAR: 'clear',
    REFRESH: 'refresh',
    TOGGLE_REFRESH: 'toggleRefresh',
}

export const defaultSearchState = { 
    search: '',
    sortBy: 'title',
    period: '',
    difficultyComp: 'gt',
    difficultyNum: '1',
    type: '',
    techniqueTags: new Set(),
    complete: 'all',
    categorySort: 'difficulty',
    refreshActive: false,
}

const searchReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.TOGGLE_REFRESH:
            return {...state, refreshActive: action.payload.value}

        case ACTIONS.CLEAR:
            return defaultSearchState;

        case ACTIONS.REFRESH:
            return {...state}

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

        case ACTIONS.UPDATE_COMPLETE:
            return {...state, complete: action.payload.value}
        
        case ACTIONS.UPDATE_CATEGORY_SORT:
            return {...state, categorySort: action.payload.value}

        case ACTIONS.UPDATE_TECHNIQUE: // watch out because set is MUTABLE
            const id = action.payload.value;
            if (state.techniqueTags.has(id)) {
                const temp = new Set(state.techniqueTags);
                temp.delete(id);
                return {...state, techniqueTags: temp } 
            } else {
                return {...state, techniqueTags: new Set(state.techniqueTags).add(id)}
            }
        default:
            break;
        }   
}

const Home = ({ funcNav }) => {
    funcNav(true);
    const [pieces, setPieces] = useState(null);
    const [categories, setCategories] = useState();
    const [userPieces, setUserPieces] = useState();
    const [userName, setUserName] = useState('');
    const [pieceIDSet, setPieceIDSet] = useState();
    const [pieceCount, setPieceCount] = useState(0);
    const [firstFetch, setFirstFetch] = useState(true);
    const [filteredPieceIDs, setFilteredPieceIDs] = useState(new Set());
    const [pieceDetailPiece, setPieceDetailPiece] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [periods, setPeriods] = useState(null)
    const globalProgressRef = useRef(null);
    const [globalCompletion, setGlobalCompletion] = useState(0);
    const [globalAvgMastery, setGlobalAvgMastery] = useState(0);
    const [refreshActive, setRefreshActive] = useState(false);

    const [globalMasterySum, setGlobalMasterySum] = useState(0);
    const prevGlobalMasterySum = useRef(0);

    const [searchState, searchDispatch] = useReducer(searchReducer, defaultSearchState)

    useEffect(() => {
        console.log(searchState);
    }, [searchState])

    const sortedCategories = useMemo(() => {
        let res = [];
        console.log(searchState.categorySort);
        switch (searchState.categorySort) {
            case 'difficulty':
                res = categories && categories.sort((a, b) => {
                    return a.avg_difficulty > b.avg_difficulty ? 1: -1;
                });
                break;
            case 'title':
                res = categories && categories.sort((a, b) => {
                    return a.name > b.name ? 1 : -1;
                })
                break;
            case 'completion':
                let categoryToCount = new Map();
                for (let userPiece of userPieces) {
                    const id = userPiece.piece.category;
                    const currentCount = categoryToCount.get(id) || 0;
                    categoryToCount.set(id, currentCount + 1);
                }
                for (let category of categories) {
                    if (!categoryToCount.get(category.id)) {
                        categoryToCount.set(category.id, 0);
                    }
                }
                res = categories && categories.sort((a, b) => {
                    const compA = categoryToCount.get(a.id) / a.count;
                    const compB = categoryToCount.get(b.id) / b.count;
                    return (compA < compB) ? 1 : -1;
                })
                break;
            default:
                break;
        }
        return res;
    }, [categories, searchState])

    const filteredPieces = useMemo(() => { // returns list of objects
        // FILTER BY COMPLETION
        let completionFiltered = []
        if (searchState.complete === 'complete') {
            completionFiltered = pieces && pieces.filter(piece => {
                return pieceIDSet.has(piece.id) 
            })
        } else if (searchState.complete === 'incomplete') {
            completionFiltered = pieces && pieces.filter(piece => {
                return !pieceIDSet.has(piece.id) 
            })
        } else {
            completionFiltered = pieces && pieces
        }
        // FILTER BY SEARCH TERM
        let searched = [];
        if (searchState.search === '') {
            searched = completionFiltered && completionFiltered;
        } else {
            searched = completionFiltered && (completionFiltered.filter(piece => {
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
        
        // SORTING
        let sorted = [] // sorting is last
        switch (searchState.sortBy) {
            case 'title':
                sorted = (techniqueFiltered && 
                    techniqueFiltered.sort((a, b) => a.sorting_title > b.sorting_title ? 1 : - 1));
                break;
            case 'mastery':
                const masteryMap = new Map();
                userPieces.forEach((userPiece) => {
                    masteryMap.set(userPiece.piece.id, userPiece.mastery_level)
                });

                sorted = techniqueFiltered.sort((pieceA, pieceB) => {
                    const masteryA = masteryMap.get(pieceA.id);
                    const masteryB = masteryMap.get(pieceB.id);

                    if (masteryA === undefined && masteryB === undefined) {
                        return 0;
                    } else if (masteryA === undefined) {
                        return 1;
                    } else if (masteryB === undefined) {
                        return -1;
                    }
                    return parseInt(masteryA) - parseInt(masteryB);
                });
                break;
            case 'difficulty':
                sorted = (techniqueFiltered && 
                    techniqueFiltered.sort((a, b) => a.difficulty > b.difficulty ? 1 : - 1));
                break;
            case 'composer':
                sorted = (techniqueFiltered && 
                    techniqueFiltered.sort((a, b) => a.composer.last_name > b.composer.last_name ? 1 : - 1));
                break;
            case 'date-updated':
                const updatedMap = new Map();
                userPieces.forEach((userPiece) => {
                    updatedMap.set(userPiece.piece.id, userPiece.updated_at)
                });
                console.log(updatedMap);
                
                sorted = techniqueFiltered.sort((pieceA, pieceB) => {
                    const updatedA = updatedMap.get(pieceA.id);
                    const updatedB = updatedMap.get(pieceB.id);
                    
                    if (!updatedA && !updatedB) {
                        return 0;
                    } else if (!updatedA) {
                        return 1;
                    } else if (!updatedB) {
                        return -1;
                    }
                    return new Date(updatedA).getTime() - new Date(updatedB).getTime();
                });
                break;
            case 'date-created':
                const createdMap = new Map();
                userPieces.forEach((userPiece) => {
                    createdMap.set(userPiece.piece.id, userPiece.created_at)
                });
                console.log(createdMap);
                
                sorted = techniqueFiltered.sort((pieceA, pieceB) => {
                    const createdA = createdMap.get(pieceA.id);
                    const createdB = createdMap.get(pieceB.id);
                    
                    if (!createdA && !createdB) {
                        return 0;
                    } else if (!createdA) {
                        return 1;
                    } else if (!createdB) {
                        return -1;
                    }
                    return new Date(createdA).getTime() - new Date(createdB).getTime();
                });
                break;
            default:
                sorted = techniqueFiltered;
        }
        // console.log(sorted);
        return sorted;
    }, [pieces, searchState])

    useEffect(() => {
        let idSet = new Set();
        if (filteredPieces) {
            for (let piece of filteredPieces) {
                idSet.add(piece.id);
            }
            setFilteredPieceIDs(idSet);
            setGlobalCompletion(0);
            for (let userPiece of userPieces) {
                if (idSet.has(userPiece.piece.id)) {
                    setGlobalCompletion(prev => prev + 1);
                }
            }
        }
    }, [filteredPieces])

    const categoryRefs = useRef([]);
    categoryRefs.current = [];

    useEffect( () => {
         fetchPieces();
         fetchCategories();
         fetchPeriods();
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

    useEffect(() => {
        // console.log(`count, masterySum, totalCount, categoryCount = ${count}, ${masterySum}, ${totalCount} ${categoryCount}`)
        if (globalCompletion === 0) {
            setGlobalAvgMastery(0);
        } else {
            setGlobalAvgMastery(globalMasterySum / globalCompletion);
        }
    }, [globalMasterySum, globalCompletion]);

    useEffect(() => {
        const hue = mapColorRange(globalAvgMastery, 1, 1, 10, 118);
        console.log(`GLOBAL avgMastery = ${globalAvgMastery}`);
        globalProgressRef.current.style.backgroundColor = `hsl(${hue}, 100%, 38%)`;
    }, [globalAvgMastery])

    useEffect(() => { // recalc mastery sum when refiltering
        setGlobalMasterySum(sum => sum - prevGlobalMasterySum.current);
    }, [searchState])

    const updateGlobalMastery = (difference) => {
        prevGlobalMasterySum.current = globalMasterySum;
        setGlobalMasterySum(prevSum => parseInt(prevSum) + parseInt(difference));
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
            console.log('fetched category');
            setCategories(jsonData);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    }

    const fetchPeriods = async () => {
        const url = 'http://localhost:8000/api/periods/'
        try {
            const response = await fetch(url,
                {
                    method: 'GET',
                });
            const jsonData = await response.json();
            setPeriods(jsonData);
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
                idSet.add(userPiece.piece.id);
            }
            setPieceIDSet(idSet);            
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    }
    
    const updateGlobalProgress = (increment) => {
        if (increment) {
            // console.log('add');
        } else {
            console.log('subtract');
        }
        
    }

    const mapColorRange = (value, x1, y1, x2, y2) => {
        return ((y2 - y1) / (x2 - x1)) * value;
    }

    return ( 
        <div id="practice-content">
            <PieceDetail 
                pieceDetailPiece={pieceDetailPiece}
                showDetail={showDetail}
                setShowDetail={setShowDetail}
                userPieces={userPieces}
                periods={periods}
            />
            <div className="row">
                <div className="col-1"></div>
                <div className="col-10">
                    <h2>Hello {userName}!</h2>
                    <Search 
                        searchDispatch={searchDispatch}
                        searchState={searchState}
                        pieceCount={pieceCount}
                        refreshActive={refreshActive}
                        setRefreshActive={setRefreshActive}
                    
                    />
                <div className="row">
                    <h2 className="fraction global-fraction">{globalCompletion}/{pieceCount}</h2>
                <div className="progress-container global-progress">
                    <div className="progress-bar-container">
                        <div 
                            ref={globalProgressRef} 
                            className="progress-bar" 
                            style={{
                                width: pieceCount !== 0 ? (globalCompletion / pieceCount * 100).toString() + '%' : '0%'
                            }}
                        
                        >

                        </div>
                        <div className="progress-bar-back"></div>
                    </div>
                </div>
                </div>
                    
                    <div className="table-container">
                        { (categories && pieces && userPieces && filteredPieces && pieceIDSet) ? (sortedCategories.map((category) => (
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
                                searchDispatch={searchDispatch}
                                filteredPieceIDs={filteredPieceIDs}
                                setPieceDetailPiece={setPieceDetailPiece}
                                showDetail={showDetail}
                                setShowDetail={setShowDetail}
                                setGlobalCompletion={setGlobalCompletion}
                                setRefreshActive={setRefreshActive}
                            />
                        ))) : <LoadingIcon />
                    }
                    </div>
                </div>
                <div className="col-1"></div>
            </div>
        </div>
     );
}
 
export default Home;