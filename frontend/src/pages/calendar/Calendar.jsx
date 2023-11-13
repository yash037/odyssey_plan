import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import AddEventModal from './AddEventModal';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';

const Calendar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const calendarRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  const onEventAdded = (event) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.addEvent(event);

    setModalOpen(false);
  };

  const handleEventDeleted = () => {
    if (selectedEvent) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.getEventById(selectedEvent.id).remove();

      setModalOpen(false);
    }
  };

  const customButtons = {
    monthButton: {
      text: 'Month',
      click: () => changeView('dayGridMonth'),
    },
    weekButton: {
      text: 'Week',
      click: () => changeView('timeGridWeek'),
    },
    dayButton: {
      text: 'Day',
      click: () => changeView('timeGridDay'),
    },
    listButton: {
      text: 'List',
      click: () => changeView('listWeek'),
    },
    yearButton: {
      text: 'Year',
      click: () => changeView('multiMonthYear'),
    },
  };

  const changeView = (viewName) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(viewName);
  };

  const handleDateClick = (arg) => {
    setModalOpen(true);
  };

  const handleEventClick = (arg) => {
    setSelectedEvent(arg.event);
    setModalOpen(true);
  };


  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '20px',
      }}
    >
      <button
        onClick={() => {
          setSelectedEvent(null);
          setModalOpen(true);
        }}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          marginBottom: '20px',
        }}
      >
        Add Event
      </button>

      <div
        style={{
          position: 'relative',
          zIndex: 0,
          width: '100%', 
          maxWidth: '800px', 
          maxHeight: '800px',
        }}
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
            multiMonthPlugin,
          ]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'monthButton,weekButton,dayButton,listButton,yearButton',
          }}
          customButtons={customButtons}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          eventResizable={true} 
          eventResizableFromStart={true} 
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={events} // Set events explicitly
        />
      </div>

      <AddEventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedEvent(null);
        }}
        onEventAdded={(event) => onEventAdded(event)}
        onDelete={handleEventDeleted}
        event={selectedEvent}
      />
    </section>
  );
};

export default Calendar;
