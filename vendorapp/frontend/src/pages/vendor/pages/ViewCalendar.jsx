import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../../styles/ViewCalendar.css";

function CalendarView() {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", textAlign: "center", margin: "3rem" }}>
        Plan Schedule
      </h1>
      <div id="calendar">
        <Calendar onChange={onChange} value={date} />
      </div>
    </div>
  );
}

export default CalendarView;
