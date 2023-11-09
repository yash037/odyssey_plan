import './css/Calander.css'
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
export default function CalendarStyled ( {setDate , date} ){
    
    return(
        <Calendar shouldHighlightWeekends calendarClassName='responsive-calendar' value={date} onChange={setDate}></Calendar>
    )
}