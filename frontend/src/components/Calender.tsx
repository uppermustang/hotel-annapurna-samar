import React, { useState } from "react";

const Calendar: React.FC = () => {
  const [currentDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-deep-blue">
        Booking Calendar
      </h2>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h3>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center font-semibold p-2 text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              className={`
                text-center p-2 h-10 flex items-center justify-center
                ${day ? "hover:bg-blue-100 cursor-pointer" : ""}
                ${
                  day === currentDate.getDate()
                    ? "bg-vibrant-pink text-white rounded"
                    : ""
                }
              `}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h4 className="font-semibold mb-2">Today's Date:</h4>
          <p className="text-gray-600">{formatDate(new Date())}</p>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Click on any date to view bookings (feature coming soon)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
