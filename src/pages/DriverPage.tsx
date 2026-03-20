import { useEffect, useRef, useState, type RefObject } from "react";
import "../styles/schedule.css";
import { PageLayout } from "../components/PageLayout";
import trailerIcon from "../assets/trailer.svg";
import directionalArrowOB from "../assets/directionalArrow-OB.svg";
import directionalArrowsIB from "../assets/directionalArrows-IB.svg";
import myQDockPassLogo from "../assets/myQdockPass.svg";

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

const RESIZER_WIDTH = 18;
const MIN_DETAILS_WIDTH = 320;
const MIN_SHIPMENTS_WIDTH = 450; // Must match CSS min-width: 450px

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

type DriverPageProps = {
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
  };
  shipments?: Shipment[];
  duration?: string;
  selectedDate?: Date | null;
  selectedTime?: string | null;
  driverName?: string;
  mobileNumber?: string;
  onDriverNameChange?: (name: string) => void;
  onMobileNumberChange?: (number: string) => void;
  selectedCarrier?: string;
  trailerNumber?: string;
  onCancel?: () => void;
  onTermsClick?: () => void;
};

export const DriverPage = ({
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
  selectedDate,
  selectedTime,
  driverName: propDriverName,
  mobileNumber: propMobileNumber,
  onDriverNameChange,
  onMobileNumberChange,
  selectedCarrier = "",
  trailerNumber = "",
  onCancel,
  onTermsClick,
}: DriverPageProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const detailsScrollRef = useRef<HTMLDivElement>(null);
  const resizeStateRef = useRef({ startX: 0, startWidth: 433 });
  const [detailsWidth, setDetailsWidth] = useState(433);
  const [isResizing, setIsResizing] = useState(false);
  const hasDetailsOverflow = useOverflowState(detailsScrollRef);

  // Calculate display values
  const shipmentTypeText = shipmentType === "Inbound" ? "IB" : "OB";
  const productTypeText = productType === "Standard" ? "Std" : "Non-Std";
  const shipmentTypeSubtitle = `${productTypeText} / ${loadType}`;
  
  // Check if there are any tags to display
  const hasTags = questionAnswers && (
    questionAnswers.question1 ||
    questionAnswers.question2
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

  // Generate confirmation number based on selected date
  const generateConfirmationNumber = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `MYQ-${year}${month}${day}-001`;
  };

  const confirmationNumber = selectedDate && selectedTime 
    ? generateConfirmationNumber(selectedDate) 
    : null;

  // Driver form state - initialize from props if available
  const [phoneNumber, setPhoneNumber] = useState(propMobileNumber || "");
  const [firstName, setFirstName] = useState(propDriverName ? propDriverName.split(' ').slice(0, -1).join(' ') : "");
  const [lastName, setLastName] = useState(propDriverName ? propDriverName.split(' ').slice(-1).join(' ') : "");

  // Sync with props when they change externally
  useEffect(() => {
    if (propMobileNumber !== undefined) {
      setPhoneNumber(propMobileNumber);
    }
  }, [propMobileNumber]);

  useEffect(() => {
    if (propDriverName !== undefined) {
      const parts = propDriverName.split(' ');
      if (parts.length > 1) {
        setFirstName(parts.slice(0, -1).join(' '));
        setLastName(parts.slice(-1).join(' '));
      } else if (parts.length === 1) {
        setFirstName(parts[0]);
        setLastName("");
      } else {
        setFirstName("");
        setLastName("");
      }
    }
  }, [propDriverName]);

  // Check if all required fields are filled
  const isNextButtonDisabled = !phoneNumber || !firstName || !lastName;

  // Format phone number as US phone number
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limitedNumbers = numbers.slice(0, 10);
    
    // Format based on length
    if (limitedNumbers.length === 0) return '';
    if (limitedNumbers.length <= 3) return `(${limitedNumbers}`;
    if (limitedNumbers.length <= 6) return `(${limitedNumbers.slice(0, 3)}) ${limitedNumbers.slice(3)}`;
    return `(${limitedNumbers.slice(0, 3)}) ${limitedNumbers.slice(3, 6)}-${limitedNumbers.slice(6)}`;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    if (onMobileNumberChange) {
      onMobileNumberChange(formatted);
    }
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);
    const fullName = `${value} ${lastName}`.trim();
    if (onDriverNameChange) {
      onDriverNameChange(fullName);
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);
    const fullName = `${firstName} ${value}`.trim();
    if (onDriverNameChange) {
      onDriverNameChange(fullName);
    }
  };

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
      // Calculate available width: content width minus shipments min-width, resizer, and any gap
      // Get computed gap from content element (defaults to 0 if not set)
      const contentElement = contentRef.current;
      const computedGap = contentElement ? parseFloat(getComputedStyle(contentElement).gap) || 0 : 0;
      const maxWidth = contentWidth - MIN_SHIPMENTS_WIDTH - RESIZER_WIDTH - computedGap;
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

  return (
    <PageLayout
      activeStep="driver"
      onStepClick={onStepClick}
      selectedSite={selectedSite}
      onSiteChange={onSiteChange}
      siteOptions={siteOptions}
    >
      <main className={`content ${isResizing ? "resizing" : ""}`} ref={contentRef}>
        <section className="panel shipments-panel">
          <div className="panel-header">
            <div className="panel-title-bar">
              <h2>Driver Info</h2>
            </div>
          </div>

          <div className="driver-info-content">
            <div className="driver-dockpass-section">
              <div className="driver-dockpass-logo">
                <img src={myQDockPassLogo} alt="myQ DockPass" className="driver-dockpass-logo-img" />
              </div>
              <p className="driver-dockpass-description">
                Speed up your drivers check in experience by providing their name and cell phone number. When they arrive, they will be able to use express check in with myQ DockPass by just texting "Checking In".
              </p>
            </div>

            <div className="driver-form">
              <div className="field-group">
                <label className="field-label" htmlFor="driver-phone">
                  Phone Number
                </label>
                <input
                  id="driver-phone"
                  className="input input-field"
                  type="tel"
                  placeholder="(555) 212-5555"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  maxLength={14}
                />
              </div>

              <div className="driver-name-row">
                <div className="field-group">
                  <label className="field-label" htmlFor="driver-first-name">
                    First Name
                  </label>
                <input
                  id="driver-first-name"
                  className="input input-field"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={handleFirstNameChange}
                />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="driver-last-name">
                    Last Name
                  </label>
                <input
                  id="driver-last-name"
                  className="input input-field"
                  type="text"
                  placeholder="Smith"
                  value={lastName}
                  onChange={handleLastNameChange}
                />
                </div>
              </div>
            </div>

            <div className="driver-footer-links">
              <a href="#" className="driver-link">Learn more about myQ DockPass and our Privacy Policy</a>
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
                    <span className="details-info-value">
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
                    <span className="details-info-value">
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
                      {"--"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <div className="action-bar">
        <div className="footer-actions">
          <button 
            className="skip-button" 
            type="button"
            onClick={() => {
              if (onStepClick) {
                onStepClick("trailer");
              }
            }}
          >
            Skip
          </button>
          <button className="secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="primary" 
            type="button"
            disabled={isNextButtonDisabled}
            onClick={() => {
              if (!isNextButtonDisabled && onStepClick) {
                onStepClick("trailer");
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
          <span 
            style={{ cursor: "pointer" }}
            onClick={onTermsClick}
          >
            Terms and Conditions
          </span>
        </div>
        <div className="footer-copyright">
          © 2026 Chamberlain Group. All Rights Reserved
        </div>
      </footer>
    </PageLayout>
  );
};
