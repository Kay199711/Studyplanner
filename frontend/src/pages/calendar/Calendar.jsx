import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRef } from 'react';

export default function Calendar() {
  const calendarRef = useRef(null);

  return (
<<<<<<< HEAD
    <div className="p-4 md:p-2 bg-[#edede8ff] dark:bg-primary-dark">
=======
    <div className="p-4 md:p-2 bg-secondary dark:bg-primary-dark">
>>>>>>> 0647eec6ca7e704e3552bc9037248dc00fb526a9
      <div className="flex flex-col border-2 border-brd-primary dark:border-brd-primary-dark rounded-xl p-4 bg-primary dark:bg-primary-dark">
        <div className="fullcalendar-wrapper">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            editable={true}
            selectable={true}
            height="auto"
          />
        </div>
      </div>
    </div>
  );
}
<<<<<<< HEAD
}
=======
>>>>>>> 0647eec6ca7e704e3552bc9037248dc00fb526a9
