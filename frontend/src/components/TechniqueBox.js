import { useEffect, useState } from 'react';
import { mapColorRange } from '../services/helperFunctions.js';

const TechniqueBox = ({ 
    technique, 
    averages, 
    handleOnMouseLeave, 
    handleOnMouseEnter
} ) => {
    const avg = averages.get(technique.id);
    const hue = avg !== -1 ? `hsl(${mapColorRange(avg)}, 100%, 38%)` : 'var(--color-grey-2)';
    

    

    return ( 
        <div 
            className="technique-box"
            style={{backgroundColor: hue}}
            onMouseEnter={() => handleOnMouseEnter(`Mastery Level: ${avg}`)}
            onMouseLeave={handleOnMouseLeave}
        >
            
            <p>{technique.name}</p>
        </div>
     );
}
 
export default TechniqueBox;