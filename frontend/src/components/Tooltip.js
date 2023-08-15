import { useEffect, useRef } from 'react';
import useMousePosition from '../services/useMousePosition';

const Tooltip = ({ visible, message }) => {
    const tooltipRef = useRef(null);
    const mousePosition = useMousePosition();

    const handleOnClick = (e) => {
        e.stopPropagation();
    }

    useEffect(() => {
        if (visible) {
            tooltipRef.current.style.opacity = 1;
        } else {
            tooltipRef.current.style.opacity = 0;
        }
    }, [visible])
   
    useEffect(() => {
        if (mousePosition && visible) {
            tooltipRef.current.style.top = mousePosition.y + 'px';
            tooltipRef.current.style.left = mousePosition.x + 'px';
        }
        // console.log(mousePosition);
    }, [mousePosition])
    
    return ( 
        <div onClick={(e) => handleOnClick(e)} ref={tooltipRef} className="tooltip-container">
            <p>{message}</p>
        </div>
        
     );
}

export default Tooltip;
