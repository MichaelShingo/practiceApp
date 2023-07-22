import { useState } from 'react';

const TechniqueTag = ({ technique }) => {
    const [selected, setSelected] = useState(false);

    const handleClick = () => {
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