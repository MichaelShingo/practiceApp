import { useState, useEffect, useContext } from 'react';
import TechniqueTag from './TechniqueTag';
import { ACTIONS, UserPieceLoadingContext } from '../Practice';
import { defaultSearchState } from '../Practice';
import { host } from '../services/urls';

const Search = ({
  searchDispatch,
  searchState,
  pieceCount,
  refreshActive,
  setRefreshActive,
  techniques,
}) => {
  const [techniqueValue, setTechniqueValue] = useState(0);
  const [updatingUserPiece, setUpdatingUserPiece] = useContext(
    UserPieceLoadingContext
  );
  const [keys, setKeys] = useState([]);
  const [meters, setMeters] = useState([]);

  const fetchKeys = async () => {
    const url = `${host}/api/periods/`;
    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      const jsonData = await response.json();
      setKeys(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };
  
  const fetchMeters = async () => {
    const url = `${host}/api/types/`;
    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      const jsonData = await response.json();
      setMeters(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchMeters();
    fetchKeys();
  }, []);

  const handleRefresh = () => {
    searchDispatch({ type: ACTIONS.REFRESH });
    setRefreshActive(false);
  };

  const compareObj = (objA, objB) => {
    let res = true;
    Object.keys(objB).forEach((key) => {
      if (key === 'techniqueTags' && objA.techniqueTags.size !== 0) {
        res = false;
      } else if (
        key !== 'techniqueTags' &&
        (!objA.hasOwnProperty(key) || objA[key] != objB[key])
      ) {
        res = false;
      }
    });
    return res;
  };

  const handleClear = () => {
    setTechniqueValue((prev) => prev + 1);
    setRefreshActive(false);
    searchDispatch({
      type: ACTIONS.CLEAR,
    });
  };

  return (
    <div id="search-container" className="table-container">
      <div id="search-column">
        {/* <div
          className="search-loading-container"
          style={{
            opacity: updatingUserPiece ? 1 : 0,
            pointerEvents: updatingUserPiece ? 'auto' : 'none',
          }}
        >
          <LoadingIcon />
        </div> */}

        <div id="search-box-container">
          <div id="search-input-container">
            {/* <MagnifyingGlass className="magnifying-glass"/> */}
            <input
              onChange={(e) =>
                searchDispatch({
                  type: ACTIONS.UPDATE_SEARCH,
                  payload: { value: e.target.value },
                })
              }
              type="text"
              value={searchState.search}
              style={{
                borderColor:
                  searchState.search === defaultSearchState.search
                    ? 'var(--color-grey-2)'
                    : 'var(--color-accent)',
              }}
              placeholder="Search by title, composer, etc."
            ></input>
          </div>
        </div>

        {/* <label htmlFor="techniques"><h3>Techniques</h3></label> */}
        <div
          id="technique-container"
          style={{
            borderColor:
              searchState.techniqueTags.size === 0
                ? 'var(--color-grey-2)'
                : 'var(--color-accent)',
          }}
        >
          {techniques &&
            techniques.map((technique) => (
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
            <label id="difficulty-label" htmlFor="difficulty-comparison">
              <h3>Difficulty</h3>
            </label>
            <select
              onChange={(e) =>
                searchDispatch({
                  type: ACTIONS.UPDATE_DIFF_COMP,
                  payload: { value: e.target.value },
                })
              }
              id="difficulty-comparison"
              value={searchState.difficultyComp}
              style={{
                borderColor:
                  searchState.difficultyComp ===
                  defaultSearchState.difficultyComp
                    ? 'var(--color-grey-2)'
                    : 'var(--color-accent)',
              }}
            >
              <option value="gt">≥</option>
              <option value="lt">≤</option>
              <option value="eq">=</option>
            </select>
            <select
              onChange={(e) =>
                searchDispatch({
                  type: ACTIONS.UPDATE_DIFF_NUM,
                  payload: { value: e.target.value },
                })
              }
              id="difficulty-level"
              value={searchState.difficultyNum}
              style={{
                borderColor:
                  searchState.difficultyNum === defaultSearchState.difficultyNum
                    ? 'var(--color-grey-2)'
                    : 'var(--color-accent)',
              }}
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
            </select>
            {/* <input 
                            onChange={(e) => searchDispatch({
                                type: ACTIONS.UPDATE_DIFF_NUM,
                                payload: {value: e.target.value}})} 
                            id="difficulty-level" 
                            type="number"
                            value={searchState.difficultyNum} 
                            max="10" 
                            min="1"
                            style={{borderColor: searchState.difficultyNum === 
                                defaultSearchState.difficultyNum ?
                                'var(--color-grey-2)':
                                 'var(--color-accent)'}}
                        >
                         
                        </input> */}
          </div>

          <div className="label-input-container">
            <label id="complete-label" htmlFor="complete">
              <h3>Completion</h3>
            </label>
            <select
              onChange={(e) =>
                searchDispatch({
                  type: ACTIONS.UPDATE_COMPLETE,
                  payload: { value: e.target.value },
                })
              }
              id="complete"
              type="select"
              value={searchState.complete}
              style={{
                borderColor:
                  searchState.complete === defaultSearchState.complete
                    ? 'var(--color-grey-2)'
                    : 'var(--color-accent)',
              }}
            >
              <option value="all">Show All</option>
              <option value="complete">Complete Only</option>
              <option value="incomplete">Incomplete Only</option>
            </select>
          </div>

          <div className="label-input-container">
            <label id="period-label" htmlFor="period">
              <h3>Key</h3>
            </label>
            <select
              onChange={(e) =>
                searchDispatch({
                  type: ACTIONS.UPDATE_PERIOD,
                  payload: { value: e.target.value },
                })
              }
              id="period"
              type="select"
              value={searchState.period}
              style={{
                borderColor:
                  searchState.period === defaultSearchState.period
                    ? 'var(--color-grey-2)'
                    : 'var(--color-accent)',
              }}
            >
              <option value=""></option>
              {keys && keys.map((key) => (
                <option value={key.name}>{key.name}</option>
              ))}
            
            </select>
          </div>

          <div className="label-input-container">
            <label id="type-label" htmlFor="type">
              <h3>Meter</h3>
            </label>
            <select
              onChange={(e) =>
                searchDispatch({
                  type: ACTIONS.UPDATE_TYPE,
                  payload: { value: e.target.value },
                })
              }
              id="type"
              type="select"
              value={searchState.type}
              style={{
                borderColor:
                  searchState.type === defaultSearchState.type
                    ? 'var(--color-grey-2)'
                    : 'var(--color-accent)',
              }}
            >
              <option value=""></option>
              {meters && meters.map((meter) => (
                <option value={meter.name}>{meter.name}</option>
              ))}
          
            </select>
          </div>
        </div>
        <div className="search-flex">
        <div className="label-input-container">
            <label id="tempo-label" htmlFor="tempo-filter">
              <h3>Tempo</h3>
            </label>
            <select
              onChange={(e) =>
                searchDispatch({
                  type: ACTIONS.UPDATE_TEMPO,
                  payload: { value: e.target.value },
                })
              }
              id="tempo-filter"
              type="select"
              value={searchState.tempo}
              style={{
                borderColor:
                  searchState.tempo === defaultSearchState.tempo
                    ? 'var(--color-grey-2)'
                    : 'var(--color-accent)',
              }}
            >
              <option value=""></option>
              <option value="slow">Slow</option>
              <option value="moderate">Moderate</option>
              <option value="fast">Fast</option>
            </select>
          </div>
          <div className="label-input-container">
            <label id="category-label" htmlFor="category-sort">
              <h3>Sort Categories By</h3>
            </label>
            <select
              onChange={(e) =>
                searchDispatch({
                  type: ACTIONS.UPDATE_CATEGORY_SORT,
                  payload: { value: e.target.value },
                })
              }
              id="category-sort"
              type="select"
              value={searchState.categorySort}
              style={{
                borderColor:
                  searchState.categorySort === defaultSearchState.categorySort
                    ? 'var(--color-grey-2)'
                    : 'var(--color-accent)',
              }}
            >
              <option value="difficulty">Difficulty</option>
              <option value="title">Title</option>
              <option value="completion">Completion</option>
            </select>
          </div>

          <div className="label-input-container">
            <label id="sort-label" htmlFor="sort">
              <h3>Sort Pieces By</h3>
            </label>
            <select
              onChange={(e) =>
                searchDispatch({
                  type: ACTIONS.UPDATE_SORT,
                  payload: { value: e.target.value },
                })
              }
              id="sort"
              type="select"
              value={searchState.sortBy}
              style={{
                borderColor:
                  searchState.sortBy === defaultSearchState.sortBy
                    ? 'var(--color-grey-2)'
                    : 'var(--color-accent)',
              }}
            >
              <option value="title">Title</option>
              <option value="difficulty">Difficulty</option>
              <option value="mastery">Mastery Level</option>
              <option value="composer">Composer</option>
              <option value="date-updated">Date Updated</option>
              <option value="date-created">Date Created</option>
            </select>
          </div>
          
        </div>
        <div className="search-flex">
        <button
            disabled={compareObj(searchState, defaultSearchState)}
            onClick={handleClear}
            style={{
              backgroundColor: compareObj(searchState, defaultSearchState)
                ? 'var(--color-grey-2)'
                : 'var(--color-accent)',
              cursor: compareObj(searchState, defaultSearchState)
                ? 'auto'
                : 'pointer',
            }}
          >
            Clear
          </button>

          <button
            onClick={handleRefresh}
            disabled={!refreshActive}
            style={{
              backgroundColor: refreshActive
                ? 'var(--color-accent)'
                : 'var(--color-grey-2)',
              cursor: refreshActive ? 'pointer' : 'auto',
            }}
          >
            Refresh
          </button>
        </div>

        {/* <h3>Showing {pieceCount} pieces.</h3> */}
      </div>
    </div>
  );
};

export default Search;
