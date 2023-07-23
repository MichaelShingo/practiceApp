import {ReactComponent as MagnifyingGlass} from '../svg/magnifying-glass-solid.svg';
import { useState, useEffect } from 'react';
import { fetchTechniques } from '../services/fetch';
import { host } from '../services/urls';
import TechniqueTag from './TechniqueTag';
import {ACTIONS} from '../Practice';

const Search = ({
                searchDispatch,
            }) => {

    const [techniques, setTechniques] = useState();

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

    return ( 
        <div id="search-container" className="table-container">
            <div className="row">
                <div className="col-0-5"></div>
                <div id="search-column" className="col-11">
                    <div id="search-box-container">
                        <div id="search-input-container">
                            {/* <MagnifyingGlass className="magnifying-glass"/> */}
                            <input 
                                onChange={(e) => searchDispatch({ 
                                    type: ACTIONS.UPDATE_SEARCH, 
                                    payload: {value: e.target.value}})
                                }
                                type="text" 
                                placeholder="Search by title, composer, etc.">
                            </input>
                            
                        </div>
                    </div>

                    {/* <label htmlFor="techniques"><h3>Techniques</h3></label> */}
                    <div id="technique-container">
                        {techniques && techniques.map(technique => (
                            <TechniqueTag searchDispatch={searchDispatch} technique={technique} />
                        ))}
                    </div>

                    <div id="search-flex">
                        <div className="label-input-container">
                            <label id="difficulty-label" htmlFor="difficulty-comparison"><h3>Difficulty</h3></label>
                            <select 
                                onChange={(e) => searchDispatch({
                                    type: ACTIONS.UPDATE_DIFF_COMP,
                                    payload: {value: e.target.value}})} 
                                id="difficulty-comparison"
                            >
                                <option value="eq">equal to</option>
                                <option value="gt">greater than</option>
                                <option value="lt">less than</option>
                            </select>
                            <input 
                                onChange={(e) => searchDispatch({
                                    type: ACTIONS.UPDATE_DIFF_NUM,
                                    payload: {value: e.target.value}})} 
                                id="difficulty-level" 
                                type="number" 
                                max="10" 
                                min="0">
                            </input>
                        </div>

                        <div className="label-input-container">
                            <label id="sort-label" htmlFor="sort"><h3>Sort By</h3></label>
                            <select 
                                onChange={(e) => searchDispatch({
                                    type: ACTIONS.UPDATE_SORT,
                                    payload: {value: e.target.value}})} 
                                id="sort" 
                                type="select"
                            >
                                <option value="difficulty">Difficulty</option>
                                <option value="mastery">Mastery Level</option>
                                <option value="title">Title</option>
                                <option value="composer">Composer</option>
                                <option value="date-updated">Date Updated</option>
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
                            >
                                <option value="baroque">Baroque</option>
                                <option value="classical">Classical</option>
                                <option value="romantic">Romantic</option>
                                <option value="20th">20th Century</option>
                                <option value="contemporary">Contemporary</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="col-0-5"></div>
            </div>
        </div>
     );
}
 
export default Search;