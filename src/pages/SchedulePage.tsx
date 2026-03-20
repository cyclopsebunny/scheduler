import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import "../styles/schedule.css";
import brandLogo from "../assets/myQ.svg";
import userIcon from "../assets/user.svg";
import plusIcon from "../assets/plus.svg";
// Delete icon as data URI for reliable CSS mask support
const deleteIcon = "data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M7.26172%2020.2236H16.9033L17.8584%208.83594H19.8643L18.8193%2021.3066C18.7763%2021.8256%2018.3432%2022.2236%2017.8232%2022.2236H6.3418C5.8218%2022.2236%205.3887%2021.8256%205.3457%2021.3066L4.30078%208.83594H6.30664L7.26172%2020.2236ZM11.084%2018.0645C11.109%2018.6165%2010.6828%2019.0853%2010.1318%2019.1113C10.116%2019.1123%2010.0989%2019.1123%2010.084%2019.1123C9.55416%2019.1122%209.11105%2018.695%209.08594%2018.1592L8.64941%208.83594H10.6514L11.084%2018.0645ZM15.0801%2018.1592C15.055%2018.695%2014.6119%2019.1122%2014.082%2019.1123C14.0661%2019.1123%2014.0501%2019.1123%2014.0342%2019.1113C13.4822%2019.0853%2013.057%2018.6165%2013.082%2018.0645L13.5146%208.83594H15.5176L15.0801%2018.1592ZM15.5273%201.77637C15.7362%201.77649%2015.9052%201.9454%2015.9053%202.1543V2.66309H20.1973C20.4792%202.66313%2020.7485%202.78225%2020.9375%202.99121C21.1274%203.1992%2021.2204%203.47881%2021.1924%203.75977L20.9531%206.24316C20.9041%206.75616%2020.473%207.14746%2019.958%207.14746H4.04199C3.52605%207.1474%203.09587%206.75612%203.04688%206.24316L2.80664%203.75977C2.77964%203.47877%202.8735%203.19921%203.0625%202.99121C3.2524%202.78248%203.52%202.66319%203.80273%202.66309H8.09473V2.1543C8.09476%201.94548%208.26389%201.77661%208.47266%201.77637H15.5273ZM4.90332%204.66309L4.9502%205.14746H19.0498L19.0967%204.66309H4.90332Z%22%20fill%3D%22currentColor%22%2F%3E%0A%3C%2Fsvg%3E";
import chevronDown from "../assets/chevron-down.svg";
import facilityIcon from "../assets/facility.svg";
import starSelected from "../assets/star-selected.svg";
import starUnselected from "../assets/star-unselected.svg";
import { Dropdown } from "../components/Dropdown";
import checkCircleIcon from "../assets/check-circle.svg";

// Hidden shipments database
const hiddenShipments: Record<string, { idType: string; vendor: string; pallets: string; cases: string }> = {
  "10001": { idType: "Shipment ID", vendor: "Nestle", pallets: "24", cases: "480" },
  "10002": { idType: "BOL Number", vendor: "Kraft Heinz", pallets: "18", cases: "360" },
  "10003": { idType: "Pro Number", vendor: "General Mills", pallets: "32", cases: "640" },
  "10004": { idType: "PO Number", vendor: "PepsiCo", pallets: "20", cases: "400" },
  "10005": { idType: "Unique ID", vendor: "Coca-Cola Company", pallets: "28", cases: "560" },
  "10006": { idType: "Appointment ID", vendor: "Unilever", pallets: "22", cases: "440" }
};

const shipmentsSeed = Array.from({ length: 1 }, (_, index) => ({
  rowId: `row-${index + 1}`,
  id: "",
  idType: "Shipment ID",
  vendor: "",
  pallets: "",
  cases: "",
  stop: "1",
  isPrimary: index === 0
}));

