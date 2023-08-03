import {ReactComponent as MagnifyingGlass} from '../svg/magnifying-glass-solid.svg';
import { useState, useEffect } from 'react';
import { host } from '../services/urls';
import TechniqueTag from './TechniqueTag';
import {ACTIONS} from '../Practice';
import { defaultSearchState } from '../Practice';

const Search = ({
                searchDispatch,
                searchState,
                pieceCount,
            }) => {

    const [techniques, setTechniques] = useState();
    const [techniqueValue, setTechniqueValue] = useState(0);
    useEffect(() => {
        fetchTechniques();
    }, [])

    const fetchTechniques = async () => {
        const url = `${host}/api/techniques/`
        try {
            const response = await fetch(url, {
                method: 'GET',
            });
            const jsonData = await response.json();
            if (!response.ok) {
                console.log('error');
            }
            console.log('fetched techniques');
            setTechniques(jsonData);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const handleClear = () => {
        setTechniqueValue(prev => prev + 1);
        searchDispatch({
            type: ACTIONS.CLEAR
        })
    }

    return ( 
        <div id="search-container" className="table-container">
            <div id="search-column">
                <div id="search-box-container">
                    <div id="search-input-container">
                        {/* <MagnifyingGlass className="magnifying-glass"/> */}
                        <input 
                            onChange={(e) => searchDispatch({ 
                                type: ACTIONS.UPDATE_SEARCH, 
                                payload: {value: e.target.value}})
                            }
                            type="text" 
                            value={searchState.search}
                            placeholder="Search by title, composer, etc.">
                        </input>
                        
                    </div>
                </div>

                {/* <label htmlFor="techniques"><h3>Techniques</h3></label> */}
                <div id="technique-container">
                    {techniques && techniques.map(technique => (
                        <TechniqueTag 
                            techniqueValue={techniqueValue}
                            key={technique.id} 
                            searchDispatch={searchDispatch} 
                            searchState={searchState}
                            technique={technique} 
                        />
                    ))}
                </div>

                <div className="search-flex">
                    <div className="label-input-container">
                        <label id="difficulty-label" htmlFor="difficulty-comparison"><h3>Difficulty</h3></label>
                        <select 
                            onChange={(e) => searchDispatch({
                                type: ACTIONS.UPDATE_DIFF_COMP,
                                payload: {value: e.target.value}})} 
                            id="difficulty-comparison"
                            value={searchState.difficultyComp}
                        >   
                            <option value="gt">≥</option>
                            <option value="lt">≤</option>
                            <option value="eq">=</option>
                        </select>
                        <input 
                            onChange={(e) => searchDispatch({
                                type: ACTIONS.UPDATE_DIFF_NUM,
                                payload: {value: e.target.value}})} 
                            id="difficulty-level" 
                            type="number"
                            value={searchState.difficultyNum} 
                            max="10" 
                            min="1">
                        </input>
                    </div>

                    <div className="label-input-container">
                        <label id="complete-label" htmlFor="complete"><h3>Completion</h3></label>
                        <select 
                            onChange={(e) => searchDispatch({
                                type: ACTIONS.UPDATE_COMPLETE,
                                payload: {value: e.target.value}})} 
                            id="complete" 
                            type="select"
                            value={searchState.complete}
                        >
                            <option value="all">Show All</option>
                            <option value="complete">Complete Only</option>
                            <option value="incomplete">Incomplete Only</option>
                        </select>
                    </div>

                    <div className="label-input-container">
                        <label id="period-label" htmlFor="period"><h3>Period</h3></label>
                        <select 
                            onChange={(e) => searchDispatch({
                                type: ACTIONS.UPDATE_PERIOD,
                                payload: {value: e.target.value}})} 
                            id="period" 
                            type="select"
                            value={searchState.period}
                        >
                            <option value=""></option>
                            <option value="Baroque">Baroque</option>
                            <option value="Classical">Classical</option>
                            <option value="Romantic">Romantic</option>
                            <option value="20th Century">20th Century</option>
                            <option value="Contemporary">Contemporary</option>
                        </select>
                    </div>

                    <div className="label-input-container">
                        <label id="type-label" htmlFor="type"><h3>Type</h3></label>
                        <select 
                            onChange={(e) => searchDispatch({
                                type: ACTIONS.UPDATE_TYPE,
                                payload: {value: e.target.value}})} 
                            id="type" 
                            type="select"
                            value={searchState.type}
                        >
                            <option value=""></option>
                            <option value="Sonata">Sonata</option>
                            <option value="Etude">Etude</option>
                            <option value="Concerto">Concerto</option>
                            <option value="Miniature">Miniature</option>
                            <option value="Showpiece">Showpiece</option>
                            <option value="Exercise">Exercise</option>
                            <option value="Suite">Suite</option>
                        </select>
                    </div>
                    
                </div>
                <div className="search-flex">
                    <div className="label-input-container">
                        <label id="category-label" htmlFor="category-sort"><h3>Sort Categories By</h3></label>
                        <select 
                            onChange={(e) => searchDispatch({
                                type: ACTIONS.UPDATE_CATEGORY_SORT,
                                payload: {value: e.target.value}})} 
                            id="category-sort" 
                            type="select"
                            value={searchState.categorySort}
                        >
                            <option value="difficulty">Difficulty</option>
                            <option value="title">Title</option>
                            <option value="completion">Completion</option>
                        </select>
                    </div>

                    <div className="label-input-container">
                        <label id="sort-label" htmlFor="sort"><h3>Sort Pieces By</h3></label>
                        <select 
                            onChange={(e) => searchDispatch({
                                type: ACTIONS.UPDATE_SORT,
                                payload: {value: e.target.value}})} 
                            id="sort" 
                            type="select"
                            value={searchState.sortBy}
                        >
                            <option value="title">Title</option>
                            <option value="difficulty">Difficulty</option>
                            <option value="mastery">Mastery Level</option>
                            <option value="composer">Composer</option>
                            <option value="date-updated">Date Updated</option>
                            <option value="date-created">Date Created</option>
                        </select>
                    </div>
                    <button onClick={handleClear}>Clear</button>

                    <button onClick={() => searchDispatch({
                        type: ACTIONS.REFRESH
                    })}>Refresh</button>

                </div>
      
                {/* <h3>Showing {pieceCount} pieces.</h3> */}
            </div>
        </div>
     );
}
 
export default Search;