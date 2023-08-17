import { useEffect, useState, useContext } from 'react';
import { TooltipContext } from '../App';

import { mapColorRange } from '../services/helperFunctions.js';

const TechniqueBox = ({ 
    technique, 
    averages, 
} ) => {
    const avg = averages.get(technique.id);
    // const hue = avg !== -1 ? `hsl(${mapColorRange(avg)}, 100%, 38%)` : 'var(--color-grey-2)';`rgba(4, 108, 243, ${avg / 10})`
    const [hue, setHue] = useState('var(--color-grey-3)');
    const [setShowTooltip, setMessage] = useContext(TooltipContext);


    useEffect(() => {
        // const calculatedHue = avg !== -1 ? 'var(--color-accent)' : 'var(--color-grey-2)';
        const calculatedHue = avg !== -1 ? `hsl(212.4deg, ${(avg * 10)}%, 48%)` : 'var(--color-grey-2)';

        
        setHue(calculatedHue);
    }, [averages])
    return ( 
        <div 
            className="technique-box"
            style={{backgroundColor: hue}}
            onMouseEnter={() => {
                setMessage(avg !== -1 ? `Mastery Level: ${avg.toFixed(2)}` : 'Not practiced yet.')
                setShowTooltip(true);
            }}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <p>{technique.name}</p>
        </div>
     );
}
 
export default TechniqueBox;