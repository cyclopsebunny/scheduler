import { useEffect, useRef, useState, type RefObject } from "react";
import "../styles/schedule.css";
import { PageLayout } from "../components/PageLayout";
import trailerIcon from "../assets/trailer.svg";
import directionalArrowOB from "../assets/directionalArrow-OB.svg";
import directionalArrowsIB from "../assets/directionalArrows-IB.svg";
import directionalArrowLeft from "../assets/directionalArrow-left.svg";
import directionalArrowRight from "../assets/directionalArrow-right.svg";
import calendarIcon from "../assets/calendar.svg";
import chevronDown from "../assets/chevron-down.svg";

const RESIZER_WIDTH = 18;
const MIN_DETAILS_WIDTH = 320;
const MIN_SHIPMENTS_WIDTH = 360;

type Shipment = {
  rowId: string;
  id: string;
  idType: string;
  vendor: string;
  pallets: string;
  cases: string;
  stop: string;
  isPrimary: boolean;
};

type SchedulePageNewProps = {
  selectedSite: string;
  onSiteChange: (site: string) => void;
  siteOptions: string[];
  onStepClick: (step: "shipment" | "schedule" | "driver" | "trailer") => void;
  shipmentType?: "Inbound" | "Outbound";
  loadType?: string;
  productType?: "Standard" | "Non Standard";
  questionAnswers?: {
    question1: string;
    question2: string;
    question3: string;
    question4: string;
    question5: string;
  };
  shipments?: Shipment[];
  duration?: string;
  selectedDate?: Date | null;
  selectedTime?: string | null;
  onSelectedDateChange?: (date: Date | null) => void;
  onSelectedTimeChange?: (time: string | null) => void;
  driverName?: string;
  mobileNumber?: string;
  selectedCarrier?: string;
  trailerNumber?: string;
};

