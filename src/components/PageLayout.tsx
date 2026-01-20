import brandLogo from "../assets/myQ.svg";
import userIcon from "../assets/user.svg";
import facilityIcon from "../assets/facility.svg";
import { Dropdown } from "./Dropdown";

type Step = "shipment" | "schedule" | "driver" | "trailer";

type PageLayoutProps = {
  activeStep: Step;
  onStepClick: (step: Step) => void;
  selectedSite: string;
  onSiteChange: (site: string) => void;
  siteOptions: string[];
  children: React.ReactNode;
};

export const PageLayout = ({
  activeStep,
  onStepClick,
  selectedSite,
  onSiteChange,
  siteOptions,
  children,
}: PageLayoutProps) => {
  const steps: { key: Step; label: string }[] = [
    { key: "shipment", label: "Shipment" },
    { key: "schedule", label: "Schedule" },
    { key: "driver", label: "Driver" },
    { key: "trailer", label: "Trailer" },
  ];

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand">
          <img className="brand-logo" src={brandLogo} alt="myQ" />
          <span className="brand-divider" />
          <span className="brand-title">Enterprise Scheduling Portal</span>
        </div>
        <div className="site-selector">
          <Dropdown value={selectedSite} options={siteOptions} onChange={onSiteChange} icon={facilityIcon} />
        </div>
        <div className="user">
          <span>Randy Tyner</span>
          <img className="avatar" src={userIcon} alt="User" />
        </div>
      </header>

      <section className="stepper">
        {steps.map((step) => (
          <div
            key={step.key}
            className={`step ${activeStep === step.key ? "active" : ""} ${activeStep !== step.key ? "clickable" : ""}`}
            onClick={() => activeStep !== step.key && onStepClick(step.key)}
            role="button"
            tabIndex={activeStep !== step.key ? 0 : -1}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && activeStep !== step.key) {
                e.preventDefault();
                onStepClick(step.key);
              }
            }}
            aria-label={`Go to ${step.label} step`}
          >
            <span className="step-dot" />
            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </section>

      {children}
    </div>
  );
};
