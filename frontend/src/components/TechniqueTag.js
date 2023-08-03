import { useState } from 'react';
import { ACTIONS } from '../Practice';
import { useEffect } from 'react';

const TechniqueTag = ({ technique, searchDispatch, searchState, techniqueValue }) => {
    const [selected, setSelected] = useState(false);
    // searchState.techniqueTags.has(technique.id

    useEffect(() => {
        setSelected(false);
    }, [techniqueValue])
    const handleClick = () => {
        searchDispatch({
            type: ACTIONS.UPDATE_TECHNIQUE,
            payload: {value: technique.id}
        });

        setSelected((selected) => !selected);

    }
    return ( 
        <div 
            onClick={handleClick} 
            className={selected ? 'technique-tag selected' : 'technique-tag'}
        >
            <p>{technique.name}</p>
        </div> 
    );
}
 
export default TechniqueTag;