const idTypeOptions = [
  "Shipment ID",
  "Unique ID",
  "BOL Number",
  "Pro Number",
  "PO Number",
  "Appointment ID",
];
const vendorOptions = [
  "3M",
  "Abbott Laboratories",
  "Ahold Delhaize",
  "Albertsons Companies",
  "Aldi",
  "Amazon",
  "Anheuser-Busch",
  "Apple",
  "Archer Daniels Midland",
  "Bayer",
  "Best Buy",
  "Boeing",
  "Campbell Soup Company",
  "Cargill",
  "Chipotle Mexican Grill",
  "Coca-Cola Company",
  "Colgate-Palmolive",
  "Conagra Brands",
  "Costco Wholesale",
  "Danone",
  "Darden Restaurants",
  "Dell Technologies",
  "Dole Food Company",
  "Driscoll's",
  "E. & J. Gallo Winery",
  "Eli Lilly and Company",
  "FedEx",
  "Ferrero",
  "Frito-Lay",
  "General Mills",
  "General Motors",
  "Goya Foods",
  "H. J. Heinz Company",
  "Hershey Company",
  "Home Depot",
  "Hormel Foods",
  "IBM",
  "Intel Corporation",
  "J.M. Smucker Company",
  "Johnson & Johnson",
  "Kellogg Company",
  "Keurig Dr Pepper",
  "Kimberly-Clark",
  "Kraft Heinz",
  "Kroger",
  "Land O'Lakes",
  "Lowe's Companies",
  "Mars, Incorporated",
  "McCormick & Company",
  "McDonald's Corporation",
  "Merck & Co.",
  "Mondelez International",
  "Nestle",
  "Nike",
  "Ocean Spray",
  "Panera Bread",
  "PepsiCo",
  "Pfizer",
  "Philip Morris International",
  "Procter & Gamble",
  "Publix Super Markets",
  "Quaker Oats Company",
  "Red Bull",
  "Safeway",
  "Sara Lee Corporation",
  "Schweppes",
  "Smithfield Foods",
  "Starbucks Corporation",
  "Sysco Corporation",
  "Target Corporation",
  "Tillamook",
  "Trader Joe's",
  "Tyson Foods",
  "Unilever",
  "United Parcel Service",
  "Walgreens Boots Alliance",
  "Walmart",
  "Walt Disney Company",
  "Wegmans Food Markets",
  "Whole Foods Market",
  "Yum! Brands"
];
const stopOptions = ["1", "2", "3", "4"];

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

const durationOptions = ["30 minutes", "1 hour", "2 hours", "3 hours"];
const freightServiceTypeOptions = ["LTL (Less-Than-Truckload)", "FTL (Full Truckload)"];
const storageConsiderationOptions = ["Dry", "Cooler", "Freezer"];

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

