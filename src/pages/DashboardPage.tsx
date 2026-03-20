import { useState, useMemo, useEffect, useRef, type RefObject } from "react";
import "../styles/schedule.css";
import { PageLayout } from "../components/PageLayout";
import { Dropdown } from "../components/Dropdown";
import { DateDropdown } from "../components/DateDropdown";
import { NextPrevButtons } from "../components/NextPrevButtons";
import { DateRangeSelector } from "../components/DateRangeSelector";
import calendarIcon from "../assets/calendar.svg";
import directionalArrowLeft from "../assets/directionalArrow-left.svg";
import directionalArrowRight from "../assets/directionalArrow-right.svg";
import directionalArrowOB from "../assets/directionalArrow-OB.svg";
import directionalArrowsIB from "../assets/directionalArrows-IB.svg";
import trailerIcon from "../assets/trailer.svg";
import checkCircleIcon from "../assets/check-circle.svg";
import chevronDown from "../assets/chevron-down.svg";
import plusIcon from "../assets/plus.svg";
import settingsIcon from "../assets/settings.svg";

type DateRangeMode = "Today" | "This Week" | "This Month" | "Time Range";

type ShipmentStatus = "Scheduled" | "In Progress" | "Cancelled" | "Complete";

type DashboardShipment = {
  id: string;
  status: ShipmentStatus;
  time: string;
  date: string;
  confirmationNumber: string;
  shipmentId: string;
  creationMethod: string;
  creationDate: string;
  shipmentType: string;
  carrier: string;
  trailer: string;
  driver: string;
  phone: string;
  tags: string[]; // Question answers (freight service type and storage considerations)
  vendor: string;
  pallets: string;
  cases: string;
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

const firstNames = [
  "James", "Michael", "Robert", "John", "David", "William", "Richard", "Joseph",
  "Thomas", "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Donald",
  "Steven", "Paul", "Andrew", "Joshua", "Kenneth", "Kevin", "Brian", "George",
  "Timothy", "Ronald", "Jason", "Edward", "Jeffrey", "Ryan", "Jacob", "Gary",
  "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon",
  "Benjamin", "Samuel", "Frank", "Gregory", "Raymond", "Alexander", "Patrick",
  "Jack", "Dennis", "Jerry", "Tyler", "Aaron", "Jose", "Henry", "Adam", "Douglas",
  "Nathan", "Zachary", "Kyle", "Noah", "Ethan", "Jeremy", "Walter", "Christian",
  "Keith", "Roger", "Terry", "Austin", "Sean", "Gerald", "Carl", "Harold",
  "Dylan", "Arthur", "Lawrence", "Jordan", "Wayne", "Alan", "Juan", "Willie",
  "Elijah", "Randy", "Roy", "Vincent", "Ralph", "Eugene", "Russell", "Bobby",
  "Mason", "Philip", "Louis"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas",
  "Taylor", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris",
  "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen",
  "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green",
  "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter",
  "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz",
  "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy", "Cook",
  "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey", "Reed",
  "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson",
  "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz",
  "Hughes", "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long",
  "Ross", "Foster", "Jimenez"
];

const shipmentTypes = [
  "Inbound Std / Live Load",
  "Inbound Std / Drop",
  "Inbound Non-Std / Live Load",
  "Inbound Non-Std / Drop",
  "Outbound Std / Live Load",
  "Outbound Std / Drop",
  "Outbound Non-Std / Live Load",
  "Outbound Non-Std / Drop"
];

const creationMethods = [
  "Web Portal",
  "API",
  "Phone",
  "Email",
  "Mobile App"
];

const freightServiceTypes = [
  "LTL (Less-Than-Truckload)",
  "FTL (Full Truckload)"
];

const storageConsiderations = [
  "Dry",
  "Cooler",
  "Freezer"
];

// Generate mock data for appointments
const generateMockShipments = (): DashboardShipment[] => {
  const shipments: DashboardShipment[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Generate for past 30 days + today + next 16 days = 47 days total
  for (let dayOffset = -30; dayOffset <= 16; dayOffset++) {
    const appointmentDate = new Date(today);
    appointmentDate.setDate(today.getDate() + dayOffset);
    
    const year = appointmentDate.getFullYear().toString().slice(-2);
    const month = (appointmentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = appointmentDate.getDate().toString().padStart(2, '0');
    const dateStr = `${month}/${day}/${year}`;
    
    // Determine status based on date
    let possibleStatuses: ShipmentStatus[];
    if (dayOffset < 0) {
      // Past dates - all Complete
      possibleStatuses = ["Complete"];
    } else if (dayOffset === 0) {
      // Today - can have any status
      possibleStatuses = ["Scheduled", "In Progress", "Complete"];
    } else {
      // Future dates - all Scheduled
      possibleStatuses = ["Scheduled"];
    }
    
    // Generate 3-10 appointments per day
    const numAppointments = Math.floor(Math.random() * 8) + 3; // 3-10
    const confirmationNumbers = new Set<number>();
    
    for (let i = 0; i < numAppointments; i++) {
      // Generate unique confirmation number suffix for this day
      let confirmationSuffix = Math.floor(Math.random() * 999) + 1;
      while (confirmationNumbers.has(confirmationSuffix)) {
        confirmationSuffix = Math.floor(Math.random() * 999) + 1;
      }
      confirmationNumbers.add(confirmationSuffix);
      
      const confirmationNumber = `MYQ-${year}${month}${day}-${confirmationSuffix.toString().padStart(3, '0')}`;
      
      // Generate random time (between 4am and 10pm)
      const hour = Math.floor(Math.random() * 19) + 4; // 4-22
      const minute = Math.random() < 0.5 ? 0 : 30;
      const timeStr = `${hour}:${minute.toString().padStart(2, '0')}${hour >= 12 ? 'pm' : 'am'}`;
      
      // Generate unique shipment ID (9 digits)
      const shipmentId = Math.floor(100000000 + Math.random() * 900000000).toString();
      
      // Generate creation date (random date in the past 60 days)
      const creationDateObj = new Date(today);
      creationDateObj.setDate(today.getDate() - Math.floor(Math.random() * 60));
      const creationMonth = creationDateObj.getMonth() + 1;
      const creationDay = creationDateObj.getDate();
      const creationYear = creationDateObj.getFullYear();
      const creationDate = `${creationMonth}/${creationDay}/${creationYear}`;
      
      // Random carrier
      const carrier = carrierOptions[Math.floor(Math.random() * carrierOptions.length)];
      
      // Random trailer number (max 5 digits)
      const trailer = Math.floor(1000 + Math.random() * 90000).toString().slice(0, 5);
      
      // Random driver name
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const driver = `${firstName} ${lastName}`;
      
      // Random phone number
      const areaCode = Math.floor(200 + Math.random() * 800); // 200-999
      const exchange = Math.floor(200 + Math.random() * 800); // 200-999
      const number = Math.floor(1000 + Math.random() * 9000); // 1000-9999
      const phone = `(${areaCode}) ${exchange}-${number}`;
      
      // Determine status based on time (only for today)
      let status: ShipmentStatus;
      if (dayOffset === 0) {
        // For today, determine status based on appointment time relative to current time
        const now = new Date();
        const appointmentTime = new Date(now);
        appointmentTime.setHours(hour, minute, 0, 0);
        
        // Calculate time difference in hours
        const timeDiffHours = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        if (timeDiffHours < -2) {
          // More than 2 hours in the past -> Complete
          status = "Complete";
        } else if (timeDiffHours >= -2 && timeDiffHours <= 3) {
          // Within 2 hours in the past to 3 hours in the future -> In Progress
          status = "In Progress";
        } else {
          // More than 3 hours in the future -> Scheduled
          status = "Scheduled";
        }
      } else {
        // For other days, use random status from possibleStatuses
        status = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
      }
      
      // Random shipment type
      const shipmentType = shipmentTypes[Math.floor(Math.random() * shipmentTypes.length)];
      
      // Random creation method
      const creationMethod = creationMethods[Math.floor(Math.random() * creationMethods.length)];
      
      // Random tags (question answers)
      const freightServiceType = freightServiceTypes[Math.floor(Math.random() * freightServiceTypes.length)];
      const storageConsideration = storageConsiderations[Math.floor(Math.random() * storageConsiderations.length)];
      const tags = [freightServiceType, storageConsideration];
      
      // Random vendor (using common vendor names)
      const vendorNames = [
        "Nestle", "Kraft Heinz", "General Mills", "PepsiCo", "Coca-Cola Company", "Unilever",
        "Campbell Soup Company", "Conagra Brands", "Kellogg Company", "Mondelez International",
        "Tyson Foods", "JBS USA", "Smithfield Foods", "Cargill", "Archer Daniels Midland"
      ];
      const vendor = vendorNames[Math.floor(Math.random() * vendorNames.length)];
      
      // Random pallets and cases
      const pallets = (Math.floor(Math.random() * 30) + 10).toString(); // 10-40 pallets
      const cases = (parseInt(pallets) * 20 + Math.floor(Math.random() * 200)).toString(); // Cases based on pallets
      
      shipments.push({
        id: `${appointmentDate.getTime()}-${i}`,
        status,
        time: timeStr,
        date: dateStr,
        confirmationNumber,
        shipmentId,
        creationMethod,
        creationDate,
        shipmentType,
        carrier,
        trailer,
        driver,
        phone,
        tags,
        vendor,
        pallets,
        cases,
      });
    }
  }
  
  // Sort by date, then by time
  return sortShipmentsByDateAndTime(shipments);
};

// Helper function to sort shipments by date and time
const sortShipmentsByDateAndTime = (shipments: DashboardShipment[]): DashboardShipment[] => {
  return [...shipments].sort((a, b) => {
    // Parse dates (format: M/D/YY or MM/DD/YY)
    const parseDate = (dateStr: string) => {
      const [month, day, year] = dateStr.split('/').map(Number);
      return new Date(2000 + year, month - 1, day);
    };
    
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    
    // Compare dates first
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    // If same date, compare times
    const parseTime = (timeStr: string) => {
      // Normalize the time string (remove spaces, convert to lowercase)
      const normalized = timeStr.replace(/\s+/g, '').toLowerCase();
      
      // Try to match 12-hour format (with am/pm)
      const ampmMatch = normalized.match(/(\d+):(\d+)(am|pm)/i);
      if (ampmMatch) {
        let hour = parseInt(ampmMatch[1]);
        const minute = parseInt(ampmMatch[2]);
        const period = ampmMatch[3].toLowerCase();
        
        // If hour > 12, this is actually 24-hour format with am/pm incorrectly appended
        if (hour > 12) {
          // It's already in 24-hour format, just use it
          return hour * 60 + minute;
        }
        
        // Convert 12-hour to 24-hour for comparison
        if (period === 'pm' && hour !== 12) hour += 12;
        if (period === 'am' && hour === 12) hour = 0;
        
        return hour * 60 + minute; // Convert to minutes for easy comparison
      }
      
      // Try to match 24-hour format (e.g., "19:00", "09:00")
      const militaryMatch = timeStr.match(/(\d{1,2}):(\d{2})(?:\s*(am|pm))?/i);
      if (militaryMatch) {
        let hour = parseInt(militaryMatch[1]);
        const minute = parseInt(militaryMatch[2]);
        
        // If hour > 12 or hour === 0, it's definitely 24-hour format
        // If hour is 1-12 with no period, assume it's 24-hour format (could be ambiguous, but safer for sorting)
        return hour * 60 + minute;
      }
      
      // If we can't parse it, return 0 (will sort to the beginning)
      return 0;
    };
    
    return parseTime(a.time) - parseTime(b.time);
  });
};

// Sample data - in a real app, this would come from an API
const sampleShipments: DashboardShipment[] = generateMockShipments();

// Export for use in App.tsx
export { sampleShipments, generateMockShipments };
export type { DashboardShipment };

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

type DashboardPageProps = {
  selectedSite?: string;
  onSiteChange?: (site: string) => void;
  onScheduleShipment?: () => void;
  showConfirmationModal?: boolean; // Control whether modal is shown initially
  onCloseModal?: () => void; // Callback when modal is closed
  confirmationData?: {
    confirmationNumber: string;
    appointmentTime: string;
    companyName: string;
    fullLocation: string;
  };
  dashboardShipments?: DashboardShipment[] | null; // Shipments from App state
  onDashboardShipmentsChange?: (shipments: DashboardShipment[]) => void; // Callback to update shipments
  schedulingData?: {
    shipmentType: "Inbound" | "Outbound";
    loadType: string;
    productType: "Standard" | "Non Standard";
    selectedCarrier: string;
    trailerNumber: string;
    driverName: string;
    mobileNumber: string;
    shipments: Array<{
      rowId: string;
      id: string;
      idType: string;
      vendor: string;
      pallets: string;
      cases: string;
      stop: string;
      isPrimary: boolean;
    }>;
    questionAnswers: {
      question1: string;
      question2: string;
    };
    appointmentToUpdateId?: string | null; // ID of appointment being rescheduled/edited
  };
  onTermsClick?: () => void;
  onReschedule?: (shipment: DashboardShipment) => void;
  onEditAppointment?: (shipment: DashboardShipment) => void;
  initialDateFilter?: {
    selectedDate: Date;
    dateRangeMode: "Today" | "This Week" | "This Month" | "Time Range";
    dateRange: { start: Date | null; end: Date | null };
  } | null;
  onDateFilterChange?: (filter: {
    selectedDate: Date;
    dateRangeMode: "Today" | "This Week" | "This Month" | "Time Range";
    dateRange: { start: Date | null; end: Date | null };
  }) => void;
};

export const DashboardPage = ({
  selectedSite = siteOptions[0],
  onSiteChange,
  onScheduleShipment,
  showConfirmationModal: initialShowModal = false,
  onCloseModal,
  confirmationData,
  dashboardShipments: externalShipments,
  onDashboardShipmentsChange,
  schedulingData,
  onTermsClick,
  onReschedule,
  onEditAppointment,
  initialDateFilter,
  onDateFilterChange,
}: DashboardPageProps) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(initialShowModal);
  // Use external shipments if provided, otherwise use local state
  const [localShipments, setLocalShipments] = useState<DashboardShipment[]>(sampleShipments);
  // Use external shipments if provided, otherwise fall back to local state
  // If external is null (not initialized yet), use local state
  // Always ensure shipments are sorted by date and time
  const rawShipments = (externalShipments !== undefined && externalShipments !== null) ? externalShipments : localShipments;
  const shipments = useMemo(() => sortShipmentsByDateAndTime(rawShipments), [rawShipments]);
  
  // Wrapper function to handle both external and local state updates
  const updateShipments = (updater: (prev: DashboardShipment[]) => DashboardShipment[]) => {
    if (externalShipments !== undefined && onDashboardShipmentsChange) {
      // Use external state
      const current = externalShipments || sampleShipments;
      const updated = updater(current);
      // Always ensure shipments are sorted after update
      const sorted = sortShipmentsByDateAndTime(updated);
      onDashboardShipmentsChange(sorted);
    } else {
      // Use local state
      setLocalShipments((prev) => {
        const updated = updater(prev);
        // Always ensure shipments are sorted after update
        return sortShipmentsByDateAndTime(updated);
      });
    }
  };

  // Update modal state when prop changes
  useEffect(() => {
    setShowConfirmationModal(initialShowModal);
  }, [initialShowModal]);

  // Ensure shipments are sorted whenever external shipments change
  useEffect(() => {
    if (externalShipments !== undefined && externalShipments !== null && onDashboardShipmentsChange) {
      const sorted = sortShipmentsByDateAndTime([...externalShipments]);
      // Only update if order changed (compare IDs)
      const orderChanged = externalShipments.length !== sorted.length ||
        externalShipments.some((shipment, index) => shipment.id !== sorted[index]?.id);
      if (orderChanged) {
        onDashboardShipmentsChange(sorted);
      }
    }
  }, [externalShipments, onDashboardShipmentsChange]);

  const [selectedStatuses, setSelectedStatuses] = useState<ShipmentStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"Shipment ID" | "Confirmation #" | "Carrier">("Shipment ID");
  const [selectedDate, setSelectedDate] = useState(initialDateFilter?.selectedDate || new Date()); // Today's date
  const [dateRangeMode, setDateRangeMode] = useState<DateRangeMode>(initialDateFilter?.dateRangeMode || "Today");
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>(
    initialDateFilter?.dateRange || {
      start: null,
      end: null,
    }
  );
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [isPanelClosing, setIsPanelClosing] = useState(false);
  const [openActionsDropdownId, setOpenActionsDropdownId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showWithin24HoursModal, setShowWithin24HoursModal] = useState(false);
  const [showCannotRescheduleModal, setShowCannotRescheduleModal] = useState(false);
  const [showCannotEditModal, setShowCannotEditModal] = useState(false);
  const [shipmentToCancel, setShipmentToCancel] = useState<DashboardShipment | null>(null);
  const [shipmentToReschedule, setShipmentToReschedule] = useState<DashboardShipment | null>(null);
  const [shipmentToEdit, setShipmentToEdit] = useState<DashboardShipment | null>(null);
  const detailsScrollRef = useRef<HTMLDivElement>(null);
  const hasDetailsOverflow = useOverflowState(detailsScrollRef);

  // Function to create a new shipment from confirmation and scheduling data
  const createShipmentFromConfirmation = (): DashboardShipment | null => {
    if (!confirmationData || !schedulingData) return null;

    // Parse appointment time (format: "M/D/YY HH:MMam/pm" or "M/D/YY HH:MM am/pm")
    const appointmentTimeParts = confirmationData.appointmentTime.trim().split(/\s+/);
    const datePart = appointmentTimeParts[0]; // "M/D/YY"
    const timePart = appointmentTimeParts.slice(1).join(" "); // "HH:MMam/pm" or "HH:MM am/pm"
    
    // Parse date (format: "M/D/YY")
    const [month, day, year] = datePart.split("/");
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    const yearInt = parseInt(year);
    // Use 2-digit year format to match mock data format
    const twoDigitYear = yearInt < 100 ? yearInt : yearInt % 100;
    
    // Format date for display (match mock data format: "MM/DD/YY" with zero-padding)
    const dateStr = `${monthNum.toString().padStart(2, '0')}/${dayNum.toString().padStart(2, '0')}/${twoDigitYear.toString().padStart(2, '0')}`;
    
    // Format time for display - normalize to lowercase "am/pm" without spaces (e.g., "4:00am" or "4:00pm")
    // This matches the format expected by the sorting function
    let timeStr = timePart.trim();
    // Remove spaces and convert to lowercase
    timeStr = timeStr.replace(/\s+/g, '').toLowerCase();
    
    // Get primary shipment (first shipment, or first with an ID)
    const primaryShipment = schedulingData.shipments.find(s => s.isPrimary) || 
                             schedulingData.shipments.find(s => s.id && s.id.trim() !== "") ||
                             schedulingData.shipments[0];
    const shipmentId = primaryShipment?.id || Math.floor(100000000 + Math.random() * 900000000).toString();
    
    // Get vendor, pallets, and cases from primary shipment
    const vendor = primaryShipment?.vendor || "--";
    const pallets = primaryShipment?.pallets || "--";
    const cases = primaryShipment?.cases || "--";
    
    // Build shipment type string
    const shipmentTypeStr = `${schedulingData.shipmentType} ${schedulingData.productType === "Standard" ? "Std" : "Non-Std"} / ${schedulingData.loadType === "Live" ? "Live Load" : "Drop"}`;
    
    // Build tags from question answers
    const tags: string[] = [];
    if (schedulingData.questionAnswers.question1) {
      tags.push(schedulingData.questionAnswers.question1);
    }
    if (schedulingData.questionAnswers.question2) {
      tags.push(schedulingData.questionAnswers.question2);
    }
    
    // Get creation date (today)
    const today = new Date();
    const creationMonth = today.getMonth() + 1;
    const creationDay = today.getDate();
    const creationYear = today.getFullYear();
    const creationDate = `${creationMonth}/${creationDay}/${creationYear}`;
    
    // Generate unique ID for the shipment
    const id = `shipment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newShipment: DashboardShipment = {
      id,
      status: "Scheduled",
      time: timeStr,
      date: dateStr,
      confirmationNumber: confirmationData.confirmationNumber,
      shipmentId: shipmentId,
      creationMethod: "Scheduling Portal",
      creationDate: creationDate,
      shipmentType: shipmentTypeStr,
      carrier: schedulingData.selectedCarrier || "--",
      trailer: schedulingData.trailerNumber || "--",
      driver: schedulingData.driverName || "--",
      phone: schedulingData.mobileNumber || "--",
      tags: tags,
      vendor: vendor,
      pallets: pallets,
      cases: cases,
    };
    
    return newShipment;
  };

  const handleCloseModal = () => {
    // Capture data before closing modal (in case props get cleared)
    const currentConfirmationData = confirmationData;
    const currentSchedulingData = schedulingData;
    
    setShowConfirmationModal(false);
    
    // Add new shipment to the list if we have confirmation and scheduling data
    // Use captured data to ensure it's available even if props change
    if (currentConfirmationData && currentSchedulingData) {
      // Parse appointment time (format: "M/D/YY HH:MMam/pm" or "M/D/YY HH:MM am/pm")
      const appointmentTimeParts = currentConfirmationData.appointmentTime.trim().split(/\s+/);
      const datePart = appointmentTimeParts[0]; // "M/D/YY"
      const timePart = appointmentTimeParts.slice(1).join(" "); // "HH:MMam/pm" or "HH:MM am/pm"
      
      // Parse date (format: "M/D/YY")
      const [month, day, year] = datePart.split("/");
      const monthNum = parseInt(month);
      const dayNum = parseInt(day);
      const yearInt = parseInt(year);
      // Use 2-digit year format to match mock data format
      const twoDigitYear = yearInt < 100 ? yearInt : yearInt % 100;
      
      // Format date for display (match mock data format: "MM/DD/YY" with zero-padding)
      const dateStr = `${monthNum.toString().padStart(2, '0')}/${dayNum.toString().padStart(2, '0')}/${twoDigitYear.toString().padStart(2, '0')}`;
      
      // Format time for display (remove any extra spaces)
      const timeStr = timePart.trim();
      
      // Get primary shipment (first shipment, or first with an ID)
      const primaryShipment = currentSchedulingData.shipments.find(s => s.isPrimary) || 
                               currentSchedulingData.shipments.find(s => s.id && s.id.trim() !== "") ||
                               currentSchedulingData.shipments[0];
      const shipmentId = primaryShipment?.id || Math.floor(100000000 + Math.random() * 900000000).toString();
      
      // Get vendor, pallets, and cases from primary shipment
      const vendor = primaryShipment?.vendor || "--";
      const pallets = primaryShipment?.pallets || "--";
      const cases = primaryShipment?.cases || "--";
      
      // Build shipment type string
      const shipmentTypeStr = `${currentSchedulingData.shipmentType} ${currentSchedulingData.productType === "Standard" ? "Std" : "Non-Std"} / ${currentSchedulingData.loadType === "Live" ? "Live Load" : "Drop"}`;
      
      // Build tags from question answers
      const tags: string[] = [];
      if (currentSchedulingData.questionAnswers.question1) {
        tags.push(currentSchedulingData.questionAnswers.question1);
      }
      if (currentSchedulingData.questionAnswers.question2) {
        tags.push(currentSchedulingData.questionAnswers.question2);
      }
      
      // Get creation date (today)
      const today = new Date();
      const creationMonth = today.getMonth() + 1;
      const creationDay = today.getDate();
      const creationYear = today.getFullYear();
      const creationDate = `${creationMonth}/${creationDay}/${creationYear}`;
      
      // Generate unique ID for the shipment
      const id = `shipment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const newShipment: DashboardShipment = {
        id,
        status: "Scheduled",
        time: timeStr,
        date: dateStr,
        confirmationNumber: currentConfirmationData.confirmationNumber,
        shipmentId: shipmentId,
        creationMethod: "Scheduling Portal",
        creationDate: creationDate,
        shipmentType: shipmentTypeStr,
        carrier: currentSchedulingData.selectedCarrier || "--",
        trailer: currentSchedulingData.trailerNumber || "--",
        driver: currentSchedulingData.driverName || "--",
        phone: currentSchedulingData.mobileNumber || "--",
        tags: tags,
        vendor: vendor,
        pallets: pallets,
        cases: cases,
      };
      
      // Check if we're updating an existing appointment (reschedule/edit) or creating a new one
      const appointmentToUpdateId = currentSchedulingData.appointmentToUpdateId;
      
      console.log('Adding/updating shipment:', newShipment);
      console.log('Appointment to update ID:', appointmentToUpdateId);
      
      updateShipments((prev: DashboardShipment[]) => {
        console.log('Previous shipments count:', prev.length);
        console.log('Previous shipments IDs:', prev.map((s: DashboardShipment) => s.id));
        console.log('New shipment ID:', newShipment.id);
        
        // If we're updating an existing appointment (reschedule/edit)
        if (appointmentToUpdateId) {
          const existingIndex = prev.findIndex((s: DashboardShipment) => s.id === appointmentToUpdateId);
          if (existingIndex >= 0) {
            console.log('Updating existing appointment:', existingIndex, appointmentToUpdateId);
            // Update existing appointment with new date/time and other changes
            // Keep the original ID and creation date/method, but update everything else
            const existingShipment = prev[existingIndex];
            // Remove the old appointment and create a new one with updated data
            // This ensures React properly detects the change and re-renders
            const updated = prev.filter((s: DashboardShipment) => s.id !== appointmentToUpdateId);
            const updatedShipment: DashboardShipment = {
              ...existingShipment,
              // Update date and time
              date: newShipment.date,
              time: newShipment.time,
              // Update confirmation number (new appointment gets new confirmation)
              confirmationNumber: newShipment.confirmationNumber,
              // Update shipment details
              shipmentId: newShipment.shipmentId,
              shipmentType: newShipment.shipmentType,
              carrier: newShipment.carrier,
              trailer: newShipment.trailer,
              driver: newShipment.driver,
              phone: newShipment.phone,
              tags: newShipment.tags,
              vendor: newShipment.vendor,
              pallets: newShipment.pallets,
              cases: newShipment.cases,
              // Keep original ID, creation date, and creation method
              id: appointmentToUpdateId,
              creationDate: existingShipment.creationDate,
              creationMethod: existingShipment.creationMethod,
            };
            // Add the updated shipment back and sort
            updated.push(updatedShipment);
            console.log('Updated shipments count (updated):', updated.length);
            // Sort by date and time after update
            return sortShipmentsByDateAndTime(updated);
          } else {
            console.warn('Appointment to update not found:', appointmentToUpdateId);
            // Fall through to add as new if not found
          }
        }
        
        // Check if shipment with same ID already exists (shouldn't happen, but just in case)
        const existingIndex = prev.findIndex((s: DashboardShipment) => s.id === newShipment.id);
        if (existingIndex >= 0) {
          console.warn('Shipment with same ID already exists, replacing:', existingIndex);
          // Replace existing instead of adding duplicate
          const updated = [...prev];
          updated[existingIndex] = newShipment;
          console.log('Updated shipments count (replaced):', updated.length);
          // Sort by date and time after replacement
          return sortShipmentsByDateAndTime(updated);
        }
        
        // Add new shipment and sort by date and time
        const updated = [...prev, newShipment];
        console.log('Updated shipments count (added):', updated.length);
        const sorted = sortShipmentsByDateAndTime(updated);
        console.log('Updated shipments IDs (sorted):', sorted.map((s: DashboardShipment) => s.id));
        return sorted;
      });
    } else {
      console.log('No shipment created - confirmationData:', currentConfirmationData, 'schedulingData:', currentSchedulingData);
    }
    
    onCloseModal?.();
  };

  const toggleStatus = (status: ShipmentStatus) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(status)) {
        // Remove status if already selected
        return prev.filter((s) => s !== status);
      } else {
        // Add status if not selected
        return [...prev, status];
      }
    });
  };

  // Filter by date range and search query (without status filter) for counting
  const dateAndSearchFilteredShipments = useMemo(() => {
    let filtered = shipments;

    // Filter by search query based on selected search type
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((s) => {
        if (searchType === "Shipment ID") {
          const searchDigits = query.replace(/\D/g, ""); // Remove non-digits
          const lastDigits = s.shipmentId.slice(-5);
          return lastDigits.includes(searchDigits);
        } else if (searchType === "Confirmation #") {
          return s.confirmationNumber.toLowerCase().includes(query);
        } else if (searchType === "Carrier") {
          return s.carrier.toLowerCase().includes(query);
        }
        return true;
      });
    }

    // Filter by date range
    if (dateRangeMode === "Time Range" && dateRange.start && dateRange.end) {
      filtered = filtered.filter((s) => {
        // Parse date from string like "1/6/26"
        const [month, day, year] = s.date.split("/").map(Number);
        const shipmentDate = new Date(2000 + year, month - 1, day);
        return shipmentDate >= dateRange.start! && shipmentDate <= dateRange.end!;
      });
    } else {
      // Filter by selected date based on mode
      const filterDate = new Date(selectedDate);
      filterDate.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter((s) => {
        const [month, day, year] = s.date.split("/").map(Number);
        const shipmentDate = new Date(2000 + year, month - 1, day);
        shipmentDate.setHours(0, 0, 0, 0);
        
        switch (dateRangeMode) {
          case "Today":
            return shipmentDate.getTime() === filterDate.getTime();
          case "This Week": {
            const weekStart = new Date(filterDate);
            const day = weekStart.getDay();
            weekStart.setDate(weekStart.getDate() - day);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            return shipmentDate >= weekStart && shipmentDate <= weekEnd;
          }
          case "This Month": {
            return shipmentDate.getMonth() === filterDate.getMonth() &&
                   shipmentDate.getFullYear() === filterDate.getFullYear();
          }
          default:
            return shipmentDate.getTime() === filterDate.getTime();
        }
      });
    }

    return filtered;
  }, [searchQuery, searchType, selectedDate, dateRangeMode, dateRange, shipments]);

  const filteredShipments = useMemo(() => {
    let filtered = dateAndSearchFilteredShipments;

    // Filter by status (if any statuses are selected)
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((s) => selectedStatuses.includes(s.status));
    }

    // Always sort filtered results by date and time to ensure correct order
    return sortShipmentsByDateAndTime(filtered);
  }, [selectedStatuses, dateAndSearchFilteredShipments]);

  const statusCounts = useMemo(() => {
    const counts = {
      Scheduled: 0,
      "In Progress": 0,
      Complete: 0,
      Cancelled: 0,
    };
    dateAndSearchFilteredShipments.forEach((s) => {
      if (s.status in counts) {
        counts[s.status as keyof typeof counts]++;
      }
    });
    return counts;
  }, [dateAndSearchFilteredShipments]);

  const formatDate = (date: Date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
    return `${dayName}, ${month} ${day}${suffix} ${year}`;
  };

  const navigateDate = (direction: "prev" | "next") => {
    if (dateRangeMode === "Time Range") {
      return; // Disabled in Time Range mode
    }

    const newDate = new Date(selectedDate);
    
    switch (dateRangeMode) {
      case "Today":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
      case "This Week":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      case "This Month":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        break;
    }
    
    setSelectedDate(newDate);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
  };

  // Sync date filter state to parent when it changes (but avoid loops)
  const lastSyncedState = useRef<{
    selectedDate: Date;
    dateRangeMode: DateRangeMode;
    dateRange: { start: Date | null; end: Date | null };
  } | null>(null);
  
  const isRestoringFromProp = useRef(false);
  
  useEffect(() => {
    // Skip if we're currently restoring from prop
    if (isRestoringFromProp.current) {
      return;
    }
    
    // Check if state actually changed
    const currentState = {
      selectedDate,
      dateRangeMode,
      dateRange,
    };
    
    if (lastSyncedState.current) {
      const last = lastSyncedState.current;
      // Compare dates by time value
      if (
        last.selectedDate.getTime() === currentState.selectedDate.getTime() &&
        last.dateRangeMode === currentState.dateRangeMode &&
        last.dateRange.start?.getTime() === currentState.dateRange.start?.getTime() &&
        last.dateRange.end?.getTime() === currentState.dateRange.end?.getTime()
      ) {
        return; // No change, skip sync
      }
    }
    
    // Update last synced state
    lastSyncedState.current = {
      selectedDate: new Date(selectedDate),
      dateRangeMode,
      dateRange: {
        start: dateRange.start ? new Date(dateRange.start) : null,
        end: dateRange.end ? new Date(dateRange.end) : null,
      },
    };
    
    // Sync to parent
    if (onDateFilterChange) {
      onDateFilterChange({
        selectedDate: new Date(selectedDate),
        dateRangeMode,
        dateRange: {
          start: dateRange.start ? new Date(dateRange.start) : null,
          end: dateRange.end ? new Date(dateRange.end) : null,
        },
      });
    }
  }, [selectedDate, dateRangeMode, dateRange, onDateFilterChange]);

  const handleModeChange = (mode: DateRangeMode) => {
    setDateRangeMode(mode);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (mode) {
      case "Today":
        setSelectedDate(today);
        break;
      case "This Week": {
        // Get start of week (Sunday)
        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - day);
        setSelectedDate(startOfWeek);
        break;
      }
      case "This Month": {
        // Get start of month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        setSelectedDate(startOfMonth);
        break;
      }
      case "Time Range": {
        // Initialize to last 15 days
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 14);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        setDateRange({ start, end });
        break;
      }
    }
  };

  const handleRowClick = (shipmentId: string) => {
    if (selectedShipmentId === shipmentId) {
      // Clicking the same row - hide panel with animation
      setIsPanelClosing(true);
      setTimeout(() => {
        setSelectedShipmentId(null);
        setShowSidePanel(false);
        setIsPanelClosing(false);
      }, 300); // Match animation duration
    } else {
      // Clicking a different row - show panel with new selection
      setSelectedShipmentId(shipmentId);
      setShowSidePanel(true);
      setIsPanelClosing(false);
    }
  };

  const selectedShipment = useMemo(() => {
    if (!selectedShipmentId) return null;
    return filteredShipments.find(s => s.id === selectedShipmentId) || null;
  }, [selectedShipmentId, filteredShipments]);

  const getStatusColor = (status: ShipmentStatus) => {
    switch (status) {
      case "Scheduled":
        return "var(--color-text-brand-primary)";
      case "In Progress":
        return "#4CAF50";
      case "Cancelled":
        return "#F44336";
      case "Complete":
        return "#9E9E9E";
      default:
        return "#9E9E9E";
    }
  };

  // Format time for display (convert "4:00am" to "4:00 AM" or "19:00" to "7:00 PM")
  const formatTimeForDisplay = (timeStr: string): string => {
    // First, try to match 12-hour format (with am/pm) - but check if hour is valid (1-12)
    const normalized = timeStr.replace(/\s+/g, '').toLowerCase();
    const ampmMatch = normalized.match(/(\d+):(\d+)(am|pm)/i);
    
    if (ampmMatch) {
      const hour = parseInt(ampmMatch[1]);
      const minute = ampmMatch[2];
      const period = ampmMatch[3].toUpperCase();
      
      // If hour is > 12, this is actually 24-hour format with am/pm incorrectly appended
      // (e.g., "19:00 PM" should be "7:00 PM")
      if (hour > 12) {
        // Convert from 24-hour to 12-hour
        const convertedHour = hour === 12 ? 12 : hour - 12;
        const correctPeriod = hour >= 12 ? 'PM' : 'AM';
        return `${convertedHour}:${minute} ${correctPeriod}`;
      }
      
      // Valid 12-hour format, just format it nicely
      return `${hour}:${minute} ${period}`;
    }
    
    // Try to match 24-hour format (e.g., "19:00", "09:00") - may or may not have am/pm appended
    const militaryMatch = timeStr.match(/(\d{1,2}):(\d{2})(?:\s*(am|pm))?/i);
    if (militaryMatch) {
      let hour = parseInt(militaryMatch[1]);
      const minute = militaryMatch[2];
      const appendedPeriod = militaryMatch[3];
      
      // If hour is > 12, this is definitely 24-hour format
      if (hour > 12 || hour === 0) {
        // Convert to 12-hour format
        const period = hour >= 12 ? 'PM' : 'AM';
        if (hour === 0) {
          hour = 12; // Midnight
        } else if (hour > 12) {
          hour = hour - 12; // Afternoon/evening
        }
        // hour === 12 stays as 12 (noon)
        
        return `${hour}:${minute} ${period}`;
      }
      
      // Hour is 1-12, might be 12-hour format without am/pm, or 24-hour format
      // If there's an appended period, use it; otherwise assume it's 12-hour and add AM
      if (appendedPeriod) {
        return `${hour}:${minute} ${appendedPeriod.toUpperCase()}`;
      }
      // Without period, assume it's morning (AM) for hours 1-12
      return `${hour}:${minute} AM`;
    }
    
    // Return as-is if format is unexpected
    return timeStr;
  };

  const getStatusClass = (status: ShipmentStatus): string => {
    switch (status) {
      case "Scheduled":
        return "status-scheduled";
      case "In Progress":
        return "status-in-progress";
      case "Cancelled":
        return "status-cancelled";
      case "Complete":
        return "status-complete";
      default:
        return "status-complete";
    }
  };

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

  // Wrapper to handle null values for setSelectedDate
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  // Sync date filter state when initialDateFilter prop changes (restore from parent)
  const lastRestoredFilter = useRef<typeof initialDateFilter>(null);
  useEffect(() => {
    // Only restore if it's a new/different filter
    if (initialDateFilter && initialDateFilter !== lastRestoredFilter.current) {
      // Check if values are actually different
      const needsUpdate = !lastRestoredFilter.current ||
        lastRestoredFilter.current.selectedDate.getTime() !== initialDateFilter.selectedDate.getTime() ||
        lastRestoredFilter.current.dateRangeMode !== initialDateFilter.dateRangeMode ||
        lastRestoredFilter.current.dateRange.start?.getTime() !== initialDateFilter.dateRange.start?.getTime() ||
        lastRestoredFilter.current.dateRange.end?.getTime() !== initialDateFilter.dateRange.end?.getTime();
      
      if (needsUpdate) {
        isRestoringFromProp.current = true;
        setSelectedDate(new Date(initialDateFilter.selectedDate));
        setDateRangeMode(initialDateFilter.dateRangeMode);
        setDateRange({
          start: initialDateFilter.dateRange.start ? new Date(initialDateFilter.dateRange.start) : null,
          end: initialDateFilter.dateRange.end ? new Date(initialDateFilter.dateRange.end) : null,
        });
        lastRestoredFilter.current = {
          selectedDate: new Date(initialDateFilter.selectedDate),
          dateRangeMode: initialDateFilter.dateRangeMode,
          dateRange: {
            start: initialDateFilter.dateRange.start ? new Date(initialDateFilter.dateRange.start) : null,
            end: initialDateFilter.dateRange.end ? new Date(initialDateFilter.dateRange.end) : null,
          },
        };
        // Reset flag after state updates
        setTimeout(() => {
          isRestoringFromProp.current = false;
        }, 0);
      }
    } else if (!initialDateFilter) {
      lastRestoredFilter.current = null;
    }
  }, [initialDateFilter]);

  // Handle actions dropdown toggle
  const handleActionsClick = (e: React.MouseEvent, shipmentId: string) => {
    e.stopPropagation();
    if (openActionsDropdownId === shipmentId) {
      setOpenActionsDropdownId(null);
    } else {
      setOpenActionsDropdownId(shipmentId);
    }
  };

  // Check if appointment is within 24 hours
  const isWithin24Hours = (shipment: DashboardShipment): boolean => {
    // Parse date (format: M/D/YY or MM/DD/YY)
    const [month, day, year] = shipment.date.split('/').map(Number);
    const appointmentDate = new Date(2000 + year, month - 1, day);
    
    // Parse time (format: H:MMam/pm or HH:MMam/pm)
    const timeMatch = shipment.time.match(/(\d+):(\d+)(am|pm)/i);
    if (!timeMatch) return false;
    
    let hour = parseInt(timeMatch[1]);
    const minute = parseInt(timeMatch[2]);
    const period = timeMatch[3].toLowerCase();
    
    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    
    appointmentDate.setHours(hour, minute, 0, 0);
    
    // Calculate time difference in hours
    const now = new Date();
    const timeDiffHours = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    // Return true if appointment is within 24 hours (0 to 24 hours from now)
    return timeDiffHours >= 0 && timeDiffHours <= 24;
  };

  // Handle action menu item click
  const handleActionItemClick = (action: string, shipmentId: string) => {
    if (action === "Cancel Appointment") {
      const shipment = shipments.find(s => s.id === shipmentId);
      if (shipment) {
        setShipmentToCancel(shipment);
        // Check if appointment is within 24 hours
        if (isWithin24Hours(shipment)) {
          setShowWithin24HoursModal(true);
        } else {
          setShowCancelModal(true);
        }
      }
    } else if (action === "Reschedule") {
      const shipment = shipments.find(s => s.id === shipmentId);
      if (shipment && onReschedule) {
        // Check if appointment is more than 24 hours in the future
        if (!isWithin24Hours(shipment)) {
          onReschedule(shipment);
        } else {
          // Show cannot reschedule modal for appointments within 24 hours
          setShipmentToReschedule(shipment);
          setShowCannotRescheduleModal(true);
        }
      }
    } else if (action === "Edit Appointment") {
      const shipment = shipments.find(s => s.id === shipmentId);
      if (shipment && onEditAppointment) {
        // Check if appointment is more than 24 hours in the future
        if (!isWithin24Hours(shipment)) {
          onEditAppointment(shipment);
        } else {
          // Show cannot edit modal for appointments within 24 hours
          setShipmentToEdit(shipment);
          setShowCannotEditModal(true);
        }
      }
    } else {
      console.log(`Action: ${action} for shipment: ${shipmentId}`);
      // TODO: Implement other action handlers
    }
    setOpenActionsDropdownId(null);
  };

  // Handle confirm cancel appointment
  const handleConfirmCancel = () => {
    if (shipmentToCancel) {
      updateShipments((prev: DashboardShipment[]) => {
        return prev.map((s: DashboardShipment) => 
          s.id === shipmentToCancel.id 
            ? { ...s, status: "Cancelled" as ShipmentStatus }
            : s
        );
      });
    }
    setShowCancelModal(false);
    setShipmentToCancel(null);
  };

  // Handle close cancel modal
  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setShipmentToCancel(null);
  };

  // Handle close within 24 hours modal
  const handleCloseWithin24HoursModal = () => {
    setShowWithin24HoursModal(false);
    setShipmentToCancel(null);
  };

  // Handle close cannot reschedule modal
  const handleCloseCannotRescheduleModal = () => {
    setShowCannotRescheduleModal(false);
    setShipmentToReschedule(null);
  };

  // Handle close cannot edit modal
  const handleCloseCannotEditModal = () => {
    setShowCannotEditModal(false);
    setShipmentToEdit(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside any actions dropdown
      const actionsContainer = target.closest('[data-actions-dropdown]');
      if (!actionsContainer) {
        setOpenActionsDropdownId(null);
      }
    };

    if (openActionsDropdownId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActionsDropdownId]);

  // Calculate the date range to display in DateDropdown based on current mode
  const getDateRangeForDisplay = () => {
    const filterDate = new Date(selectedDate);
    filterDate.setHours(0, 0, 0, 0);

    switch (dateRangeMode) {
      case "Today":
        return null; // Show single date
      case "This Week": {
        const weekStart = new Date(filterDate);
        const day = weekStart.getDay();
        weekStart.setDate(weekStart.getDate() - day);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return { start: weekStart, end: weekEnd };
      }
      case "This Month": {
        const monthStart = new Date(filterDate.getFullYear(), filterDate.getMonth(), 1);
        const monthEnd = new Date(filterDate.getFullYear(), filterDate.getMonth() + 1, 0);
        return { start: monthStart, end: monthEnd };
      }
      case "Time Range":
        if (dateRange.start && dateRange.end) {
          return { start: dateRange.start, end: dateRange.end };
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <>
    <PageLayout
      activeStep="shipment"
      onStepClick={() => {}}
      selectedSite={selectedSite}
      onSiteChange={onSiteChange || (() => {})}
      siteOptions={siteOptions}
      showStepper={false}
      selectedDate={selectedDate}
      onDateChange={handleDateChange}
      minDate={getMinDate()}
      maxDate={getMaxDate()}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: "16px" }}>
        {/* Status Filters and Filter Button */}
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          {/* Status Filters */}
          <div
            style={{
              background: "rgba(255, 255, 255, 1)",
              borderRadius: "16px",
              border: "1px solid #efefef",
              padding: "8px",
              boxShadow: "0 0 16px 0 rgba(0, 0, 0, 0.1)",
              width: "fit-content",
            }}
          >
            <div style={{ display: "flex", gap: "8px", alignItems: "stretch", height: "40px" }}>
              <button
                className={`filter-button status-scheduled ${selectedStatuses.includes("Scheduled") ? "active" : ""}`}
                onClick={() => toggleStatus("Scheduled")}
              >
                <div className="filter-button-indicator" />
                <span className="filter-button-label">Scheduled</span>
                <span className="filter-button-count">{statusCounts.Scheduled}</span>
              </button>
              <button
                className={`filter-button status-in-progress ${selectedStatuses.includes("In Progress") ? "active" : ""}`}
                onClick={() => toggleStatus("In Progress")}
              >
                <div className="filter-button-indicator" />
                <span className="filter-button-label">In Progress</span>
                <span className="filter-button-count">{statusCounts["In Progress"]}</span>
              </button>
              <button
                className={`filter-button status-complete ${selectedStatuses.includes("Complete") ? "active" : ""}`}
                onClick={() => toggleStatus("Complete")}
              >
                <div className="filter-button-indicator" />
                <span className="filter-button-label">Complete</span>
                <span className="filter-button-count">{statusCounts.Complete}</span>
              </button>
              <button
                className={`filter-button status-cancelled ${selectedStatuses.includes("Cancelled") ? "active" : ""}`}
                onClick={() => toggleStatus("Cancelled")}
              >
                <div className="filter-button-indicator" />
                <span className="filter-button-label">Cancelled</span>
                <span className="filter-button-count">{statusCounts.Cancelled}</span>
              </button>
            </div>
          </div>

          {/* Filter Button Panel */}
          <div
            style={{
              background: "rgba(255, 255, 255, 1)",
              borderRadius: "16px",
              border: "1px solid #efefef",
              padding: "8px",
              boxShadow: "0 0 16px 0 rgba(0, 0, 0, 0.1)",
              width: "fit-content",
            }}
          >
            <button
              className="filter-icon-button"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                border: "1px solid #babfcc",
                borderRadius: "8px",
                cursor: "pointer",
                padding: 0,
              }}
              onClick={() => {
                // Handle filter button click
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4H14M4 8H12M6 12H10"
                  stroke="#17191C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content area with table and side panel */}
        <div className="content dashboard-content" style={{ display: "grid", gridTemplateColumns: showSidePanel && !isPanelClosing && selectedShipment ? "1fr 433px" : "1fr 0px", flex: 1, minHeight: 0, gap: showSidePanel && !isPanelClosing && selectedShipment ? "16px" : "0px", overflow: "hidden", transition: "grid-template-columns 0.3s ease-out, gap 0.3s ease-out" } as React.CSSProperties}>
          {/* Shipments Table */}
          <div className="panel table-panel" style={{ minHeight: 0, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Action Bar Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "0px",
              borderBottom: "none",
            }}
          >
            {/* Top Row: Search and Schedule Shipment Button */}
            <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
              {/* Search Type Selector */}
              <div className="search-type-selector-wrapper">
                <Dropdown
                  value={searchType}
                  options={["Shipment ID", "Confirmation #", "Carrier"]}
                  onChange={(value) => setSearchType(value as "Shipment ID" | "Confirmation #" | "Carrier")}
                  icon="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z' stroke='%230a76db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"
                  chevronIcon="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11.4355 5.43457C11.7479 5.12215 12.2539 5.12215 12.5663 5.43457C12.8788 5.74699 12.8788 6.25301 12.5663 6.56543L8.56635 10.5654C8.25393 10.8779 7.74791 10.8779 7.43549 10.5654L3.43549 6.56543C3.12307 6.25301 3.12307 5.74699 3.43549 5.43457C3.74791 5.12215 4.25393 5.12215 4.56635 5.43457L8.00092 8.86914L11.4355 5.43457Z' fill='%230a76db'/%3E%3C/svg%3E"
                />
              </div>
              {/* Separator */}
              <div style={{ width: "1px", height: "100%", background: "var(--color-border-muted)", margin: "0 12px" }} />
              {/* Search Input */}
              <div style={{ display: "flex", flex: "1", minWidth: 0 }}>
                <input
                  type="text"
                  className="input input-field search-input-borderless"
                  placeholder={
                    searchType === "Shipment ID"
                      ? "Enter the last 5 digits of the shipment ID"
                      : searchType === "Confirmation #"
                      ? "Enter the last 5 digits of the confirmation number"
                      : "Enter the carrier name"
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: "12px", paddingRight: "12px", width: "100%" }}
                />
              </div>
              {/* Separator */}
              <div style={{ width: "1px", height: "100%", background: "var(--color-border-muted)", margin: "0 12px" }} />
              {/* Schedule Shipment Button */}
              <button
                className="ghost-button"
                onClick={onScheduleShipment}
                style={{ marginLeft: "auto" }}
              >
                <img className="plus" src={calendarIcon} alt="" aria-hidden="true" />
                SCHEDULE SHIPMENT
              </button>
            </div>
          </div>
          {/* Date Navigation and Table Scroll Container */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1, minHeight: 0 }}>
            {/* Date Navigation */}
            <div className="date-navigation-container" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <NextPrevButtons
                onPrevious={() => navigateDate("prev")}
                onNext={() => navigateDate("next")}
                disabledPrevious={dateRangeMode === "Time Range"}
                disabledNext={dateRangeMode === "Time Range"}
              />
              {dateRangeMode === "Time Range" ? (
                <DateDropdown
                  selectedDate={dateRange.start}
                  onDateChange={(date) => {
                    if (date) {
                      // Angular Material style: First click sets start, second click sets end
                      const currentStart = dateRange.start;
                      const currentEnd = dateRange.end;
                      
                      if (!currentStart) {
                        // No start date yet - set as start
                        setDateRange({ start: date, end: null });
                      } else if (!currentEnd) {
                        // Have start, no end - set as end
                        if (date < currentStart) {
                          // If clicking before start, swap them
                          setDateRange({ start: date, end: currentStart });
                          handleDateRangeChange(date, currentStart);
                        } else {
                          // Set as end date
                          setDateRange({ start: currentStart, end: date });
                          handleDateRangeChange(currentStart, date);
                        }
                      } else {
                        // Both dates exist - Angular Material behavior:
                        // If clicking before start, it becomes new start (end stays)
                        // If clicking between start and end, it becomes new end
                        // If clicking after end, start a new range (this becomes new start)
                        if (date < currentStart) {
                          // New start date, keep end
                          setDateRange({ start: date, end: currentEnd });
                          handleDateRangeChange(date, currentEnd);
                        } else if (date >= currentStart && date <= currentEnd) {
                          // Between start and end - becomes new end
                          setDateRange({ start: currentStart, end: date });
                          handleDateRangeChange(currentStart, date);
                        } else {
                          // After end - start new range
                          setDateRange({ start: date, end: null });
                        }
                      }
                    }
                  }}
                  dateRange={dateRange.start ? { 
                    start: dateRange.start, 
                    end: dateRange.end || dateRange.start 
                  } : undefined}
                />
              ) : (
                <DateDropdown
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                  dateRange={getDateRangeForDisplay() || undefined}
                />
              )}
              <DateRangeSelector
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                mode={dateRangeMode}
                onModeChange={handleModeChange}
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
              />
            </div>
            <div
              className="table"
              style={{
                flex: 1,
                minHeight: 0,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              } as React.CSSProperties}
            >
              <div className="table-scroll" style={{ flex: 1, minHeight: 0, minWidth: 0, background: "#FFFFFF", overflowX: "auto", overflowY: "auto" }}>
              <div className="table-header" style={{ display: "grid", gridTemplateColumns: "minmax(100px, 1fr) minmax(140px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(180px, 1fr) minmax(150px, 1fr) minmax(200px, 1fr) minmax(130px, 1fr)", minWidth: "1440px", width: "100%" }}>
                <span>Status</span>
                <span>Time Date</span>
                <span>Confirmation #</span>
                <span>Shipment ID</span>
                <span>Shipment Type</span>
                <span>Load Type</span>
                <span>Carrier Trailer</span>
                <span>Driver Phone</span>
                <span>Tags</span>
                <span className="table-actions-column" style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end", position: "sticky", right: 0, background: "linear-gradient(90deg, rgba(245, 245, 245, 0) 0%, rgba(245, 245, 245, 0) 5%, rgba(245, 245, 245, 0.3) 8%, rgba(245, 245, 245, 1) 15%)", zIndex: 20, padding: "8px 4px", boxSizing: "border-box" }}>
                  <img 
                    src={settingsIcon} 
                    alt="Settings" 
                    style={{ width: "36px", height: "24px", cursor: "pointer", paddingRight: "0px" }}
                  />
                </span>
              </div>
              {filteredShipments.map((shipment, index) => {
                // Determine row background based on alternating pattern
                // 1st, 3rd, 5th rows (index 0, 2, 4...) = Gray (#F5F5F5)
                // 2nd, 4th, 6th rows (index 1, 3, 5...) = white (#FFFFFF)
                const isEvenIndex = index % 2 === 0;
                const rowBackground = isEvenIndex ? "#F5F5F5" : "#FFFFFF";
                const isSelected = selectedShipmentId === shipment.id;
                return (
                <div
                  key={shipment.id}
                  className={`table-row ${isSelected ? "table-row-selected" : ""}`}
                  onClick={() => handleRowClick(shipment.id)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(100px, 1fr) minmax(140px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(180px, 1fr) minmax(150px, 1fr) minmax(200px, 1fr) minmax(130px, 1fr)",
                    minWidth: "1440px",
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  <span className={`table-status ${getStatusClass(shipment.status)}`}>
                    <span className="table-status-bar" />
                    {shipment.status}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", fontSize: "12px", color: "var(--color-text-default-primary)", textAlign: "left" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, lineHeight: "1.2", textAlign: "left" }}>{formatTimeForDisplay(shipment.time)}</span>
                    <span style={{ fontSize: "12px", fontWeight: 400, lineHeight: "1.2", color: "var(--color-text-default-secondary)", textAlign: "left" }}>{shipment.date}</span>
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text-default-primary)", textAlign: "left" }}>
                    {shipment.confirmationNumber}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", fontSize: "12px", color: "var(--color-text-default-primary)", textAlign: "left" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, lineHeight: "1.2", textAlign: "left" }}>{shipment.shipmentId}</span>
                    <span style={{ fontSize: "12px", fontWeight: 400, lineHeight: "1.2", color: "var(--color-text-default-secondary)", textAlign: "left" }}>+2 more</span>
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text-default-primary)", textAlign: "left" }}>
                    {(() => {
                      // Parse "Inbound Std / Live Load" to extract Shipment Type (Inbound/Outbound)
                      const parts = shipment.shipmentType.split(" / ");
                      const firstPart = parts[0]; // "Inbound Std"
                      const firstPartWords = firstPart.split(" ");
                      return firstPartWords[0]; // "Inbound" or "Outbound"
                    })()}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text-default-primary)", textAlign: "left" }}>
                    {(() => {
                      // Parse "Inbound Std / Live Load" to extract Load Type
                      const parts = shipment.shipmentType.split(" / ");
                      return parts[1] || ""; // "Live Load" or "Drop"
                    })()}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", fontSize: "12px", color: "var(--color-text-default-primary)", textAlign: "left" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, lineHeight: "1.2", textAlign: "left" }}>{shipment.carrier}</span>
                    {(shipment.status === "In Progress" || shipment.status === "Complete") && (
                      <span style={{ fontSize: "12px", fontWeight: 400, lineHeight: "1.2", color: "var(--color-text-default-secondary)", textAlign: "left" }}>{shipment.trailer}</span>
                    )}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", fontSize: "12px", color: "var(--color-text-default-primary)", textAlign: "left" }}>
                    {(shipment.status === "In Progress" || shipment.status === "Complete") ? (
                      <>
                        <span style={{ fontSize: "14px", fontWeight: 600, lineHeight: "1.2", textAlign: "left" }}>{shipment.driver}</span>
                        <span style={{ fontSize: "12px", fontWeight: 400, lineHeight: "1.2", color: "var(--color-text-default-secondary)", textAlign: "left" }}>{shipment.phone}</span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: "14px", fontWeight: 600, lineHeight: "1.2", textAlign: "left" }}>--</span>
                        <span style={{ fontSize: "12px", fontWeight: 400, lineHeight: "1.2", color: "var(--color-text-default-secondary)", textAlign: "left" }}>--</span>
                      </>
                    )}
                  </span>
                  <span style={{ display: "flex", flexDirection: "row", gap: "4px", flexWrap: "wrap", alignItems: "center" }}>
                    {shipment.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="details-tag"
                        style={{ 
                          fontSize: "12px",
                          padding: "4px 8px",
                          borderRadius: "9999px",
                          border: "1px solid var(--color-border-muted)",
                          background: "var(--color-bg-default-secondary)",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                  <span className="table-actions-column" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", position: "sticky", right: 0, background: isSelected ? "linear-gradient(90deg, rgba(227, 242, 253, 0) 0%, rgba(227, 242, 253, 0) 5%, rgba(227, 242, 253, 0.3) 8%, rgba(227, 242, 253, 1) 15%)" : isEvenIndex ? "linear-gradient(90deg, rgba(245, 245, 245, 0) 0%, rgba(245, 245, 245, 0) 5%, rgba(245, 245, 245, 0.3) 8%, rgba(245, 245, 245, 1) 15%)" : "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 5%, rgba(255, 255, 255, 0.3) 8%, rgba(255, 255, 255, 1) 15%)", zIndex: openActionsDropdownId === shipment.id ? 1001 : 5, padding: "8px 4px", boxSizing: "border-box" }}>
                    <div data-actions-dropdown style={{ position: "relative", zIndex: openActionsDropdownId === shipment.id ? 1001 : "auto", height: "100%", display: "flex", alignItems: "stretch" }}>
                      <button
                        className={`ghost-button ${openActionsDropdownId === shipment.id ? "active" : ""}`}
                        style={{ whiteSpace: "nowrap", height: "100%", alignSelf: "stretch", paddingLeft: "16px" }}
                        onClick={(e) => handleActionsClick(e, shipment.id)}
                        disabled={shipment.status === "Cancelled" || shipment.status === "Complete" || shipment.status === "In Progress"}
                      >
                        ACTIONS
                        <img 
                          src={chevronDown} 
                          alt="" 
                          width="16" 
                          height="16"
                          style={{ transform: openActionsDropdownId === shipment.id ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }}
                        />
                      </button>
                      {openActionsDropdownId === shipment.id && shipment.status !== "Cancelled" && shipment.status !== "Complete" && shipment.status !== "In Progress" && (
                        <div className="dropdown-menu" style={{ right: 0, left: "auto", minWidth: "200px", zIndex: 1002 }}>
                          <button
                            className="dropdown-option"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionItemClick("Reschedule", shipment.id);
                            }}
                          >
                            Reschedule
                          </button>
                          <button
                            className="dropdown-option"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionItemClick("Edit Appointment", shipment.id);
                            }}
                          >
                            Edit Appointment
                          </button>
                          <button
                            className="dropdown-option"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionItemClick("Cancel Appointment", shipment.id);
                            }}
                          >
                            Cancel Appointment
                          </button>
                        </div>
                      )}
                    </div>
                  </span>
                </div>
                );
              })}
              </div>
            </div>
          </div>
          </div>

          {/* Side Panel - Always in DOM to allow smooth grid transitions */}
          <aside className={`panel details-panel ${showSidePanel && !isPanelClosing && selectedShipment ? "opening" : "closing"}`} style={{ flexShrink: 0, width: "433px", minWidth: "433px", overflow: showSidePanel && !isPanelClosing && selectedShipment ? "visible" : "hidden", visibility: selectedShipment ? "visible" : "hidden" }}>
            {selectedShipment && (
              <>
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
                            {selectedShipment.confirmationNumber || "--"}
                          </span>
                        </div>
                        <div className="details-info-row">
                          <span className="details-info-label">Shipment ID:</span>
                          <span className="details-info-value">{selectedShipment.shipmentId || "--"}</span>
                        </div>
                        <div className="details-info-row">
                          <span className="details-info-label">Vendor:</span>
                          <span className="details-info-value">{selectedShipment.vendor || "--"}</span>
                        </div>
                        <div className="details-info-row">
                          <span className="details-info-label">Pallet/Case Qty:</span>
                          <span className="details-info-value">
                            {selectedShipment.pallets && selectedShipment.cases 
                              ? `${selectedShipment.pallets}/${selectedShipment.cases}`
                              : selectedShipment.pallets || selectedShipment.cases || "--"}
                          </span>
                        </div>
                      </div>

                      {/* Tags Section */}
                      {selectedShipment.tags && selectedShipment.tags.length > 0 && (
                        <div className="details-section">
                          <h3 className="details-section-title">Tags</h3>
                          <div className="details-tags">
                            {selectedShipment.tags.map((tag, index) => (
                              <span key={index} className="details-tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Shipment Type Indicator */}
                      <div className="details-section">
                        <div className="details-divider"></div>
                        <div className="details-shipment-type">
                          <img
                            className="details-icon-arrow"
                            src={(() => {
                              const parts = selectedShipment.shipmentType.split(" / ");
                              const firstPart = parts[0];
                              const firstPartWords = firstPart.split(" ");
                              const shipmentType = firstPartWords[0];
                              return shipmentType === "Outbound" ? directionalArrowOB : directionalArrowsIB;
                            })()}
                            alt=""
                            width="16"
                            height="16"
                          />
                          <span className="details-shipment-type-text">{selectedShipment.shipmentType}</span>
                          <img className="details-icon-truck" src={trailerIcon} alt="" width="24" height="24" />
                        </div>
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
                          <span className="details-info-value">{selectedShipment.creationDate}</span>
                        </div>
                        <div className="details-info-row">
                          <span className="details-info-label">Creation Method:</span>
                          <span className="details-info-value">{selectedShipment.creationMethod}</span>
                        </div>
                        <div className="details-info-row">
                          <span className="details-info-label">Time:</span>
                          <span className="details-info-value">
                            {selectedShipment.date} {formatTimeForDisplay(selectedShipment.time)}
                          </span>
                        </div>
                      </div>

                      {/* Shipment Details Section */}
                      {(selectedShipment.status === "In Progress" || selectedShipment.status === "Complete") && (
                        <div className="details-section">
                          <div className="details-divider"></div>
                          <h3 className="details-section-title">Shipment Details</h3>
                          <div className="details-info-row">
                            <span className="details-info-label">Scheduled Carrier:</span>
                            <span className="details-info-value">{selectedShipment.carrier || "--"}</span>
                          </div>
                          <div className="details-info-row">
                            <span className="details-info-label">Trailer #:</span>
                            <span className="details-info-value">{selectedShipment.trailer || "--"}</span>
                          </div>
                          {selectedShipment.driver && (
                            <div className="details-info-row">
                              <span className="details-info-label">Driver:</span>
                              <span className="details-info-value">{selectedShipment.driver}</span>
                            </div>
                          )}
                          {selectedShipment.phone && (
                            <div className="details-info-row">
                              <span className="details-info-label">Phone:</span>
                              <span className="details-info-value">{selectedShipment.phone}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                </div>
              </div>
              </>
            )}
          </aside>
        </div>

        {/* Footer */}
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
          <div className="footer-copyright">© 2026 Chamberlain Group. All Rights Reserved</div>
        </footer>
      </div>
    </PageLayout>
      {showConfirmationModal && confirmationData && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Appointment Confirmation</h2>
              <button 
                className="modal-close-button" 
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="confirmation-section">
                <h3 className="confirmation-heading">Thank you for scheduling your appointment at {confirmationData?.companyName}.</h3>
                <p>Your appointment has been scheduled.</p>
                <p><strong>Appointment confirmation #:</strong> {confirmationData?.confirmationNumber}</p>
                <p><strong>Appointment Time:</strong> {confirmationData?.appointmentTime}</p>
              </div>

              <div className="modal-divider"></div>

              <div className="important-info-section">
                <p><strong>Appointments are required for all deliveries to the {confirmationData?.fullLocation} facility.</strong></p>
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
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showCancelModal && shipmentToCancel && (
        <div className="modal-overlay" onClick={handleCloseCancelModal}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Cancel Appointment</h2>
              <button 
                className="modal-close-button" 
                onClick={handleCloseCancelModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="confirmation-section">
                <p>Are you sure you want to cancel this appointment?</p>
                <p><strong>Appointment Time:</strong> {shipmentToCancel.date} {formatTimeForDisplay(shipmentToCancel.time)}</p>
                <p><strong>Confirmation #:</strong> {shipmentToCancel.confirmationNumber}</p>
                <p><strong>Shipment ID:</strong> {shipmentToCancel.shipmentId}</p>
              </div>
            </div>
            <div className="modal-footer" style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button 
                className="secondary" 
                type="button"
                onClick={handleCloseCancelModal}
              >
                Cancel
              </button>
              <button 
                className="primary cancel-appointment-button" 
                type="button"
                onClick={handleConfirmCancel}
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
      {showWithin24HoursModal && shipmentToCancel && (
        <div className="modal-overlay" onClick={handleCloseWithin24HoursModal}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Cannot Cancel Appointment</h2>
              <button 
                className="modal-close-button" 
                onClick={handleCloseWithin24HoursModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="confirmation-section">
                <p>Appointments scheduled within 24 hours of the start time cannot be cancelled through this portal.</p>
                <p><strong>Appointment Time:</strong> {shipmentToCancel.date} {formatTimeForDisplay(shipmentToCancel.time)}</p>
                <p><strong>Confirmation #:</strong> {shipmentToCancel.confirmationNumber}</p>
                <p><strong>Shipment ID:</strong> {shipmentToCancel.shipmentId}</p>
              </div>

              <div className="modal-divider"></div>

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
                onClick={handleCloseWithin24HoursModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showCannotRescheduleModal && shipmentToReschedule && (
        <div className="modal-overlay" onClick={handleCloseCannotRescheduleModal}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Cannot Reschedule Appointment</h2>
              <button 
                className="modal-close-button" 
                onClick={handleCloseCannotRescheduleModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="confirmation-section">
                <p>Appointments scheduled within 24 hours of the start time cannot be rescheduled through this portal.</p>
                <p><strong>Appointment Time:</strong> {shipmentToReschedule.date} {formatTimeForDisplay(shipmentToReschedule.time)}</p>
                <p><strong>Confirmation #:</strong> {shipmentToReschedule.confirmationNumber}</p>
                <p><strong>Shipment ID:</strong> {shipmentToReschedule.shipmentId}</p>
              </div>

              <div className="modal-divider"></div>

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
                onClick={handleCloseCannotRescheduleModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showCannotEditModal && shipmentToEdit && (
        <div className="modal-overlay" onClick={handleCloseCannotEditModal}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Cannot Edit Appointment</h2>
              <button 
                className="modal-close-button" 
                onClick={handleCloseCannotEditModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="confirmation-section">
                <p>Appointments scheduled within 24 hours of the start time cannot be edited through this portal.</p>
                <p><strong>Appointment Time:</strong> {shipmentToEdit.date} {formatTimeForDisplay(shipmentToEdit.time)}</p>
                <p><strong>Confirmation #:</strong> {shipmentToEdit.confirmationNumber}</p>
                <p><strong>Shipment ID:</strong> {shipmentToEdit.shipmentId}</p>
              </div>

              <div className="modal-divider"></div>

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
                onClick={handleCloseCannotEditModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
