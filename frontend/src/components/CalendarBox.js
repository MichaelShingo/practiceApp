import { useEffect, useState } from "react";

const CalendarBox = ({ day, year, userPieces, handleBoxClick }) => {
    const [isActive, setIsActive] = useState(false);
    const [matchedPieces, setMatchedPieces] = useState([]);

    useEffect(() => {
        let matches = [];
        let active = false;
        // setIsActive(false);
        for (let userPiece of userPieces) {
            const date = new Date(userPiece.created_at);
            const yearMatch = parseInt(date.getFullYear()) === parseInt(year);
            const monthMatch = parseInt(date.getMonth()) === parseInt(day.getMonth());
            const dayMatch = date.getDate() === day.getDate();

            if (yearMatch && monthMatch && dayMatch) {
                    matches.push(userPiece);
                    active = true;
            }
        }
        setMatchedPieces(matches);
        setIsActive(active);
    }, [year])

    return ( 
        <div 
            className="cal-box"
            onClick={() => handleBoxClick(matchedPieces, day)}
            style={{
                backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-grey-1'
            }}
            
        >
        </div>
     );
}
 
export default CalendarBox;