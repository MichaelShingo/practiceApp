import { useEffect, useRef, useState } from 'react';
import CalendarBox from './CalendarBox';

const Calendar = ({ userPieces }) => {
  const [days, setDays] = useState([]);
  const [year, setYear] = useState(2023);
  const [yearList, setYearList] = useState([]);
  const selectRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [datePieceList, setDatePieceList] = useState([]);

  const monthLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const weekdayLabels = ['Sun', 'Wed', 'Sat'];
  useEffect(() => {
    populateDays();
  }, [year]);

  function isLeapYear(year) {
    // Feb is 29 days in a leap year, instead of 28
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  function getFirstDayOfYear(year) {
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeek = firstDayOfYear.getDay();
    return dayOfWeek;
  }

  const populateDays = () => {
    let dayList = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const daysInYear = isLeapYear(year) ? 366 : 365;
    const firstDayOfWeek = getFirstDayOfYear(year);

    for (let i = 0; i < firstDayOfWeek; i++) {
      dayList.push(new Date(1900, 0, 1));
      console.log('pushed 1900', i)
    }
    for (let day = 0; day < daysInYear; day++) {
      const dateInYear = new Date(year, 0, day + 1);
      dayList.push(dateInYear);
    }
    setDays(dayList);
    setYear(year);

    let yearList = [];
    for (let i = 2015; i <= currentYear; i++) {
      yearList.push(i);
    }
    setYearList(yearList);
  };

  const handleBoxClick = (matchedPieces, day) => {
    setSelectedDate(day);
    setDatePieceList(
      matchedPieces.sort((a, b) =>
        a.piece.category.name.localeCompare(b.piece.category.name)
      )
    );
  };

  return (
    <div className="chart-column" id="calendar-column">
      <h1>Calendar</h1>

      <div className="cal-container">
        <div id="month-row">
          {monthLabels.map((month) => (
            <p key={month}>{month}</p>
          ))}
        </div>
        <div id="weekday-col">
          {weekdayLabels.map((weekday) => (
            <p key={weekday}>{weekday}</p>
          ))}
        </div>
        {days.map((day, index) => (
          <CalendarBox
            day={day}
            key={index}
            year={year}
            selectedDate={selectedDate}
            userPieces={userPieces}
            handleBoxClick={handleBoxClick}
          />
        ))}
      </div>
      <div className="select-container">
        <select
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            setSelectedDate(null);
            setDatePieceList([]);
          }}
          ref={selectRef}
          id="cal-select"
        >
          {yearList.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div id="calendar-detail">
        {selectedDate ? (
          <div>
            <p id="calendar-date">
              {`${selectedDate.toLocaleString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}, ${year}`}
            </p>
            <div id="calendar-technique-container">
              {selectedDate && datePieceList.length !== 0 ? (
                datePieceList.map((datePiece) => (
                  <div key={datePiece} className="technique-tag">
                    <p>{`${datePiece.piece.category.name} - ${datePiece.piece.title}`}</p>
                  </div>
                ))
              ) : (
                <p className="calendar-paragraph">
                  No pieces completed on this day.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="calendar-paragraph">
            Please select a date on the calendar.
          </p>
        )}
      </div>
    </div>
  );
};

export default Calendar;
