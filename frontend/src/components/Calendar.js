import { useEffect, useRef, useState } from "react";
import CalendarBox from "./CalendarBox";

const Calendar = ({ userPieces }) => {
    const [days, setDays] = useState([]);
    const [year, setYear] = useState(2023);
    const [yearList, setYearList] = useState([]);
    const selectRef = useRef(null);

    useEffect(() => {
        populateDays();
    }, []);

    const populateDays = () => {
        let dayList = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
    
        for (let day = 0; day < 365; day++) {
            const dateInYear = new Date(currentYear, 0, day + 1);
            dayList.push(dateInYear);
        }
        setDays(dayList);
        setYear(currentYear);

        let yearList = [];
        for (let i = 2015; i <= currentYear; i++) {
            yearList.push(i);
        }
        setYearList(yearList);
    }
    
    const handleBoxClick = (matchedPieces, day) => {
        console.log(matchedPieces, day);
    }
    return ( 
        <div className="chart-column">
         <h1>Calendar</h1>
         <select value={year} onChange={(e) => setYear(e.target.value)} ref={selectRef} id="cal-select">
            {yearList.map(year => (
                <option value={year}>{year}</option>

            ))}
         </select>
         <div className="cal-container">
            {days.map(day => (
                <CalendarBox
                    day={day}
                    year={year}
                    userPieces={userPieces}
                    handleBoxClick={handleBoxClick}
                />
            ))}
         </div>

        </div>
     );
}
 
export default Calendar;