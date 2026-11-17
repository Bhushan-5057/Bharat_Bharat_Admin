"use client";

import React, { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { TimeInput } from "@/components/ui/time-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover/popover";

interface EventDatePickerProps {
    id: string;
    value?: string;
    minDate?: string;
    onChange: (value: string) => void;
}

interface EventTimePickerProps {
    id: string;
    value?: string;
    /** Minimum selectable time in "HH:MM" format */
    minTime?: string;
    /** Maximum selectable time in "HH:MM" format */
    maxTime?: string;
    onChange: (value: string) => void;
}

interface CalendarCell {
    key: string;
    value: string;
    label: number;
    inCurrentMonth: boolean;
    disabled: boolean;
}

const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const toDateOnly = (value: Date) => {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const normalizeDate = (value: Date) => {
    const clone = new Date(value);
    clone.setHours(0, 0, 0, 0);
    return clone;
};

const parseDateValue = (value?: string) => {
    if (!value) return null;
    const input = value.trim();
    if (!input) return null;

    // Keep calendar date stable across timezones by parsing YYYY-MM-DD directly.
    const ymdMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (ymdMatch) {
        const year = Number(ymdMatch[1]);
        const month = Number(ymdMatch[2]);
        const day = Number(ymdMatch[3]);
        const localDate = new Date(year, month - 1, day);

        if (
            localDate.getFullYear() === year &&
            localDate.getMonth() === month - 1 &&
            localDate.getDate() === day
        ) {
            return normalizeDate(localDate);
        }
    }

    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) return null;
    return normalizeDate(parsed);
};

const clampMonthToMin = (date: Date, minDate?: Date | null) => {
    if (!minDate) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const minStart = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    return monthStart < minStart ? minStart : monthStart;
};

const buildCalendarCells = (viewMonth: Date, minDate?: Date | null) => {
    const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const mondayIndex = (firstDay.getDay() + 6) % 7;
    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - mondayIndex);

    const cells: CalendarCell[] = [];
    for (let index = 0; index < 42; index += 1) {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        const normalized = normalizeDate(date);
        cells.push({
            key: `${normalized.getFullYear()}-${normalized.getMonth()}-${normalized.getDate()}`,
            value: toDateOnly(normalized),
            label: normalized.getDate(),
            inCurrentMonth: normalized.getMonth() === viewMonth.getMonth(),
            disabled: minDate ? normalized < minDate : false,
        });
    }
    return cells;
};

const triggerClassName =
    "flex h-10 w-full items-center justify-between rounded-xl border border-gray-300/70 bg-white px-3.5 text-left text-sm shadow-xs transition-all duration-200 hover:border-gray-400 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] sm:h-11 sm:px-4 dark:border-white/10 dark:bg-[#0a1733] dark:text-white";

export function EventDatePicker({ id, value, minDate, onChange }: EventDatePickerProps) {
    const [open, setOpen] = useState(false);
    const today = useMemo(() => normalizeDate(new Date()), []);

    // Only enforce a floor when callers pass minDate. Do not default to today —
    // Activities/Events must allow historical (past) dates.
    const minDateObject = useMemo(() => parseDateValue(minDate), [minDate]);

    const selectedDate = parseDateValue(value);
    const [viewMonth, setViewMonth] = useState<Date>(
        clampMonthToMin(selectedDate ?? today, minDateObject)
    );

    const calendarCells = useMemo(
        () => buildCalendarCells(viewMonth, minDateObject),
        [viewMonth, minDateObject]
    );

    const displayDate = selectedDate
        ? selectedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "Select event date";

    const monthLabel = viewMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    const canGoPreviousMonth = minDateObject
        ? new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1) >
          new Date(minDateObject.getFullYear(), minDateObject.getMonth(), 1)
        : true;

    const openChanged = (nextOpen: boolean) => {
        if (nextOpen) {
            setViewMonth(clampMonthToMin(selectedDate ?? today, minDateObject));
        }
        setOpen(nextOpen);
    };

    return (
        <Popover open={open} onOpenChange={openChanged}>
            <PopoverTrigger asChild>
                <button id={id} type="button" className={triggerClassName}>
                    <span className={selectedDate ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
                        {displayDate}
                    </span>
                    <CalendarDays size={16} className="text-gray-500 dark:text-gray-400" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                side="bottom"
                sideOffset={10}
                collisionPadding={16}
                className="z-[100100] w-[calc(100vw-2rem)] max-h-[min(78vh,520px)] max-w-[190px] overflow-y-auto overscroll-contain pointer-events-auto rounded-xl border border-gray-200 bg-white p-3 text-gray-800 shadow-2xl sm:max-w-[210px] sm:p-3.5 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#242b3c] dark:to-[#1a2234] dark:text-white"
            >
                <div className="mb-3 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() =>
                            canGoPreviousMonth &&
                            setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
                        }
                        disabled={!canGoPreviousMonth}
                        className="rounded-full p-1.5 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <p className="text-sm font-medium leading-none text-gray-900 sm:text-base dark:text-white/95">{monthLabel}</p>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
                            className="rounded-full p-1.5 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="mb-2 grid grid-cols-7">
                    {weekDays.map((day) => (
                        <p key={day} className="py-0.5 text-center text-[10px] font-medium text-gray-500 sm:text-xs dark:text-white/85">
                            {day}
                        </p>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-y-0.5">
                    {calendarCells.map((cell) => {
                        const isSelected = value === cell.value;
                        const buttonClass = cell.disabled
                            ? "text-gray-300 cursor-not-allowed dark:text-white/25"
                            : isSelected
                                ? "border-2 border-[#0ea5ff] bg-[#0ea5ff]/10 text-[#0284c7] dark:text-white"
                                : cell.inCurrentMonth
                                    ? "text-gray-800 hover:bg-gray-100 hover:text-[#0284c7] dark:text-white/95 dark:hover:bg-white/10 dark:hover:text-[#1db6ff]"
                                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-500 dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white/70";

                        return (
                            <button
                                key={cell.key}
                                type="button"
                                disabled={cell.disabled}
                                onClick={() => {
                                    onChange(cell.value);
                                    setOpen(false);
                                }}
                                className={`relative mx-auto flex h-8 w-8 items-center justify-center rounded-sm text-sm font-normal leading-none transition-all duration-200 sm:h-9 sm:w-9 sm:text-sm ${buttonClass}`}
                            >
                                {cell.label}
                                {isSelected && (
                                    <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#0284c7] dark:bg-[#1db6ff]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export function EventTimePicker({ id, value, minTime, maxTime, onChange }: EventTimePickerProps) {
    return (
        <TimeInput
            id={id}
            value={value}
            min={minTime}
            max={maxTime}
            onChange={onChange}
        />
    );
}

