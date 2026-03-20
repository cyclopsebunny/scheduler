import { useState } from "react";
import { DashboardPage } from "./pages/DashboardPage";
import SchedulePage from "./pages/SchedulePage";
import { SchedulePageNew } from "./pages/SchedulePageNew";
import { ComponentLibraryPage } from "./pages/ComponentLibraryPage";

type Step = "shipment" | "schedule";

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

const siteOptions = [
  "myQ Enterprise Demo Facility - Statesville, NC",
  "myQ Enterprise Demo Facility - Miami, FL",
  "myQ Enterprise Demo Facility - Atlanta, GA",
  "myQ Enterprise Demo Facility - Dallas, TX",
  "myQ Enterprise Demo Facility - Chicago, IL",
  "myQ Enterprise Demo Facility - Los Angeles, CA",
  "myQ Enterprise Demo Facility - Phoenix, AZ",
  "myQ Enterprise Demo Facility - Denver, CO",
];

const App = () => {
  // Check URL hash for component library access (e.g., #component-library)
  const [currentView, setCurrentView] = useState<"dashboard" | "schedule" | "component-library">(
    window.location.hash === "#component-library" ? "component-library" : "dashboard"
  );
  const [currentStep, setCurrentStep] = useState<Step>("shipment");
  const [selectedSite, setSelectedSite] = useState(siteOptions[0]);
  const [shipmentType, setShipmentType] = useState<"Inbound" | "Outbound">("Inbound");
  const [loadType, setLoadType] = useState("Live");
  const [productType, setProductType] = useState<"Standard" | "Non Standard">("Standard");
  const [questionAnswers, setQuestionAnswers] = useState({
    question1: "",
    question2: "",
  });
  // Initialize with one default shipment row, marked as primary
  const initialShipments: Shipment[] = [
    {
      rowId: "row-1",
      id: "",
      idType: "Shipment ID",
      vendor: "",
      pallets: "",
      cases: "",
      stop: "1",
      isPrimary: true,
    },
  ];
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [duration, setDuration] = useState("1 hour");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [driverName, setDriverName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState("");
  const [trailerNumber, setTrailerNumber] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    confirmationNumber: string;
    appointmentTime: string;
    companyName: string;
    fullLocation: string;
  } | null>(null);
  // Store dashboard shipments in App state to persist across component remounts
  // Import sample shipments to initialize
  const [dashboardShipments, setDashboardShipments] = useState<import("./pages/DashboardPage").DashboardShipment[] | null>(null);
  const [schedulingData, setSchedulingData] = useState<{
    shipmentType: "Inbound" | "Outbound";
    loadType: string;
    productType: "Standard" | "Non Standard";
    selectedCarrier: string;
    trailerNumber: string;
    driverName: string;
    mobileNumber: string;
    shipments: Shipment[];
    questionAnswers: {
      question1: string;
      question2: string;
    };
  } | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  // Store original scheduled time when rescheduling/editing (so it remains available)
  const [originalScheduledTime, setOriginalScheduledTime] = useState<string | null>(null);
  
  // Store the ID of the appointment being rescheduled/edited (to update instead of create duplicate)
  const [appointmentToUpdateId, setAppointmentToUpdateId] = useState<string | null>(null);
  
  // Store dashboard date filter state to preserve when navigating away
  const [dashboardDateFilter, setDashboardDateFilter] = useState<{
    selectedDate: Date;
    dateRangeMode: "Today" | "This Week" | "This Month" | "Time Range";
    dateRange: { start: Date | null; end: Date | null };
  } | null>(null);

  const handleStepClick = (step: Step) => {
    setCurrentStep(step);
  };

  const handleSiteChange = (site: string) => {
    setSelectedSite(site);
  };

  const handleScheduleShipment = () => {
    // Store current dashboard date filter state before navigating away
    // This will be restored when returning to dashboard
    // Note: We'll capture it via onDateFilterChange callback
    
    // Reset all form state
    setCurrentStep("shipment");
    setShipmentType("Inbound");
    setLoadType("Live");
    setProductType("Standard");
    setQuestionAnswers({
      question1: "",
      question2: "",
    });
    setShipments(initialShipments);
    setDuration("1 hour");
    setSelectedDate(null);
    setSelectedTime(null);
    setOriginalScheduledTime(null); // Clear original time for new appointments
    setAppointmentToUpdateId(null); // Clear appointment to update for new appointments
    setDriverName("");
    setMobileNumber("");
    setSelectedCarrier("");
    setTrailerNumber("");
    setCurrentView("schedule");
  };

  const handleCancel = () => {
    setCurrentView("dashboard");
    setShowConfirmationModal(false);
    // Clear appointment state when canceling to allow rescheduling again
    setAppointmentToUpdateId(null);
    setOriginalScheduledTime(null);
    // Date filter state will be restored via initialDateFilter prop
  };

  const handleReschedule = (shipment: import("./pages/DashboardPage").DashboardShipment) => {
    console.log('handleReschedule called with shipment:', shipment.id, shipment.date, shipment.time);
    console.log('Current appointmentToUpdateId before:', appointmentToUpdateId);
    
    // Parse date (format: M/D/YY or MM/DD/YY)
    const [month, day, year] = shipment.date.split('/').map(Number);
    
    // Parse time (format: H:MMam/pm, HH:MMam/pm, H:MM AM/PM, or HH:MM AM/PM - with or without space)
    // Normalize the time string first by removing spaces and converting to lowercase
    const normalizedTime = shipment.time.replace(/\s+/g, '').toLowerCase();
    const timeMatch = normalizedTime.match(/(\d+):(\d+)(am|pm)/i);
    if (!timeMatch) {
      console.error("Invalid time format:", shipment.time);
      return;
    }
    
    let hour = parseInt(timeMatch[1]);
    const minute = parseInt(timeMatch[2]);
    const period = timeMatch[3].toLowerCase();
    
    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    
    // Create date normalized to midnight for date comparison to avoid timezone issues
    // The schedule page compares dates using toDateString(), so we need the date at midnight
    const dateForSelection = new Date(2000 + year, month - 1, day);
    dateForSelection.setHours(0, 0, 0, 0);
    
    // Format time for display (e.g., "4:00 AM" - matching SchedulePageNew format)
    const displayHour = hour % 12 || 12;
    const displayMinute = minute.toString().padStart(2, '0');
    const timeString = `${displayHour}:${displayMinute} ${period.toUpperCase()}`;
    
    // Store original scheduled time so it remains available even if user changes selection
    setOriginalScheduledTime(timeString);
    
    // Store the appointment ID so we can update it instead of creating a duplicate
    console.log('Setting appointmentToUpdateId to:', shipment.id);
    setAppointmentToUpdateId(shipment.id);
    
    // Parse shipmentType string (e.g., "Inbound Std / Live Load" or "Outbound Non-Std / Drop")
    const shipmentTypeMatch = shipment.shipmentType.match(/^(Inbound|Outbound)\s+(Std|Non-Std)\s*\/\s*(.+)$/i);
    const parsedShipmentType = shipmentTypeMatch ? (shipmentTypeMatch[1] as "Inbound" | "Outbound") : "Inbound";
    const parsedProductType = shipmentTypeMatch && shipmentTypeMatch[2] === "Non-Std" ? "Non Standard" : "Standard";
    const parsedLoadType = shipmentTypeMatch ? shipmentTypeMatch[3].trim() : "Live";
    
    // Extract question answers from tags (assuming tags contain question1 and question2)
    const question1 = shipment.tags && shipment.tags.length > 0 ? shipment.tags[0] : "";
    const question2 = shipment.tags && shipment.tags.length > 1 ? shipment.tags[1] : "";
    
    // Create shipments array from the shipment data
    const rescheduleShipments: Shipment[] = [{
      rowId: "row-1",
      id: shipment.shipmentId,
      idType: "Shipment ID",
      vendor: shipment.vendor,
      pallets: shipment.pallets,
      cases: shipment.cases,
      stop: "1",
      isPrimary: true,
    }];
    
    // Set all state
    setCurrentStep("schedule");
    setShipmentType(parsedShipmentType);
    setLoadType(parsedLoadType);
    setProductType(parsedProductType);
    setQuestionAnswers({
      question1,
      question2,
    });
    setShipments(rescheduleShipments);
    setDuration("1 hour");
    // Use normalized date (midnight) for date selection to avoid timezone issues
    setSelectedDate(dateForSelection);
    setSelectedTime(timeString);
    setDriverName(shipment.driver);
    setMobileNumber(shipment.phone);
    setSelectedCarrier(shipment.carrier);
    setTrailerNumber(shipment.trailer);
    // Navigate to schedule view
    setCurrentView("schedule");
  };

  const handleEditAppointment = (shipment: import("./pages/DashboardPage").DashboardShipment) => {
    // Parse date (format: M/D/YY or MM/DD/YY)
    const [month, day, year] = shipment.date.split('/').map(Number);
    
    // Parse time (format: H:MMam/pm, HH:MMam/pm, H:MM AM/PM, or HH:MM AM/PM - with or without space)
    // Normalize the time string first by removing spaces and converting to lowercase
    const normalizedTime = shipment.time.replace(/\s+/g, '').toLowerCase();
    const timeMatch = normalizedTime.match(/(\d+):(\d+)(am|pm)/i);
    let timeString: string | null = null;
    let appointmentDate: Date;
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = parseInt(timeMatch[2]);
      const period = timeMatch[3].toLowerCase();
      
      if (period === 'pm' && hour !== 12) hour += 12;
      if (period === 'am' && hour === 12) hour = 0;
      
      // Format time for display (e.g., "4:00 AM" - matching SchedulePageNew format)
      const displayHour = hour % 12 || 12;
      const displayMinute = minute.toString().padStart(2, '0');
      timeString = `${displayHour}:${displayMinute} ${period.toUpperCase()}`;
    }
    
    // Create date normalized to midnight for date comparison to avoid timezone issues
    // The schedule page compares dates using toDateString(), so we need the date at midnight
    appointmentDate = new Date(2000 + year, month - 1, day);
    appointmentDate.setHours(0, 0, 0, 0);
    
    // Store original scheduled time so it remains available even if user changes selection
    if (timeString) {
      setOriginalScheduledTime(timeString);
    }
    
    // Store the appointment ID so we can update it instead of creating a duplicate
    setAppointmentToUpdateId(shipment.id);
    
    // Parse shipmentType string (e.g., "Inbound Std / Live Load" or "Outbound Non-Std / Drop")
    const shipmentTypeMatch = shipment.shipmentType.match(/^(Inbound|Outbound)\s+(Std|Non-Std)\s*\/\s*(.+)$/i);
    const parsedShipmentType = shipmentTypeMatch ? (shipmentTypeMatch[1] as "Inbound" | "Outbound") : "Inbound";
    const parsedProductType = shipmentTypeMatch && shipmentTypeMatch[2] === "Non-Std" ? "Non Standard" : "Standard";
    const parsedLoadType = shipmentTypeMatch ? shipmentTypeMatch[3].trim() : "Live";
    
    // Extract question answers from tags (assuming tags contain question1 and question2)
    const question1 = shipment.tags && shipment.tags.length > 0 ? shipment.tags[0] : "";
    const question2 = shipment.tags && shipment.tags.length > 1 ? shipment.tags[1] : "";
    
    // Create shipments array from the shipment data
    const editShipments: Shipment[] = [{
      rowId: "row-1",
      id: shipment.shipmentId,
      idType: "Shipment ID",
      vendor: shipment.vendor,
      pallets: shipment.pallets,
      cases: shipment.cases,
      stop: "1",
      isPrimary: true,
    }];
    
    // Set all state for shipment page
    setCurrentStep("shipment");
    setShipmentType(parsedShipmentType);
    setLoadType(parsedLoadType);
    setProductType(parsedProductType);
    setQuestionAnswers({
      question1,
      question2,
    });
    setShipments(editShipments);
    setDuration("1 hour");
    setSelectedCarrier(shipment.carrier);
    setDriverName(shipment.driver);
    setMobileNumber(shipment.phone);
    setTrailerNumber(shipment.trailer);
    // Set date/time so they're pre-populated when user navigates to schedule page
    // Use normalized date (midnight) for date selection to avoid timezone issues
    setSelectedDate(appointmentDate);
    setSelectedTime(timeString);
    setCurrentView("schedule");
    // Date filter state is already stored via onDateFilterChange
  };

  const handleTrailerNext = () => {
    // Generate confirmation data
    const generateConfirmationNumber = (date: Date): string => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `MYQ-${year}${month}${day}-001`;
    };

    const formatAppointmentTime = () => {
      if (!selectedDate || !selectedTime) return "";
      const month = selectedDate.getMonth() + 1;
      const day = selectedDate.getDate();
      const year = selectedDate.getFullYear().toString().slice(-2);
      return `${month}/${day}/${year} ${selectedTime}`;
    };

    const getCompanyName = () => {
      if (!selectedSite) return "Mohawk LLC";
      const parts = selectedSite.split(" - ");
      return parts[0] || "Mohawk LLC";
    };

    const confirmationNumber = selectedDate ? generateConfirmationNumber(selectedDate) : "MYQ-260109-001";
    const appointmentTime = formatAppointmentTime() || "1/9/26 4:00am";
    const companyName = getCompanyName();
    const fullLocation = selectedSite || "Mohawk - Calhoun, GA";

    setConfirmationData({
      confirmationNumber,
      appointmentTime,
      companyName,
      fullLocation,
    });
    setSchedulingData({
      shipmentType,
      loadType,
      productType,
      selectedCarrier,
      trailerNumber,
      driverName,
      mobileNumber,
      shipments,
      questionAnswers,
      appointmentToUpdateId, // Include appointment ID if rescheduling/editing
    });
    setShowConfirmationModal(true);
    setCurrentView("dashboard");
    // Date filter state will be restored via initialDateFilter prop
    // Don't clear appointmentToUpdateId here - it will be cleared when modal closes
    // This allows rescheduling the same appointment multiple times
  };

  const renderTermsModal = () => (
    showTermsModal && (
      <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
        <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Terms and Conditions</h2>
            <button 
              className="modal-close-button" 
              onClick={() => setShowTermsModal(false)}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          <div className="modal-content">
            <div className="important-info-section">
              <p><strong>Appointments are required for all deliveries to the facility.</strong></p>
              <p>We have implemented phase 1 of a scheduling and driver check in/out solution to improve the driver experience at our location. Our goals are to make it easy for drivers to check in and out for their appointments as well as minimize the time waiting and at the gate or dock getting loaded or unloaded.</p>
              
              <p><strong>Appointment Schedule:</strong></p>
              <p className="schedule-highlight"><strong>***RECEIVING ONLY SCHEDULE BETWEEN 7:00 am - 10:00 pm EST Monday - Friday***</strong></p>
              <ul>
                <li>Exceptions can be made 48 hours prior by reaching out to <a href="mailto:Receiving@myQ.com" className="modal-link">Receiving@myQ.com</a></li>
              </ul>
              
              <p>The shipment ID will be used to match with scheduled appointments that are in my Enterprise that will facilitate our new automated process for the operation's team. We greatly appreciate your assistance during this time. If you have any questions or concerns, please feel free to reach out to <a href="mailto:Receiving@myQ.com" className="modal-link">Receiving@myQ.com</a>.</p>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              className="primary" 
              type="button"
              onClick={() => setShowTermsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Show component library if requested
  if (currentView === "component-library") {
    return <ComponentLibraryPage />;
  }

  // Show dashboard as default
  if (currentView === "dashboard") {
    return (
      <>
        <DashboardPage
          selectedSite={selectedSite}
          onSiteChange={handleSiteChange}
          onScheduleShipment={handleScheduleShipment}
          showConfirmationModal={showConfirmationModal}
          onCloseModal={() => {
            setShowConfirmationModal(false);
            // Clear scheduling data after modal is closed
            setSchedulingData(null);
            // Clear appointment state when modal closes to allow rescheduling again
            setAppointmentToUpdateId(null);
            setOriginalScheduledTime(null);
            // Date filter state will be restored via initialDateFilter prop
          }}
          confirmationData={confirmationData || undefined}
          dashboardShipments={dashboardShipments}
          onDashboardShipmentsChange={setDashboardShipments}
          schedulingData={schedulingData || undefined}
          onTermsClick={() => setShowTermsModal(true)}
          onReschedule={handleReschedule}
          onEditAppointment={handleEditAppointment}
          initialDateFilter={dashboardDateFilter}
          onDateFilterChange={setDashboardDateFilter}
        />
        {renderTermsModal()}
      </>
    );
  }

  switch (currentStep) {
    case "shipment":
      return (
        <>
          <SchedulePage
            onStepClick={handleStepClick}
            shipmentType={shipmentType}
            onShipmentTypeChange={setShipmentType}
            loadType={loadType}
            onLoadTypeChange={setLoadType}
            productType={productType}
            onProductTypeChange={setProductType}
            questionAnswers={questionAnswers}
            onQuestionAnswersChange={setQuestionAnswers}
            shipments={shipments}
            onShipmentsChange={setShipments}
            duration={duration}
            onDurationChange={setDuration}
            selectedCarrier={selectedCarrier}
            onSelectedCarrierChange={setSelectedCarrier}
            onCancel={handleCancel}
            onTermsClick={() => setShowTermsModal(true)}
          />
          {renderTermsModal()}
        </>
      );
    case "schedule":
      return (
        <>
          <SchedulePageNew
            selectedSite={selectedSite}
            onSiteChange={handleSiteChange}
            siteOptions={siteOptions}
            onStepClick={handleStepClick}
            shipmentType={shipmentType}
            loadType={loadType}
            productType={productType}
            questionAnswers={questionAnswers}
            shipments={shipments}
            duration={duration}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            originalScheduledTime={originalScheduledTime}
            onSelectedDateChange={setSelectedDate}
            onSelectedTimeChange={setSelectedTime}
            driverName={driverName}
            mobileNumber={mobileNumber}
            selectedCarrier={selectedCarrier}
            trailerNumber={trailerNumber}
            onCancel={handleCancel}
            onComplete={handleTrailerNext}
            onTermsClick={() => setShowTermsModal(true)}
          />
          {renderTermsModal()}
        </>
      );
    default:
      return (
        <>
          <SchedulePage onTermsClick={() => setShowTermsModal(true)} />
          {renderTermsModal()}
        </>
      );
  }
};

export default App;
