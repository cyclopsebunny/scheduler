import { useEffect, useRef, useState } from "react";
import calendarIcon from "../assets/calendar.svg";
import chevronDown from "../assets/chevron-down.svg";
import directionalArrowLeft from "../assets/directionalArrow-left.svg";
import directionalArrowRight from "../assets/directionalArrow-right.svg";

type DateDropdownProps = {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  displayText?: string; // Custom text to display instead of date
  dateRange?: { start: Date; end: Date | null }; // Date range to display (end can be null when selecting)
};

export const DateDropdown = ({
  selectedDate,
  onDateChange,
  minDate,
  maxDate,
  displayText,
  dateRange,
}: DateDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(
    selectedDate ? selectedDate.getMonth() : new Date().getMonth()
  );
  const [calendarYear, setCalendarYear] = useState(
    selectedDate ? selectedDate.getFullYear() : new Date().getFullYear()
  );
  const [selectingStart, setSelectingStart] = useState(true); // Track if selecting start or end date
  const [hoverDate, setHoverDate] = useState<Date | null>(null); // For hover preview
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Format date as "Tuesday, January 6th 2026" or date range as "1/6/26 - 1/12/26"
  const formatDateDisplay = (date: Date | null): string => {
    // If custom display text is provided, use it
    if (displayText) return displayText;
    
    // If date range is provided, format it as "M/D/YY - M/D/YY"
    if (dateRange) {
      const formatShortDate = (d: Date) => {
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const year = d.getFullYear().toString().slice(-2);
        return `${month}/${day}/${year}`;
      };
      return `${formatShortDate(dateRange.start)} - ${formatShortDate(dateRange.end)}`;
    }
    
    if (!date) return "Select Date";
    
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    // Add ordinal suffix (st, nd, rd, th)
    const getOrdinalSuffix = (n: number): string => {
      if (n > 3 && n < 21) return "th";
      switch (n % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${dayName}, ${monthName} ${day}${getOrdinalSuffix(day)} ${year}`;
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePreviousMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(calendarYear, calendarMonth, day);
    date.setHours(0, 0, 0, 0);
    
    // Only apply restrictions if minDate/maxDate are explicitly provided
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return;
    }
    
    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(0, 0, 0, 0);
      if (date > max) return;
    }
    
    // Angular Material style: If dateRange prop exists, we're in range selection mode
    if (dateRange) {
      const currentStart = dateRange.start;
      const currentEnd = dateRange.end;
      
      if (selectingStart || !currentStart) {
        // Selecting start date
        if (currentEnd && date > currentEnd) {
          // If clicking after end, start a new range (this becomes new start)
          onDateChange(date);
          setSelectingStart(false); // Next click will be end
        } else {
          // Set as start date
          onDateChange(date);
          setSelectingStart(false); // Next click will be end
        }
      } else {
        // Selecting end date
        if (date < currentStart) {
          // If clicking before start, this becomes new start
          onDateChange(date);
          setSelectingStart(false); // Next click will be end
        } else {
          // Set as end date
          onDateChange(date);
          setSelectingStart(true); // Reset for next range
          setIsOpen(false); // Close after both dates selected
        }
      }
    } else {
      // Single date selection
      onDateChange(date);
      setIsOpen(false);
    }
    
    setHoverDate(null); // Clear hover on selection
  };

  const isDateInRange = (day: number) => {
    const date = new Date(calendarYear, calendarMonth, day);
    date.setHours(0, 0, 0, 0);
    
    // Only apply restrictions if minDate/maxDate are explicitly provided
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return false;
    }
    
    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(0, 0, 0, 0);
      if (date > max) return false;
    }
    
    return true;
  };

  const isDateSelected = (day: number) => {
    if (dateRange) {
      // For range mode, check if date is start or end
      return isDateRangeStart(day) || isDateRangeEnd(day);
    }
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === calendarMonth &&
      selectedDate.getFullYear() === calendarYear
    );
  };

  const isDateInSelectedRange = (day: number) => {
    if (!dateRange || !dateRange.start) return false;
    const date = new Date(calendarYear, calendarMonth, day);
    date.setHours(0, 0, 0, 0);
    
    // If we have both start and end, check if date is in range
    if (dateRange.end) {
      const start = new Date(dateRange.start);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dateRange.end);
      end.setHours(0, 0, 0, 0);
      return date >= start && date <= end;
    }
    
    // If we only have start and hovering, show preview range
    if (hoverDate) {
      const start = new Date(dateRange.start);
      start.setHours(0, 0, 0, 0);
      const hover = new Date(hoverDate);
      hover.setHours(0, 0, 0, 0);
      
      // Determine actual start and end for preview
      const rangeStart = start < hover ? start : hover;
      const rangeEnd = start < hover ? hover : start;
      
      return date >= rangeStart && date <= rangeEnd;
    }
    
    return false;
  };
  
  const isDateRangeStart = (day: number) => {
    if (!dateRange || !dateRange.start) return false;
    const date = new Date(calendarYear, calendarMonth, day);
    date.setHours(0, 0, 0, 0);
    const start = new Date(dateRange.start);
    start.setHours(0, 0, 0, 0);
    return date.getTime() === start.getTime();
  };
  
  const isDateRangeEnd = (day: number) => {
    if (!dateRange || !dateRange.end) return false;
    const date = new Date(calendarYear, calendarMonth, day);
    date.setHours(0, 0, 0, 0);
    const end = new Date(dateRange.end);
    end.setHours(0, 0, 0, 0);
    return date.getTime() === end.getTime();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === calendarMonth &&
      today.getFullYear() === calendarYear
    );
  };

  // Update calendar month/year when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setCalendarMonth(selectedDate.getMonth());
      setCalendarYear(selectedDate.getFullYear());
    }
  }, [selectedDate]);
  
  // Reset selection state when calendar opens/closes or dateRange changes
  useEffect(() => {
    if (isOpen && dateRange) {
      // If we have both start and end, we're ready to select a new start
      // If we only have start, we're selecting end
      setSelectingStart(!dateRange.start || !!dateRange.end);
    }
  }, [isOpen, dateRange]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        buttonRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={buttonRef}
        className={`input dropdown-toggle date-dropdown-button ${!selectedDate ? "placeholder" : ""} ${isOpen ? "open" : ""}`}
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            if (dateRange && dateRange.start) {
              setCalendarMonth(dateRange.start.getMonth());
              setCalendarYear(dateRange.start.getFullYear());
            } else if (selectedDate) {
              setCalendarMonth(selectedDate.getMonth());
              setCalendarYear(selectedDate.getFullYear());
            }
          }
        }}
      >
        <img 
          className="dropdown-icon"
          src={calendarIcon} 
          alt="" 
          aria-hidden="true"
        />
        <span className="dropdown-value">{formatDateDisplay(selectedDate)}</span>
        <img 
          className="dropdown-chevron"
          src={chevronDown} 
          alt="" 
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div ref={modalRef} className="calendar-modal">
          <div className="calendar-header">
            <div className="calendar-header-left">
              <span className="calendar-month-year">
                {monthNames[calendarMonth]} {calendarYear}
              </span>
              <img
                src={chevronDown}
                alt=""
                className="calendar-dropdown-icon"
              />
            </div>
            <div className="calendar-header-right">
              <button
                type="button"
                className="calendar-nav-button"
                onClick={handlePreviousMonth}
                aria-label="Previous month"
              >
                <img src={directionalArrowLeft} alt="" width="16" height="16" />
              </button>
              <button
                type="button"
                className="calendar-nav-button"
                onClick={handleNextMonth}
                aria-label="Next month"
              >
                <img
                  src={directionalArrowRight}
                  alt=""
                  width="16"
                  height="16"
                />
              </button>
            </div>
          </div>
          <div className="calendar-divider"></div>
          <div className="calendar-days-header">
            {dayNames.map((day, index) => (
              <div key={index} className="calendar-day-header">
                {day}
              </div>
            ))}
          </div>
          <div className="calendar-divider"></div>
          <div className="calendar-grid">
            {Array.from({
              length: getFirstDayOfMonth(calendarMonth, calendarYear),
            }).map((_, index) => (
              <div key={`empty-${index}`} className="calendar-day-empty"></div>
            ))}
            {Array.from({
              length: getDaysInMonth(calendarMonth, calendarYear),
            }).map((_, index) => {
              const day = index + 1;
              const inRange = isDateInRange(day);
              const selected = isDateSelected(day);
              const isStart = isDateRangeStart(day);
              const isEnd = isDateRangeEnd(day);
              const inSelectedRange = isDateInSelectedRange(day);
              const today = isToday(day);
              const date = new Date(calendarYear, calendarMonth, day);
              date.setHours(0, 0, 0, 0);

              return (
                <button
                  key={day}
                  type="button"
                  className={`calendar-day ${selected ? "selected" : ""} ${
                    isStart ? "range-start" : ""
                  } ${
                    isEnd ? "range-end" : ""
                  } ${
                    inSelectedRange && !selected ? "in-range" : ""
                  } ${
                    today && !selected ? "today" : ""
                  } ${!inRange ? "disabled" : ""}`}
                  onClick={() => handleDateSelect(day)}
                  onMouseEnter={() => {
                    if (dateRange && inRange && !selected) {
                      setHoverDate(date);
                    }
                  }}
                  onMouseLeave={() => {
                    setHoverDate(null);
                  }}
                  disabled={!inRange}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
