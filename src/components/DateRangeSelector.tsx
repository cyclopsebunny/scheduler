import { useState, useEffect, useRef } from "react";
import chevronDown from "../assets/chevron-down.svg";
import "../styles/schedule.css";

type DateRangeMode = "Today" | "This Week" | "This Month" | "Time Range";

type DateRangeSelectorProps = {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  mode?: DateRangeMode;
  onModeChange?: (mode: DateRangeMode) => void;
  dateRange?: { start: Date | null; end: Date | null };
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
};

export const DateRangeSelector = ({
  selectedDate,
  onDateChange,
  mode: externalMode,
  onModeChange,
  dateRange: externalDateRange,
  onDateRangeChange,
}: DateRangeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalMode, setInternalMode] = useState<DateRangeMode>("Today");
  const [internalDateRange, setInternalDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mode = externalMode ?? internalMode;
  const dateRange = externalDateRange ?? internalDateRange;

  // Initialize date range to last 15 days when Time Range mode is selected
  useEffect(() => {
    if (mode === "Time Range" && !dateRange.start && !dateRange.end) {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 14); // Last 15 days (including today)
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      const newRange = { start, end };
      if (!externalDateRange) {
        setInternalDateRange(newRange);
      }
      if (onDateRangeChange) {
        onDateRangeChange(start, end);
      }
    }
  }, [mode, dateRange.start, dateRange.end, onDateRangeChange, externalDateRange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const handleTodayClick = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (mode) {
      case "Today":
        // Go to today
        onDateChange(today);
        break;
      case "This Week": {
        // Go to start of this week (Sunday)
        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - day);
        onDateChange(startOfWeek);
        break;
      }
      case "This Month": {
        // Go to start of this month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        onDateChange(startOfMonth);
        break;
      }
      case "Time Range":
        // For time range, refresh the range to last 15 days
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 14);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        if (!externalDateRange) {
          setInternalDateRange({ start, end });
        }
        if (onDateRangeChange) {
          onDateRangeChange(start, end);
        }
        break;
    }
  };

  const handleModeSelect = (selectedMode: DateRangeMode) => {
    setIsOpen(false);
    if (!externalMode) {
      setInternalMode(selectedMode);
    }
    if (onModeChange) {
      onModeChange(selectedMode);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (selectedMode) {
      case "Today":
        onDateChange(today);
        break;
      case "This Week": {
        // Get start of week (Sunday)
        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - day);
        onDateChange(startOfWeek);
        break;
      }
      case "This Month": {
        // Get start of month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        onDateChange(startOfMonth);
        break;
      }
      case "Time Range":
        // Date range is already set in useEffect
        break;
    }
  };

  const getDisplayText = () => {
    switch (mode) {
      case "Today":
        return "Today";
      case "This Week":
        return "This Week";
      case "This Month":
        return "This Month";
      case "Time Range":
        return "Date Range";
      default:
        return "Today";
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "flex" }}>
      {/* Left button - Today */}
      <button
        type="button"
        onClick={handleTodayClick}
        className="date-range-button-left"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 16px",
          border: "1px solid var(--color-border-input)",
          borderRight: "none",
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
          background: "var(--color-bg-default-primary)",
          color: "var(--color-text-default-primary)",
          fontSize: "14px",
          fontWeight: "400",
          cursor: "pointer",
          height: "40px",
          whiteSpace: "nowrap",
          transition: "background-color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-bg-default-primary)";
        }}
      >
        {getDisplayText()}
      </button>
      {/* Divider */}
      <div
        style={{
          width: "1px",
          background: "var(--color-border-input)",
          alignSelf: "stretch",
        }}
      />
      {/* Right button - Chevron dropdown */}
      <div className="date-range-dropdown-container" style={{ position: "relative", display: "flex" }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="date-range-button-right"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            border: "1px solid var(--color-border-input)",
            borderLeft: "none",
            borderTopRightRadius: "8px",
            borderBottomRightRadius: "8px",
            background: "var(--color-bg-default-primary)",
            cursor: "pointer",
            height: "40px",
            width: "40px",
            transition: "background-color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-bg-default-primary)";
          }}
        >
          <img
            src={chevronDown}
            alt=""
            className="dropdown-chevron"
            style={{
              width: "16px",
              height: "16px",
              transform: isOpen ? "rotate(180deg)" : "none",
              transition: "transform 0.15s ease",
            }}
          />
        </button>
        {isOpen && (
          <div
            className="dropdown-menu date-range-dropdown-menu"
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 4px)",
              zIndex: 1000,
              minWidth: "160px",
              maxWidth: "200px",
            }}
          >
            <button
              type="button"
              className={`dropdown-option ${mode === "Today" ? "selected" : ""}`}
              onClick={() => handleModeSelect("Today")}
            >
              Today
            </button>
            <button
              type="button"
              className={`dropdown-option ${mode === "This Week" ? "selected" : ""}`}
              onClick={() => handleModeSelect("This Week")}
            >
              This Week
            </button>
            <button
              type="button"
              className={`dropdown-option ${mode === "This Month" ? "selected" : ""}`}
              onClick={() => handleModeSelect("This Month")}
            >
              This Month
            </button>
            <button
              type="button"
              className={`dropdown-option ${mode === "Time Range" ? "selected" : ""}`}
              onClick={() => handleModeSelect("Time Range")}
            >
              Time Range
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
