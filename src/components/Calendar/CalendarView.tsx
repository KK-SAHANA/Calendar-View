import React, { useState, useEffect } from "react";

interface EventItem {
  id: number;
  date: string;
  title: string;
}

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<EventItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState("");
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startDate = new Date(year, month, 1);
  const startDay = startDate.getDay();
  const days: Date[] = [];

  const date = new Date(startDate);
  date.setDate(date.getDate() - startDay);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  // ✅ Load events from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("calendarEvents");
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  // ✅ Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const openModal = (date: Date, event?: EventItem) => {
    setSelectedDate(date);
    setShowModal(true);
    if (event) {
      setEditingEvent(event);
      setNewEvent(event.title);
    } else {
      setEditingEvent(null);
      setNewEvent("");
    }
  };

  const saveEvent = () => {
    if (!selectedDate || !newEvent.trim()) return;
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEvent.id ? { ...e, title: newEvent } : e
        )
      );
    } else {
      const newItem: EventItem = {
        id: Date.now(),
        date: selectedDate.toDateString(),
        title: newEvent,
      };
      setEvents((prev) => [...prev, newItem]);
    }
    setNewEvent("");
    setShowModal(false);
  };

  const deleteEvent = (id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setShowModal(false);
  };

  const eventsForDay = (date: Date) =>
    events.filter((e) => e.date === date.toDateString());

  const today = new Date();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="p-6 max-w-lg mx-auto bg-gradient-to-b from-blue-100 to-white rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          aria-label="Go to previous month"
          onClick={prevMonth}
          className="px-3 py-1 bg-blue-300 text-blue-900 rounded-lg hover:bg-blue-400 transition"
        >
          ◀ Prev
        </button>
        <h1 className="text-2xl font-bold text-blue-900">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h1>
        <button
          aria-label="Go to next month"
          onClick={nextMonth}
          className="px-3 py-1 bg-blue-300 text-blue-900 rounded-lg hover:bg-blue-400 transition"
        >
          Next ▶
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center mb-1 font-semibold text-blue-900">
        {weekDays.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isToday = day.toDateString() === today.toDateString();
          const isCurrentMonth = day.getMonth() === month;
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const dayEvents = eventsForDay(day);

          return (
            <div
              key={index}
              role="button"
              aria-label={`Day ${day.getDate()} ${
                isCurrentMonth ? "" : "(not current month)"
              }`}
              tabIndex={0}
              onClick={() => openModal(day)}
              onKeyDown={(e) => e.key === "Enter" && openModal(day)}
              className={`border p-2 h-24 text-sm rounded-xl cursor-pointer transition 
                ${
                  isCurrentMonth
                    ? isWeekend
                      ? "bg-red-200 hover:bg-red-300"
                      : "bg-white hover:bg-blue-100"
                    : "bg-gray-300 text-gray-700"
                }
                ${isToday ? "border-blue-700 shadow-md" : ""}
              `}
            >
              <div className="font-semibold text-gray-900">
                {day.getDate()}
              </div>
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="mt-1 text-xs bg-green-300 text-green-900 px-2 py-1 rounded-lg truncate"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(day, event);
                  }}
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
        >
          <div className="bg-white p-5 rounded-lg shadow-lg w-80">
            <h2 id="event-modal-title" className="text-lg font-bold mb-3 text-blue-900">
              {editingEvent
                ? `Edit Event (${selectedDate?.toDateString()})`
                : `Add Event for ${selectedDate?.toDateString()}`}
            </h2>

            <input
              aria-label="Event title"
              type="text"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              placeholder="Enter event title"
              className="border w-full p-2 rounded mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <div className="flex justify-between">
              {editingEvent && (
                <button
                  aria-label="Delete event"
                  onClick={() => deleteEvent(editingEvent.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              )}
              <div className="ml-auto flex space-x-2">
                <button
                  aria-label="Cancel event creation"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  aria-label={editingEvent ? "Update event" : "Save event"}
                  onClick={saveEvent}
                  className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
                >
                  {editingEvent ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