const useHorizontalScrollState = (ref: RefObject<HTMLElement>) => {
  const [state, setState] = useState({
    hasOverflow: false,
    atStart: true,
    atEnd: true,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const updateScrollState = () => {
      const hasOverflow = element.scrollWidth > element.clientWidth + 1;
      const atStart = element.scrollLeft <= 1;
      const atEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 1;
      setState({ hasOverflow, atStart, atEnd });
    };

    updateScrollState();

    const handleScroll = () => updateScrollState();
    element.addEventListener("scroll", handleScroll);

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(element);
    if (element.firstElementChild) {
      resizeObserver.observe(element.firstElementChild);
    }

    const mutationObserver = new MutationObserver(updateScrollState);
    mutationObserver.observe(element, { childList: true, subtree: true, characterData: true });

    return () => {
      element.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [ref]);

  return state;
};

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

type SchedulePageProps = {
  onStepClick?: (step: "shipment" | "schedule") => void;
  shipmentType?: "Inbound" | "Outbound";
  onShipmentTypeChange?: (type: "Inbound" | "Outbound") => void;
  loadType?: string;
  onLoadTypeChange?: (type: string) => void;
  productType?: "Standard" | "Non Standard";
  onProductTypeChange?: (type: "Standard" | "Non Standard") => void;
  questionAnswers?: {
    question1: string;
    question2: string;
  };
  onQuestionAnswersChange?: (answers: {
    question1: string;
    question2: string;
  }) => void;
  shipments?: Shipment[];
  onShipmentsChange?: (shipments: Shipment[]) => void;
  duration?: string;
  onDurationChange?: (duration: string) => void;
  selectedCarrier?: string;
  onSelectedCarrierChange?: (carrier: string) => void;
  onCancel?: () => void;
  onTermsClick?: () => void;
};

const SchedulePage = (props: SchedulePageProps = {}) => {
  const {
    onStepClick,
    shipmentType: propShipmentType,
    onShipmentTypeChange,
    loadType: propLoadType,
    onLoadTypeChange,
    productType: propProductType,
    onProductTypeChange,
    questionAnswers: propQuestionAnswers,
    onQuestionAnswersChange,
    shipments: propShipments,
    onShipmentsChange,
    duration: propDuration,
    onDurationChange,
    selectedCarrier: propSelectedCarrier,
    onSelectedCarrierChange,
    onCancel,
  } = props;
  const [shipments, setShipments] = useState(
    propShipments && propShipments.length > 0 ? propShipments : shipmentsSeed
  );
  const nextRowIdRef = useRef(shipmentsSeed.length + 1);
  const [selectedSite, setSelectedSite] = useState(siteOptions[0]);
  const [shipmentType, setShipmentType] = useState<"Inbound" | "Outbound">(propShipmentType || "Inbound");
  const [loadType, setLoadType] = useState(propLoadType || "Live");
  const [productType, setProductType] = useState<"Standard" | "Non Standard">(propProductType || "Standard");
  const [duration, setDuration] = useState(propDuration || "1 hour");
  const [selectedCarrier, setSelectedCarrier] = useState(propSelectedCarrier || "");

  // Sync local state with props when they change
  useEffect(() => {
    if (propShipmentType !== undefined) {
      setShipmentType(propShipmentType);
    }
  }, [propShipmentType]);

  useEffect(() => {
    if (propLoadType !== undefined) {
      setLoadType(propLoadType);
    }
  }, [propLoadType]);

  useEffect(() => {
    if (propProductType !== undefined) {
      setProductType(propProductType);
    }
  }, [propProductType]);

  useEffect(() => {
    if (propDuration !== undefined) {
      setDuration(propDuration);
    }
  }, [propDuration]);

  useEffect(() => {
    if (onDurationChange) {
      onDurationChange(duration);
    }
  }, [duration, onDurationChange]);

  useEffect(() => {
    if (propSelectedCarrier !== undefined) {
      setSelectedCarrier(propSelectedCarrier);
    }
  }, [propSelectedCarrier]);

  useEffect(() => {
    if (onSelectedCarrierChange) {
      onSelectedCarrierChange(selectedCarrier);
    }
  }, [selectedCarrier, onSelectedCarrierChange]);

  const [question1, setQuestion1] = useState(propQuestionAnswers?.question1 || "");
  const [question2, setQuestion2] = useState(propQuestionAnswers?.question2 || "");

  // Sync local state with props when they change
  useEffect(() => {
    if (propQuestionAnswers) {
      setQuestion1(propQuestionAnswers.question1);
      setQuestion2(propQuestionAnswers.question2);
    }
  }, [propQuestionAnswers]);

  // Notify parent when question answers change
  useEffect(() => {
    if (onQuestionAnswersChange) {
      onQuestionAnswersChange({
        question1,
        question2,
      });
    }
  }, [question1, question2, onQuestionAnswersChange]);

  // Sync local state with props when they change
  useEffect(() => {
    if (propShipments && propShipments.length > 0) {
      setShipments(propShipments);
    }
  }, [propShipments]);

  // Notify parent when shipments change
  useEffect(() => {
    if (onShipmentsChange) {
      onShipmentsChange(shipments);
    }
  }, [shipments, onShipmentsChange]);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const detailsScrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const resizeStateRef = useRef({ startX: 0, startWidth: 433 });
  const [detailsWidth, setDetailsWidth] = useState(433);
  const [isResizing, setIsResizing] = useState(false);
  const hasTableOverflow = useOverflowState(tableScrollRef);
  const hasDetailsOverflow = useOverflowState(detailsScrollRef);
  const tableScrollX = useHorizontalScrollState(tableScrollRef);
  const loadTypeOptions = useMemo(
    () => (shipmentType === "Outbound" ? ["Live", "Pre-load", "Pickup"] : ["Live", "Drop"]),
    [shipmentType]
  );

  const isNextButtonDisabled = useMemo(() => {
    const hasAllShipmentIds = shipments.length > 0 && shipments.every((shipment) => shipment.id && shipment.id.trim() !== "");
    const hasAllQuestions = question1 && question2;
    return !hasAllShipmentIds || !hasAllQuestions;
  }, [shipments, question1, question2]);

  const isAddShipmentDisabled = useMemo(() => {
    const hasEmptyShipmentId = shipments.some((shipment) => !shipment.id || shipment.id.trim() === "");
    return hasEmptyShipmentId || shipments.length >= 20;
  }, [shipments]);

  useEffect(() => {
    if (!loadTypeOptions.includes(loadType)) {
      setLoadType("Live");
      onLoadTypeChange?.("Live");
    }
  }, [loadTypeOptions, loadType, onLoadTypeChange]);

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

  const handleAddShipment = useCallback(() => {
    if (shipments.length >= 20) {
      return;
    }
    const nextRowId = `row-${nextRowIdRef.current}`;
    nextRowIdRef.current += 1;
    setShipments((current) => [
      ...current,
      {
        rowId: nextRowId,
        id: "",
        idType: idTypeOptions[0],
        vendor: "",
        pallets: "",
        cases: "",
        stop: stopOptions[0],
        isPrimary: false
      }
    ]);
  }, [shipments.length]);

  // Global keyboard shortcut: Ctrl/Cmd + Enter to add shipment
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Enter (Windows/Linux) or Cmd+Enter (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        // Don't trigger if disabled
        if (isAddShipmentDisabled) {
          return;
        }
        event.preventDefault();
        handleAddShipment();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAddShipmentDisabled, handleAddShipment]);

  const handleRemoveShipment = (rowId: string) => {
    if (shipments.length <= 1) {
      return;
    }
    setShipments((current) => {
      const removedItem = current.find((entry) => entry.rowId === rowId);
      const filtered = current.filter((entry) => entry.rowId !== rowId);
      
      // If the removed item was primary, make the first remaining item primary
      if (removedItem?.isPrimary && filtered.length > 0) {
        filtered[0].isPrimary = true;
      }
      
      return filtered;
    });
  };

  const handleSetPrimary = (rowId: string) => {
    setShipments((current) =>
      current.map((entry) => ({
        ...entry,
        isPrimary: entry.rowId === rowId
      }))
    );
  };

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand">
          <img className="brand-logo" src={brandLogo} alt="myQ" />
          <span className="brand-divider" />
          <span className="brand-title">Enterprise Scheduling Portal</span>
        </div>
        <div className="site-selector">
          <Dropdown value={selectedSite} options={siteOptions} onChange={setSelectedSite} icon={facilityIcon} />
        </div>
        <div className="user">
          <span>Randy Tyner</span>
          <img className="avatar" src={userIcon} alt="User" />
        </div>
      </header>

      <section className="stepper">
        <div className="step active">
          <span className="step-dot" />
          <span className="step-label">Shipment</span>
        </div>
        <div
          className={`step ${onStepClick ? "clickable" : ""}`}
          onClick={() => onStepClick?.("schedule")}
          role={onStepClick ? "button" : undefined}
          tabIndex={onStepClick ? 0 : undefined}
          onKeyDown={(e) => {
            if (onStepClick && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              onStepClick("schedule");
            }
          }}
          aria-label={onStepClick ? "Go to Schedule step" : undefined}
        >
          <span className="step-dot" />
          <span className="step-label">Schedule</span>
        </div>
      </section>

      <main className={`content ${isResizing ? "resizing" : ""}`} ref={contentRef}>
        <section className="panel shipments-panel">
          <div className="panel-header">
            <div className="panel-title-bar">
              <h2>Shipments</h2>
            </div>
            <button
              className="ghost-button"
              type="button"
              onClick={handleAddShipment}
              disabled={isAddShipmentDisabled}
            >
              <img className="plus" src={plusIcon} alt="" aria-hidden="true" />
              Add Shipment
            </button>
          </div>

          <div
            className={`table ${hasTableOverflow ? "has-overflow" : ""} ${
              tableScrollX.hasOverflow ? "has-overflow-x" : ""
            } ${tableScrollX.atStart ? "at-start" : ""} ${
              tableScrollX.atEnd ? "at-end" : ""
            }`}
          >
            <span className="table-gradient table-gradient-left" aria-hidden="true" />
            <span className="table-gradient table-gradient-right" aria-hidden="true" />
            <span className="table-gradient table-gradient-bottom" aria-hidden="true" />
            <div className="table-scroll" ref={tableScrollRef}>
              <div className="table-header">
                <span />
                <span>Shipment ID</span>
                <span>ID Type</span>
                <span>Vendor</span>
                <span>Pallets</span>
                <span>Cases</span>
                <span>Stop</span>
                <span />
              </div>

              {shipments.map((shipment, index) => (
                <div className="table-row" key={shipment.rowId}>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label={shipment.isPrimary ? "Primary shipment ID" : "Set as primary shipment ID"}
                    onClick={() => handleSetPrimary(shipment.rowId)}
                  >
                    <img
                      src={shipment.isPrimary ? starSelected : starUnselected}
                      alt=""
                      aria-hidden="true"
                      style={{ width: "24px", height: "24px", display: "block" }}
                    />
                  </button>
                  <div style={{ position: "relative", width: "100%" }}>
                    <input
                      className={`input input-field ${!shipment.id ? "placeholder" : ""}`}
                      type="text"
                      value={shipment.id}
                      placeholder="Add Shipment ID"
                      style={{
                        paddingRight: shipment.id.trim() in hiddenShipments ? "36px" : undefined,
                        width: "100%",
                        borderTopRightRadius: "0",
                        borderBottomRightRadius: "0",
                        borderRight: "none",
                      }}
                      onChange={(event) =>
                        setShipments((current) =>
                          current.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, id: event.target.value } : entry
                          )
                        )
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          const shipmentId = shipment.id.trim();
                          if (hiddenShipments[shipmentId]) {
                            const hiddenData = hiddenShipments[shipmentId];
                            setShipments((current) =>
                              current.map((entry, entryIndex) =>
                                entryIndex === index
                                  ? {
                                      ...entry,
                                      id: shipmentId,
                                      idType: hiddenData.idType,
                                      vendor: hiddenData.vendor,
                                      pallets: hiddenData.pallets,
                                      cases: hiddenData.cases,
                                    }
                                  : entry
                              )
                            );
                          }
                        }
                      }}
                    />
                    {shipment.id.trim() in hiddenShipments && (
                      <img
                        src={checkCircleIcon}
                        alt="Found existing shipment"
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "16px",
                          height: "16px",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </div>
                  <Dropdown
                    value={shipment.idType}
                    options={idTypeOptions}
                    onChange={(value) =>
                      setShipments((current) =>
                        current.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, idType: value } : entry
                        )
                      )
                    }
                  />
                  <Dropdown
                    value={shipment.vendor}
                    options={vendorOptions}
                    placeholder="Select a vendor"
                    typeAhead={true}
                    onChange={(value) =>
                      setShipments((current) =>
                        current.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, vendor: value } : entry
                        )
                      )
                    }
                  />
                  <input
                    className={`input input-field ${!shipment.pallets ? "placeholder" : ""}`}
                    type="text"
                    inputMode="numeric"
                    value={shipment.pallets || "--"}
                    style={{ borderRadius: "0" }}
                    onChange={(event) => {
                      let nextValue = event.target.value;
                      if (nextValue === "--") {
                        nextValue = "";
                      } else {
                        nextValue = nextValue.replace(/\D/g, "");
                      }
                      setShipments((current) =>
                        current.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, pallets: nextValue } : entry
                        )
                      );
                    }}
                    onFocus={(event) => {
                      if (event.target.value === "--") {
                        setShipments((current) =>
                          current.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, pallets: "" } : entry
                          )
                        );
                      }
                    }}
                  />
                  <input
                    className={`input input-field ${!shipment.cases ? "placeholder" : ""}`}
                    type="text"
                    inputMode="numeric"
                    value={shipment.cases || "--"}
                    onChange={(event) => {
                      let nextValue = event.target.value;
                      if (nextValue === "--") {
                        nextValue = "";
                      } else {
                        nextValue = nextValue.replace(/\D/g, "");
                      }
                      setShipments((current) =>
                        current.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, cases: nextValue } : entry
                        )
                      );
                    }}
                    onFocus={(event) => {
                      if (event.target.value === "--") {
                        setShipments((current) =>
                          current.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, cases: "" } : entry
                          )
                        );
                      }
                    }}
                    onKeyDown={(event) => {
                      // Enter key on last input of last row adds a new row
                      if (
                        event.key === "Enter" &&
                        index === shipments.length - 1 &&
                        !isAddShipmentDisabled
                      ) {
                        event.preventDefault();
                        handleAddShipment();
                      }
                    }}
                  />
                  <Dropdown
                    value={shipment.stop}
                    options={stopOptions}
                    onChange={(value) =>
                      setShipments((current) => {
                        const updated = current.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, stop: value } : entry
                        );
                        // Sort by stop value numerically (lowest to highest)
                        return updated.sort((a, b) => {
                          const stopA = parseInt(a.stop, 10) || 0;
                          const stopB = parseInt(b.stop, 10) || 0;
                          return stopA - stopB;
                        });
                      })
                    }
                  />
                  <button
                    className="icon-button danger"
                    type="button"
                    aria-label="Remove shipment"
                    onClick={() => handleRemoveShipment(shipment.rowId)}
                    disabled={shipments.length <= 1}
                  >
                    <span
                      className="trash-icon"
                      aria-hidden="true"
                      style={{
                        WebkitMaskImage: `url(${deleteIcon})`,
                        maskImage: `url(${deleteIcon})`,
                      }}
                    />
                  </button>
                </div>
              ))}
              {shipments.length > 0 && (
                <div style={{ 
                  padding: "16px", 
                  textAlign: "center", 
                  background: "#F5F5F5"
                }}>
                  <span
                    onClick={props.onTermsClick}
                    style={{
                      color: "var(--color-text-brand-primary)",
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontSize: "14px",
                      fontWeight: 400
                    }}
                  >
                    Appointment Guidelines
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        <div
          className={`panel-resize-handle ${isResizing ? "is-active" : ""}`}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panels"
          onPointerDown={(event) => {
            resizeStateRef.current = { startX: event.clientX, startWidth: detailsWidth };
            setIsResizing(true);
          }}
        />

        <aside className="panel details-panel" style={{ width: detailsWidth }}>
          <div className="panel-title-bar">
            <h2>Shipment Details</h2>
          </div>
          <div className={`details-body ${hasDetailsOverflow ? "has-overflow" : ""}`}>
            <div className="details-scroll" ref={detailsScrollRef}>
              <div className="details-scroll-content">
                <div className="field-group">
                  <span className="field-label">Shipment Type</span>
                  <div className="chip-row">
                    <label className="radio">
                      <input
                        type="radio"
                        name="shipment-type"
                        value="Inbound"
                        checked={shipmentType === "Inbound"}
                        onChange={() => {
                          setShipmentType("Inbound");
                          onShipmentTypeChange?.("Inbound");
                        }}
                      />
                      <span>Inbound</span>
                    </label>
                    <label className="radio">
                      <input
                        type="radio"
                        name="shipment-type"
                        value="Outbound"
                        checked={shipmentType === "Outbound"}
                        onChange={() => {
                          setShipmentType("Outbound");
                          onShipmentTypeChange?.("Outbound");
                        }}
                      />
                      <span>Outbound</span>
                    </label>
                  </div>
                </div>

                <div className="field-group">
                  <span className="field-label">Load Type</span>
                  <div className="chip-row">
                    {loadTypeOptions.map((option) => (
                      <label className="radio" key={option}>
                        <input
                          type="radio"
                          name="load-type"
                          value={option}
                          checked={loadType === option}
                          onChange={() => {
                            setLoadType(option);
                            onLoadTypeChange?.(option);
                          }}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="field-group">
                  <span className="field-label">Product Type</span>
                  <div className="chip-row">
                    <label className="radio">
                      <input
                        type="radio"
                        name="product-type"
                        value="Standard"
                        checked={productType === "Standard"}
                        onChange={() => {
                          setProductType("Standard");
                          onProductTypeChange?.("Standard");
                        }}
                      />
                      <span>Standard</span>
                    </label>
                    <label className="radio">
                      <input
                        type="radio"
                        name="product-type"
                        value="Non Standard"
                        checked={productType === "Non Standard"}
                        onChange={() => {
                          setProductType("Non Standard");
                          onProductTypeChange?.("Non Standard");
                        }}
                      />
                      <span>Non Standard</span>
                    </label>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="carrier">
                    Carrier
                  </label>
                  <Dropdown 
                    value={selectedCarrier} 
                    options={carrierOptions} 
                    onChange={setSelectedCarrier}
                    placeholder="Select a carrier from the list"
                    typeAhead={true}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="question-1">
                    What is the freight service type?
                  </label>
                  <Dropdown value={question1} options={freightServiceTypeOptions} placeholder="Select answer from list" onChange={setQuestion1} />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="question-2">
                    What are the storage considerations?
                  </label>
                  <Dropdown value={question2} options={storageConsiderationOptions} placeholder="Select answer from list" onChange={setQuestion2} />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <div className="action-bar">
        <div className="footer-actions">
          <button className="secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="primary" 
            type="button" 
            disabled={isNextButtonDisabled}
            onClick={() => {
              if (!isNextButtonDisabled && onStepClick) {
                onStepClick("schedule");
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
            onClick={props.onTermsClick}
          >
            Terms and Conditions
          </span>
        </div>
        <div className="footer-copyright">
          © 2026 Chamberlain Group. All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default SchedulePage;
