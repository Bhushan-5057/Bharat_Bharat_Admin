"use client";

import React from "react";
import { EventDatePicker, EventTimePicker } from "@/components/form/event/EventDateTimePickers"; 
// 👆 adjust path where your big component exists

interface ActivityDateTimePickersProps {
  date: string;
  start_time: string;
  end_time: string;

  onDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

export default function ActivityDateTimePickers({
  date,
  start_time,
  end_time,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
}: ActivityDateTimePickersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* DATE */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Event Date</label>

        <EventDatePicker
          id="event-date"
          value={date}
          onChange={onDateChange}
        />
      </div>

      {/* TIME */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Start Time</label>

        <EventTimePicker
          id="start-time"
          value={start_time}
          onChange={onStartTimeChange}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium">End Time</label>

        <EventTimePicker
          id="end-time"
          value={end_time}
          onChange={onEndTimeChange}
        />
      </div>
    </div>
  );
}