import { useEffect, useState, useRef } from 'react';
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
    }, [mousePosition])
    
    return ( 
        <div onClick={(e) => handleOnClick(e)} ref={tooltipRef} className="tooltip-container">
            <p>{message}</p>
        </div>
        
     );
}

 //style={{bottom: position.x, right: position.y}}
export default Tooltip;

// set popup styles inside this component
// position equal to mouse position
// useEffect runs when parent component showPopup state changes. 
// in useEffect, change style to opacity 1, on unmount, change opacity to 0
// onHoverX function in parent sets message text for the popup (stored as state in the parent)