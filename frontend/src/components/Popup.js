import { useState } from 'react';

const Popup = ({popupClass, position, message}) => {
    // show: bool, message: string
    // based on the show prop, you set the className to something


    return ( 
        <div className={popupClass}>
            <p>{message}</p>
        </div>
        
     );
}

 //style={{bottom: position.x, right: position.y}}
export default Popup;