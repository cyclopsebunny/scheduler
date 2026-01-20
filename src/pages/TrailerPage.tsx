import { useEffect, useRef, useState, type RefObject } from "react";
import "../styles/schedule.css";
import { PageLayout } from "../components/PageLayout";
import { Dropdown } from "../components/Dropdown";
import trailerIcon from "../assets/trailer.svg";
import directionalArrowOB from "../assets/directionalArrow-OB.svg";
import directionalArrowsIB from "../assets/directionalArrows-IB.svg";

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
const MIN_SHIPMENTS_WIDTH = 360;

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

type TrailerPageProps = {
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
  driverName?: string;
  mobileNumber?: string;
  selectedCarrier?: string;
  trailerNumber?: string;
  onSelectedCarrierChange?: (carrier: string) => void;
  onTrailerNumberChange?: (trailer: string) => void;
};

export const TrailerPage = ({
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
  driverName = "",
  mobileNumber = "",
  selectedCarrier = "",
  trailerNumber = "",
  onSelectedCarrierChange,
  onTrailerNumberChange,
}: TrailerPageProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const detailsScrollRef = useRef<HTMLDivElement>(null);
  const resizeStateRef = useRef({ startX: 0, startWidth: 433 });
  const [detailsWidth, setDetailsWidth] = useState(433);
  const [isResizing, setIsResizing] = useState(false);
  const hasDetailsOverflow = useOverflowState(detailsScrollRef);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  // Form state
  const [checkInWithAnotherCarrier, setCheckInWithAnotherCarrier] = useState(true);
  
  const carrierOptions = [
    "A. Duie Pyle",
    "ABF Freight",
    "ArcBest",
    "Atlas Van Lines",
    "Averitt Express",
    "Bekins Van Lines",
    "Bennett Motor Express",
    "Bison Transport",
    "Boyd Brothers Transportation",
    "C.R. England",
    "Cardinal Logistics",
    "Celadon Group",
    "Central States Trucking",
    "Central Transport",
    "CFI",
    "Con-way Freight",
    "Covenant Transport",
    "Crete Carrier Corporation",
    "Dart Transit Company",
    "Dayton Freight Lines",
    "Dependable Highway Express",
    "DHL Supply Chain",
    "Dollar General Logistics",
    "Echo Global Logistics",
    "Estes Express Lines",
    "FedEx Freight",
    "FedEx Ground",
    "Forward Air",
    "Frozen Food Express",
    "Greatwide Logistics",
    "Heartland Express",
    "Holland",
    "Hub Group",
    "J.B. Hunt",
    "J.B. Hunt Dedicated",
    "KLLM Transport Services",
    "Knight Transportation",
    "Landstar System",
    "Lone Star Transportation",
    "Marten Transport",
    "Maverick Transportation",
    "Mayflower Transit",
    "Melton Truck Lines",
    "Midland Transit",
    "National Van Lines",
    "NFI Industries",
    "New Penn",
    "North American Van Lines",
    "Old Dominion Freight Line",
    "P.A.M. Transportation",
    "Penske Logistics",
    "Pilot Flying J",
    "Pitt Ohio",
    "Prime Inc",
    "Quality Distribution",
    "R+L Carriers",
    "Roadrunner Freight",
    "Roadrunner Transportation",
    "Roehl Transport",
    "Ryder System",
    "Saia",
    "Schneider National",
    "Southeastern Freight",
    "Southeastern Freight Lines",
    "Stevens Transport",
    "Swift Transportation",
    "TForce Freight",
    "Total Quality Logistics",
    "TransAm Trucking",
    "TransForce",
    "U.S. Xpress",
    "Universal Truckload Services",
    "UPS Freight",
    "USA Truck",
    "Viking Freight",
    "Watkins & Shepard Trucking",
    "Werner Enterprises",
    "Western Express",
    "Wilson Logistics",
    "XPO Logistics",
    "Yellow Corporation",
    "YRC Freight"
  ];

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

  // Format appointment time for modal
  const formatAppointmentTime = () => {
    if (!selectedDate || !selectedTime) return "";
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    const year = selectedDate.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year} ${selectedTime}`;
  };

  // Parse company name and location from selected site
  const getCompanyName = () => {
    if (!selectedSite) return "Mohawk LLC";
    const parts = selectedSite.split(" - ");
    return parts[0] || "Mohawk LLC";
  };

  const getFullLocation = () => {
    return selectedSite || "Mohawk - Calhoun, GA";
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

  return (
    <PageLayout
      activeStep="trailer"
      onStepClick={onStepClick}
      selectedSite={selectedSite}
      onSiteChange={onSiteChange}
      siteOptions={siteOptions}
    >
      <main className={`content ${isResizing ? "resizing" : ""}`} ref={contentRef}>
        <section className="panel shipments-panel">
          <div className="panel-header">
            <div className="panel-title-bar">
              <h2>Carrier and Trailer</h2>
            </div>
          </div>

          <div className="driver-info-content">
            <div className="driver-form">
              <div className="field-group" style={{ flexDirection: "row", alignItems: "center", gap: "8px", paddingBottom: "0px" }}>
                <input
                  type="checkbox"
                  id="check-in-another-carrier"
                  checked={checkInWithAnotherCarrier}
                  onChange={(e) => setCheckInWithAnotherCarrier(e.target.checked)}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor="check-in-another-carrier" className="field-label" style={{ margin: 0, cursor: "pointer" }}>
                  Check in with another Carrier
                </label>
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="carrier">
                  <span className="required-asterisk">*</span>Carrier
                </label>
                <Dropdown
                  value={selectedCarrier}
                  options={carrierOptions}
                  onChange={(value) => onSelectedCarrierChange?.(value)}
                  placeholder="Select a carrier from the list"
                  typeAhead={true}
                />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="trailer-number">
                  Trailer Number
                </label>
                <input
                  id="trailer-number"
                  className={`input input-field ${!trailerNumber ? "placeholder" : ""}`}
                  type="text"
                  value={trailerNumber}
                  placeholder="Enter trailer number"
                  onChange={(e) => onTrailerNumberChange?.(e.target.value)}
                />
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
                    <span 
                      className="details-info-value" 
                      style={selectedCarrier ? { color: "var(--color-text-brand-primary)" } : {}}
                    >
                      {selectedCarrier || "--"}
                    </span>
                  </div>
                  <div className="details-info-row">
                    <span className="details-info-label">Trailer #:</span>
                    <span 
                      className="details-info-value" 
                      style={trailerNumber ? { color: "var(--color-text-brand-primary)" } : {}}
                    >
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
          <button className="primary" type="button" onClick={() => setShowConfirmationModal(true)}>
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

      {showConfirmationModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmationModal(false)}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Appointment Confirmation</h2>
              <button 
                className="modal-close-button" 
                onClick={() => setShowConfirmationModal(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="confirmation-section">
                <h3 className="confirmation-heading">Thank you for scheduling your appointment at {getCompanyName()}.</h3>
                <p>Your appointment has been scheduled.</p>
                <p><strong>Appointment confirmation #:</strong> {confirmationNumber || "CBI-260109-001"}</p>
                <p><strong>Appointment Time:</strong> {formatAppointmentTime() || "1/9/26 4:00am"}</p>
              </div>

              <div className="modal-divider"></div>

              <div className="important-info-section">
                <p><strong>Appointments are required for all deliveries to the {getFullLocation()} facility.</strong></p>
                <p>We have implemented phase 1 of a scheduling and driver check in/out solution to improve the driver experience at our location. Our goals are to make it easy for drivers to check in and out for their appointments as well as minimize the time waiting and at the gate or dock getting loaded or unloaded.</p>
                
                <p><strong>Appointment Schedule:</strong></p>
                <p className="schedule-highlight"><strong>***RECEIVING ONLY SCHEDULE BETWEEN 7:00 am - 10:00 pm EST Monday - Friday***</strong></p>
                <ul>
                  <li>Exceptions can be made 48 hours prior by reaching out to <a href="mailto:Receiving@CBI.com" className="modal-link">Receiving@CBI.com</a></li>
                </ul>
                
                <p>The shipment ID will be used to match with scheduled appointments that are in my Enterprise that will facilitate our new automated process for the operation's team. We greatly appreciate your assistance during this time. If you have any questions or concerns, please feel free to reach out to <a href="mailto:Receiving@CBI.com" className="modal-link">Receiving@CBI.com</a>.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="primary" 
                type="button"
                onClick={() => setShowConfirmationModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};
