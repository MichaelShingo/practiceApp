import { useEffect, useState } from "react";

const CalendarBox = ({ 
    day, 
    year, 
    userPieces, 
    handleBoxClick, 
    selectedDate 
}) => {
    const [isActive, setIsActive] = useState(false);
    const [matchedPieces, setMatchedPieces] = useState([]);
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        console.log('selectedDate changed');
        let selected = selectedDate ? (selectedDate.getMonth() === day.getMonth() 
            && selectedDate.getDate() === day.getDate()) : false;
        setIsSelected(selected);
    }, [selectedDate])
    

    useEffect(() => {
        let matches = [];
        let active = false;
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
    }, [year, userPieces])

    return ( 
        <div 
            className="cal-box"
            onClick={() => handleBoxClick(matchedPieces, day)}
            style={{
                backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-grey-1',
                transform: isSelected ? 'rotate(45deg)' : 'rotate(0deg)'
            }}
            
        >
        </div>
     );
}
 
export default CalendarBox;