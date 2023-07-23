import { useState } from 'react';
import { ACTIONS } from '../Practice';

const TechniqueTag = ({ technique, searchDispatch }) => {
    const [selected, setSelected] = useState(false);

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