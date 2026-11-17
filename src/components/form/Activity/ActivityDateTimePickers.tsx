"use client";

import React from "react";
import { EventDatePicker, EventTimePicker } from "@/components/form/event/EventDateTimePickers";

interface ActivityDateTimePickersProps {
  date: string;
  end_date: string;
  start_time: string;
  end_time: string;

  onDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

export default function ActivityDateTimePickers({
  date,
  end_date,
  start_time,
  end_time,
  onDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
}: ActivityDateTimePickersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label htmlFor="activity-date" className="text-sm font-medium">
          Start Date
        </label>
        <EventDatePicker id="activity-date" value={date} onChange={onDateChange} />
      </div>

      <div className="space-y-2">
        <label htmlFor="activity-end-date" className="text-sm font-medium">
          End Date
        </label>
        <EventDatePicker
          id="activity-end-date"
          value={end_date}
          minDate={date || undefined}
          onChange={onEndDateChange}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="activity-start-time" className="text-sm font-medium">
          Start Time
        </label>
        <EventTimePicker
          id="activity-start-time"
          value={start_time}
          onChange={onStartTimeChange}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="activity-end-time" className="text-sm font-medium">
          End Time
        </label>
        <EventTimePicker
          id="activity-end-time"
          value={end_time}
          onChange={onEndTimeChange}
        />
      </div>
    </div>
  );
}