const useOverflowState = (ref: RefObject<HTMLElement>) => {
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const updateOverflow = () => {
      setHasOverflow(element.scrollHeight > element.clientHeight + 1);
    };

    updateOverflow();

    const resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(element);
    if (element.firstElementChild) {
      resizeObserver.observe(element.firstElementChild);
    }

    const mutationObserver = new MutationObserver(updateOverflow);
    mutationObserver.observe(element, { childList: true, subtree: true, characterData: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [ref]);

  return hasOverflow;
};

export const SchedulePageNew = ({
  selectedSite,
  onSiteChange,
  siteOptions,
  onStepClick,
  shipmentType = "Inbound",
  loadType = "Live",
  productType = "Standard",
  questionAnswers,
  shipments = [],
  duration = "1 hour",
  selectedDate: propSelectedDate,
  selectedTime: propSelectedTime,
  onSelectedDateChange,
  onSelectedTimeChange,
  driverName = "",
  mobileNumber = "",
  selectedCarrier = "",
  trailerNumber = "",
}: SchedulePageNewProps) => {
  // Calculate display values
  const shipmentTypeText = shipmentType === "Inbound" ? "IB" : "OB";
  const productTypeText = productType === "Standard" ? "Std" : "Non-Std";
  const shipmentTypeSubtitle = `${productTypeText} / ${loadType}`;
  
  // Check if there are any tags to display
  const hasTags = questionAnswers && (
    questionAnswers.question1 ||
    questionAnswers.question2 ||
    questionAnswers.question3 ||
    questionAnswers.question4 ||
    questionAnswers.question5
  );

  // Find primary shipment ID and count additional shipments
  const primaryShipment = shipments.find((s) => s.isPrimary);
  const primaryShipmentId = primaryShipment?.id || "";
  const additionalShipmentsCount = shipments.filter(
    (s) => s.id && s.id.trim() !== "" && !s.isPrimary
  ).length;

  // Get vendor, pallets, and cases from primary shipment
  const vendor = primaryShipment?.vendor || "--";
  const pallets = primaryShipment?.pallets || "";
  const cases = primaryShipment?.cases || "";
  const palletCaseQty = pallets && cases ? `${pallets}/${cases}` : pallets || cases || "--";

  // Format current date and time
  const formatDateTime = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear().toString().slice(-2);
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${month}/${day}/${year} ${displayHours}:${displayMinutes}${ampm}`;
  };

  const creationDate = formatDateTime();

  // Date/Time selection state
  const [localSelectedDate, setLocalSelectedDate] = useState<Date | null>(propSelectedDate || null);
  const [localSelectedTime, setLocalSelectedTime] = useState<string | null>(propSelectedTime || null);
  const selectedDate = propSelectedDate !== undefined ? propSelectedDate : localSelectedDate;
  const selectedTime = propSelectedTime !== undefined ? propSelectedTime : localSelectedTime;
  
  const setSelectedDate = (date: Date | null) => {
    if (onSelectedDateChange) {
      onSelectedDateChange(date);
    } else {
      setLocalSelectedDate(date);
    }
  };
  
  const setSelectedTime = (time: string | null) => {
    if (onSelectedTimeChange) {
      onSelectedTimeChange(time);
    } else {
      setLocalSelectedTime(time);
    }
  };
  
  // Initialize offset to start from minimum date (24 hours from now)
  const [currentDateOffset, setCurrentDateOffset] = useState(0);

  // Calculate date constraints
  const getMinDate = () => {
    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0);
    minDate.setDate(minDate.getDate() + 1); // 24 hours from now (next day)
    return minDate;
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setHours(0, 0, 0, 0);
    maxDate.setDate(maxDate.getDate() + 16); // 16 days from today
    return maxDate;
  };

  // Generate dates for display (3 dates) within constraints
  const getDisplayDates = () => {
    const minDate = getMinDate();
    const maxDate = getMaxDate();
    const dates: Date[] = [];
    
    // Start from minDate + currentDateOffset
    const startDate = new Date(minDate);
    startDate.setDate(startDate.getDate() + currentDateOffset);
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Only add dates that are within the valid range
      if (date >= minDate && date <= maxDate) {
        dates.push(date);
      }
    }
    return dates;
  };

  // Check if we can navigate to previous dates
  const canNavigatePrevious = () => {
    const minDate = getMinDate();
    const startDate = new Date(minDate);
    startDate.setDate(startDate.getDate() + currentDateOffset);
    return startDate > minDate;
  };

  // Check if we can navigate to next dates
  const canNavigateNext = () => {
    const maxDate = getMaxDate();
    const startDate = new Date(getMinDate());
    startDate.setDate(startDate.getDate() + currentDateOffset);
    const lastDisplayDate = new Date(startDate);
    lastDisplayDate.setDate(startDate.getDate() + 2); // Last of the 3 dates
    return lastDisplayDate < maxDate;
  };

  // Format date with day name and date on separate lines
  const formatDateDisplay = (date: Date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[date.getDay()];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2);
    return (
      <>
        {dayName}
        <br />
        {month}/{day}/{year}
      </>
    );
  };

  // Generate time slots for a date (example times - in real app, these would come from API)
  const generateTimeSlots = (date: Date): string[] => {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 5 = Friday
    
    let slots: string[] = [];
    
    // Thursday slots
    if (dayOfWeek === 4) {
      slots = ["9:00 AM", "9:30 AM", "10:00 AM", "11:30 AM", "2:00 PM"];
    }
    // Friday slots
    else if (dayOfWeek === 5) {
      slots = [
        "5:00 AM",
        "7:45 AM",
        "8:30 AM",
        "12:00 PM",
        "12:00 PM",
        "12:00 PM",
        "12:00 PM",
        "12:00 PM",
        "12:00 PM",
        "12:00 PM",
      ];
    }
    // Monday slots
    else if (dayOfWeek === 1) {
      slots = ["4:00 AM", "5:30 AM", "5:45 AM", "7:30 AM", "11:00 AM"];
    }
    // Default slots for other days
    else {
      slots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"];
    }
    
    // Remove duplicates while preserving order
    return Array.from(new Set(slots));
  };

  // Generate confirmation number based on selected date
  const generateConfirmationNumber = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `CBI-${year}${month}${day}-001`;
  };

  const confirmationNumber = selectedDate && selectedTime 
    ? generateConfirmationNumber(selectedDate) 
    : null;

  const displayDates = getDisplayDates();
  
  const contentRef = useRef<HTMLDivElement>(null);
  const detailsScrollRef = useRef<HTMLDivElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);
  const calendarModalRef = useRef<HTMLDivElement>(null);
  const resizeStateRef = useRef({ startX: 0, startWidth: 433 });
  const [detailsWidth, setDetailsWidth] = useState(433);
  const [isResizing, setIsResizing] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const hasDetailsOverflow = useOverflowState(detailsScrollRef);

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const contentWidth = contentRef.current?.clientWidth ?? 0;
      if (!contentWidth) {
        return;
      }
      const delta = event.clientX - resizeStateRef.current.startX;
      const maxWidth = contentWidth - MIN_SHIPMENTS_WIDTH - RESIZER_WIDTH;
      const nextWidth = Math.min(
        Math.max(MIN_DETAILS_WIDTH, resizeStateRef.current.startWidth - delta),
        Math.max(MIN_DETAILS_WIDTH, maxWidth)
      );
      setDetailsWidth(nextWidth);
    };

    const handlePointerUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isResizing]);

  const handlePointerDown = (event: React.PointerEvent) => {
    resizeStateRef.current = { startX: event.clientX, startWidth: detailsWidth };
    setIsResizing(true);
  };

  // Calendar modal functions
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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
    const minDate = getMinDate();
    const maxDate = getMaxDate();
    
    if (date >= minDate && date <= maxDate) {
      setSelectedDate(date);
      setSelectedTime(null);
      // Calculate the offset to show this date
      const daysDiff = Math.floor((date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
      setCurrentDateOffset(Math.floor(daysDiff / 3) * 3);
      setIsCalendarOpen(false);
    }
  };

  const isDateInRange = (day: number) => {
    const date = new Date(calendarYear, calendarMonth, day);
    const minDate = getMinDate();
    const maxDate = getMaxDate();
    return date >= minDate && date <= maxDate;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === calendarMonth &&
      selectedDate.getFullYear() === calendarYear
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === calendarMonth &&
      today.getFullYear() === calendarYear
    );
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isCalendarOpen &&
        calendarModalRef.current &&
        calendarButtonRef.current &&
        !calendarModalRef.current.contains(event.target as Node) &&
        !calendarButtonRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isCalendarOpen]);

  return (
    <PageLayout
      activeStep="schedule"
      onStepClick={onStepClick}
      selectedSite={selectedSite}
      onSiteChange={onSiteChange}
      siteOptions={siteOptions}
    >
      <main className={`content ${isResizing ? "resizing" : ""}`} ref={contentRef}>
        <section className="panel shipments-panel">
          <div className="panel-header">
            <div className="panel-title-bar">
              <h2>Appointment</h2>
            </div>
            <div style={{ position: "relative" }}>
              <button
                ref={calendarButtonRef}
                className="ghost-button"
                type="button"
                onClick={() => {
                  setIsCalendarOpen(!isCalendarOpen);
                  if (!isCalendarOpen && selectedDate) {
                    setCalendarMonth(selectedDate.getMonth());
                    setCalendarYear(selectedDate.getFullYear());
                  }
                }}
              >
                <img className="plus" src={calendarIcon} alt="" aria-hidden="true" />
                CHANGE DATE
              </button>
              {isCalendarOpen && (
                <div ref={calendarModalRef} className="calendar-modal">
                  <div className="calendar-header">
                    <div className="calendar-header-left">
                      <span className="calendar-month-year">
                        {monthNames[calendarMonth]} {calendarYear}
                      </span>
                      <img src={chevronDown} alt="" className="calendar-dropdown-icon" />
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
                        <img src={directionalArrowRight} alt="" width="16" height="16" />
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
                    {Array.from({ length: getFirstDayOfMonth(calendarMonth, calendarYear) }).map((_, index) => (
                      <div key={`empty-${index}`} className="calendar-day-empty"></div>
                    ))}
                    {Array.from({ length: getDaysInMonth(calendarMonth, calendarYear) }).map((_, index) => {
                      const day = index + 1;
                      const inRange = isDateInRange(day);
                      const selected = isDateSelected(day);
                      const today = isToday(day);
                      
                      return (
                        <button
                          key={day}
                          type="button"
                          className={`calendar-day ${selected ? "selected" : ""} ${today && !selected ? "today" : ""} ${!inRange ? "disabled" : ""}`}
                          onClick={() => handleDateSelect(day)}
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
          </div>

          <div className="appointment-time-selector">
            <h3 className="appointment-time-selector-title">Select Date and Time</h3>
            <div className="appointment-date-navigation">
              <div className="appointment-dates-container">
                <div className="appointment-dates-headers">
                  <button
                    className="appointment-nav-button"
                    type="button"
                    onClick={() => setCurrentDateOffset(currentDateOffset - 3)}
                    aria-label="Previous dates"
                    disabled={!canNavigatePrevious()}
                  >
                    <img src={directionalArrowLeft} alt="" width="24" height="24" />
                  </button>
                  {displayDates.map((date) => {
                    const dateKey = date.toISOString();
                    return (
                      <div key={dateKey} className="appointment-date-column-header">
                        <div className="appointment-date-header">{formatDateDisplay(date)}</div>
                      </div>
                    );
                  })}
                  <button
                    className="appointment-nav-button"
                    type="button"
                    onClick={() => setCurrentDateOffset(currentDateOffset + 3)}
                    aria-label="Next dates"
                    disabled={!canNavigateNext()}
                  >
                    <img src={directionalArrowRight} alt="" width="24" height="24" />
                  </button>
                </div>
                <div className="appointment-date-divider"></div>
                <div className="appointment-time-slots-scroll-wrapper">
                  <div className="appointment-time-slots-container">
                    {displayDates.map((date) => {
                      const timeSlots = generateTimeSlots(date);
                      const dateKey = date.toISOString();
                      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
                      
                      return (
                        <div key={dateKey} className="appointment-date-column-slots">
                          {timeSlots.map((time) => {
                            const isTimeSelected = isSelected && selectedTime === time;
                            return (
                              <button
                                key={`${dateKey}-${time}`}
                                className={`appointment-time-slot ${isTimeSelected ? "selected" : ""}`}
                                type="button"
                                onClick={() => {
                                  setSelectedDate(date);
                                  setSelectedTime(time);
                                }}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div
          className={`panel-resize-handle ${isResizing ? "is-active" : ""}`}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panels"
          onPointerDown={handlePointerDown}
        />

        <aside className="panel details-panel" style={{ width: detailsWidth }}>
          <div className="panel-title-bar">
            <h2>Shipment Details</h2>
          </div>
          <div className={`details-body ${hasDetailsOverflow ? "has-overflow" : ""}`}>
            <div className="details-scroll" ref={detailsScrollRef}>
              <div className="details-scroll-content">
                {/* Shipment IDs Section */}
                <div className="details-section">
                  <h3 className="details-section-title">Shipment IDs</h3>
                  <div className="details-info-row">
                    <span className="details-info-label">Confirmation #:</span>
                    <span 
                      className="details-info-value"
                      style={confirmationNumber ? { color: 'var(--color-text-brand-primary)' } : undefined}
                    >
                      {confirmationNumber || "--"}
                    </span>
                  </div>
                  <div className="details-info-row">
                    <span className="details-info-label">Shipment ID:</span>
                    <div className="details-info-value-group">
                      {primaryShipmentId ? (
                        <>
                          <span className="details-info-value">{primaryShipmentId}</span>
                          {additionalShipmentsCount > 0 && (
                            <button className="details-link" type="button">
                              +{additionalShipmentsCount} more
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="details-info-value">--</span>
                      )}
                    </div>
                  </div>
                  <div className="details-info-row">
                    <span className="details-info-label">Vendor:</span>
                    <span className="details-info-value">{vendor}</span>
                  </div>
                  <div className="details-info-row">
                    <span className="details-info-label">Pallet/Case Qty:</span>
                    <span className="details-info-value">{palletCaseQty}</span>
                  </div>
                </div>

                {/* Tags Section */}
                {hasTags && (
                  <div className="details-section">
                    <h3 className="details-section-title">Tags</h3>
                    <div className="details-tags">
                      {questionAnswers?.question1 && (
                        <span className="details-tag">{questionAnswers.question1}</span>
                      )}
                      {questionAnswers?.question2 && (
                        <span className="details-tag">{questionAnswers.question2}</span>
                      )}
                      {questionAnswers?.question3 && (
                        <span className="details-tag">{questionAnswers.question3}</span>
                      )}
                      {questionAnswers?.question4 && (
                        <span className="details-tag">{questionAnswers.question4}</span>
                      )}
                      {questionAnswers?.question5 && (
                        <span className="details-tag">{questionAnswers.question5}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Shipment Type Indicator */}
                <div className="details-section">
                  <div className="details-divider"></div>
                  <div className="details-shipment-type">
                    <img
                      className="details-icon-arrow"
                      src={shipmentType === "Outbound" ? directionalArrowOB : directionalArrowsIB}
                      alt=""
                      width="16"
                      height="16"
                    />
                    <span className="details-shipment-type-text">{shipmentTypeText}</span>
                    <img className="details-icon-truck" src={trailerIcon} alt="" width="24" height="24" />
                  </div>
                  <div className="details-shipment-type-subtitle">{shipmentTypeSubtitle}</div>
                </div>

                {/* Appointment Section */}
                <div className="details-section">
                  <div className="details-divider"></div>
                  <h3 className="details-section-title">Appointment</h3>
                  <div className="details-info-row">
                    <span className="details-info-label">Scheduled by:</span>
                    <span className="details-info-value">Randy Tyner</span>
                  </div>
                  <div className="details-info-row">
                    <span className="details-info-label">Creation Date:</span>
                    <span className="details-info-value">{creationDate}</span>
                  </div>
                  <div className="details-info-row">
                    <span className="details-info-label">Creation Method:</span>
                    <span className="details-info-value">Scheduling Portal</span>
                  </div>
                  <div className="details-info-row">
                    <span className="details-info-label">Scheduled Duration:</span>
                    <span className="details-info-value">{duration}</span>
                  </div>
                  <div className="details-info-row">
                    <span className="details-info-label">Time:</span>
                    <span 
                      className="details-info-value"
                      style={selectedDate && selectedTime ? { color: 'var(--color-text-brand-primary)' } : undefined}
                    >
                      {selectedDate && selectedTime
                        ? `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear().toString().slice(-2)} ${selectedTime}`
                        : "--"}
                    </span>
                  </div>
                </div>

                {/* Shipment Details Section */}
                <div className="details-section">
                  <div className="details-divider"></div>
                  <h3 className="details-section-title">Shipment Details</h3>
                  <div className="details-info-row">
                    <span className="details-info-label">Scheduled Carrier:</span>
                    <span className="details-info-value">
                      {selectedCarrier || "--"}
                    </span>
                  </div>
                  <div className="details-info-row">
                    <span className="details-info-label">Trailer #:</span>
                    <span className="details-info-value">
                      {trailerNumber || "--"}
                    </span>
                  </div>
                  <div className="details-info-row">
                    <span className="details-info-label">Driver:</span>
                    <span className="details-info-value">{driverName || "--"}</span>
                  </div>
                  <div className="details-info-row">
                    <span className="details-info-label">Mobile:</span>
                    <span className="details-info-value">{mobileNumber || "--"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <div className="action-bar">
        <div className="footer-actions">
          <button className="secondary" type="button">
            Cancel
          </button>
          <button 
            className="primary" 
            type="button" 
            disabled={!selectedTime}
            onClick={() => {
              if (selectedTime && onStepClick) {
                onStepClick("driver");
              }
            }}
          >
            Next
          </button>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-links">
          <span>Contact</span>
          <span>Customer Support</span>
          <span>Products</span>
        </div>
        <div className="footer-copyright">
          © 2026 Chamberlain Group. All Rights Reserved
        </div>
      </footer>
    </PageLayout>
  );
};
