import { useState } from "react";
import SchedulePage from "./pages/SchedulePage";
import { SchedulePageNew } from "./pages/SchedulePageNew";
import { DriverPage } from "./pages/DriverPage";
import { TrailerPage } from "./pages/TrailerPage";

type Step = "shipment" | "schedule" | "driver" | "trailer";

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
  "Cheney Brothers - Statesville, NC",
  "Cheney Brothers - Miami, FL",
  "Cheney Brothers - Atlanta, GA",
  "Cheney Brothers - Dallas, TX",
  "Cheney Brothers - Chicago, IL",
  "Cheney Brothers - Los Angeles, CA",
  "Cheney Brothers - Phoenix, AZ",
  "Cheney Brothers - Denver, CO",
];

const App = () => {
  const [currentStep, setCurrentStep] = useState<Step>("shipment");
  const [selectedSite, setSelectedSite] = useState(siteOptions[0]);
  const [shipmentType, setShipmentType] = useState<"Inbound" | "Outbound">("Inbound");
  const [loadType, setLoadType] = useState("Live");
  const [productType, setProductType] = useState<"Standard" | "Non Standard">("Standard");
  const [questionAnswers, setQuestionAnswers] = useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
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

  const handleStepClick = (step: Step) => {
    setCurrentStep(step);
  };

  const handleSiteChange = (site: string) => {
    setSelectedSite(site);
  };

  switch (currentStep) {
    case "shipment":
      return (
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
        />
      );
    case "schedule":
      return (
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
          onSelectedDateChange={setSelectedDate}
          onSelectedTimeChange={setSelectedTime}
          driverName={driverName}
          mobileNumber={mobileNumber}
          selectedCarrier={selectedCarrier}
          trailerNumber={trailerNumber}
        />
      );
    case "driver":
      return (
        <DriverPage
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
          driverName={driverName}
          mobileNumber={mobileNumber}
          onDriverNameChange={setDriverName}
          onMobileNumberChange={setMobileNumber}
          selectedCarrier={selectedCarrier}
          trailerNumber={trailerNumber}
        />
      );
    case "trailer":
      return (
        <TrailerPage
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
          driverName={driverName}
          mobileNumber={mobileNumber}
          selectedCarrier={selectedCarrier}
          trailerNumber={trailerNumber}
          onSelectedCarrierChange={setSelectedCarrier}
          onTrailerNumberChange={setTrailerNumber}
        />
      );
    default:
      return <SchedulePage />;
  }
};

export default App;
