import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import "../styles/schedule.css";
import brandLogo from "../assets/myQ.svg";
import userIcon from "../assets/user.svg";
import plusIcon from "../assets/plus.svg";
import deleteIcon from "../assets/delete.svg";
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
  "Cheney Brothers - Statesville, NC",
  "Cheney Brothers - Miami, FL",
  "Cheney Brothers - Atlanta, GA",
  "Cheney Brothers - Dallas, TX",
  "Cheney Brothers - Chicago, IL",
  "Cheney Brothers - Los Angeles, CA",
  "Cheney Brothers - Phoenix, AZ",
  "Cheney Brothers - Denver, CO",
];

const durationOptions = ["30 minutes", "1 hour", "2 hours", "3 hours"];
const questionOptions = ["Answer 1", "Answer 2", "Answer 3", "Answer 4"];

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
  onStepClick?: (step: "shipment" | "schedule" | "driver" | "trailer") => void;
  shipmentType?: "Inbound" | "Outbound";
  onShipmentTypeChange?: (type: "Inbound" | "Outbound") => void;
  loadType?: string;
  onLoadTypeChange?: (type: string) => void;
  productType?: "Standard" | "Non Standard";
  onProductTypeChange?: (type: "Standard" | "Non Standard") => void;
  questionAnswers?: {
    question1: string;
    question2: string;
    question3: string;
    question4: string;
    question5: string;
  };
  onQuestionAnswersChange?: (answers: {
    question1: string;
    question2: string;
    question3: string;
    question4: string;
    question5: string;
  }) => void;
  shipments?: Shipment[];
  onShipmentsChange?: (shipments: Shipment[]) => void;
  duration?: string;
  onDurationChange?: (duration: string) => void;
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

  const [question1, setQuestion1] = useState(propQuestionAnswers?.question1 || "");
  const [question2, setQuestion2] = useState(propQuestionAnswers?.question2 || "");
  const [question3, setQuestion3] = useState(propQuestionAnswers?.question3 || "");
  const [question4, setQuestion4] = useState(propQuestionAnswers?.question4 || "");
  const [question5, setQuestion5] = useState(propQuestionAnswers?.question5 || "");

  // Sync local state with props when they change
  useEffect(() => {
    if (propQuestionAnswers) {
      setQuestion1(propQuestionAnswers.question1);
      setQuestion2(propQuestionAnswers.question2);
      setQuestion3(propQuestionAnswers.question3);
      setQuestion4(propQuestionAnswers.question4);
      setQuestion5(propQuestionAnswers.question5);
    }
  }, [propQuestionAnswers]);

  // Notify parent when question answers change
  useEffect(() => {
    if (onQuestionAnswersChange) {
      onQuestionAnswersChange({
        question1,
        question2,
        question3,
        question4,
        question5,
      });
    }
  }, [question1, question2, question3, question4, question5, onQuestionAnswersChange]);

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
    const hasAllQuestions = question1 && question2 && question3 && question4 && question5;
    return !hasAllShipmentIds || !hasAllQuestions;
  }, [shipments, question1, question2, question3, question4, question5]);

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
        <div
          className={`step ${onStepClick ? "clickable" : ""}`}
          onClick={() => onStepClick?.("driver")}
          role={onStepClick ? "button" : undefined}
          tabIndex={onStepClick ? 0 : undefined}
          onKeyDown={(e) => {
            if (onStepClick && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              onStepClick("driver");
            }
          }}
          aria-label={onStepClick ? "Go to Driver step" : undefined}
        >
          <span className="step-dot" />
          <span className="step-label">Driver</span>
        </div>
        <div
          className={`step ${onStepClick ? "clickable" : ""}`}
          onClick={() => onStepClick?.("trailer")}
          role={onStepClick ? "button" : undefined}
          tabIndex={onStepClick ? 0 : undefined}
          onKeyDown={(e) => {
            if (onStepClick && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              onStepClick("trailer");
            }
          }}
          aria-label={onStepClick ? "Go to Trailer step" : undefined}
        >
          <span className="step-dot" />
          <span className="step-label">Trailer</span>
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
                  <label className="field-label" htmlFor="duration">
                    Duration
                  </label>
                  <Dropdown value={duration} options={durationOptions} onChange={setDuration} />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="question-1">
                    Question 1
                  </label>
                  <Dropdown value={question1} options={questionOptions} placeholder="Select answer from list" onChange={setQuestion1} />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="question-2">
                    Question 2
                  </label>
                  <Dropdown value={question2} options={questionOptions} placeholder="Select answer from list" onChange={setQuestion2} />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="question-3">
                    Question 3
                  </label>
                  <Dropdown value={question3} options={questionOptions} placeholder="Select answer from list" onChange={setQuestion3} />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="question-4">
                    Question 4
                  </label>
                  <Dropdown value={question4} options={questionOptions} placeholder="Select answer from list" onChange={setQuestion4} />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="question-5">
                    Question 5
                  </label>
                  <Dropdown value={question5} options={questionOptions} placeholder="Select answer from list" onChange={setQuestion5} />
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
        </div>
        <div className="footer-copyright">
          © 2026 Chamberlain Group. All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default SchedulePage;
