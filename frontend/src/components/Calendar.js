import { useEffect, useRef, useState } from "react";
import CalendarBox from "./CalendarBox";

const Calendar = ({ userPieces }) => {
    const [days, setDays] = useState([]);
    const [year, setYear] = useState(2023);
    const [yearList, setYearList] = useState([]);
    const selectRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [datePieceList, setDatePieceList] = useState([]);

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
        setSelectedDate(day);
        setDatePieceList(matchedPieces);
    }


    return ( 
        <div className="chart-column">
            <h1>Calendar</h1>
                
            
            <div className="cal-container">
                {days.map(day => (
                    <CalendarBox
                        day={day}
                        year={year}
                        selectedDate={selectedDate}
                        userPieces={userPieces}
                        handleBoxClick={handleBoxClick}
                    />
                ))}
            </div>
            <select 
                    value={year} 
                    onChange={(e) => {
                        setYear(e.target.value);
                        setSelectedDate(null);
                        setDatePieceList([]);
                    } 
                    }
                    ref={selectRef} 
                    id="cal-select"
                >
                    {yearList.map(year => (
                        <option value={year}>{year}</option>
                    ))}
                </select>
            <div id="calendar-detail">
                {selectedDate ? 
                    <div>
                        <p id="calendar-date">
                            {`${selectedDate.toLocaleString(
                                'en-US', {weekday: 'long', month: 'long', day: 'numeric'})}, ${year}`}
                        </p>
                        <div id="technique-container">
                        {(selectedDate && datePieceList.length !== 0) ? datePieceList.map(datePiece => (
                            <div className="technique-tag">
                                <p>{`${datePiece.piece.category.name} - ${datePiece.piece.title}`}</p>

                            </div>
                        )) :
                        <p className="calendar-paragraph">No pieces completed on this day.</p>
                        }
                        </div>
                    </div>
                    :
                    <p className="calendar-paragraph">Please select a date on the calendar.</p>
                }



                
            </div>

        </div>
     );
}
 
export default Calendar;