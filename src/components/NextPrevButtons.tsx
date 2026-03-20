import directionalArrowLeft from "../assets/directionalArrow-left.svg";
import directionalArrowRight from "../assets/directionalArrow-right.svg";

type NextPrevButtonsProps = {
  onPrevious?: () => void;
  onNext?: () => void;
  disabledPrevious?: boolean;
  disabledNext?: boolean;
  className?: string;
};

export const NextPrevButtons = ({
  onPrevious,
  onNext,
  disabledPrevious = false,
  disabledNext = false,
  className = "",
}: NextPrevButtonsProps) => {
  return (
    <div className={`next-prev-buttons ${className}`} style={{ display: "flex", alignItems: "stretch" }}>
      <button
        type="button"
        onClick={onPrevious}
        disabled={disabledPrevious}
        className="next-prev-button next-prev-button-left"
        style={{
          background: "var(--color-bg-default-primary)",
          border: "1px solid var(--color-border-input)",
          borderRight: "none",
          borderRadius: "8px 0 0 8px",
          padding: "8px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: disabledPrevious ? "not-allowed" : "pointer",
          opacity: disabledPrevious ? 0.5 : 1,
          transition: "background-color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          if (!disabledPrevious) {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-bg-default-primary)";
        }}
      >
        <img src={directionalArrowLeft} alt="Previous" width="24" height="24" />
      </button>
      <div
        style={{
          width: "1px",
          background: "var(--color-border-input)",
          alignSelf: "stretch",
        }}
      />
      <button
        type="button"
        onClick={onNext}
        disabled={disabledNext}
        className="next-prev-button next-prev-button-right"
        style={{
          background: "var(--color-bg-default-primary)",
          border: "1px solid var(--color-border-input)",
          borderLeft: "none",
          borderRadius: "0 8px 8px 0",
          padding: "8px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: disabledNext ? "not-allowed" : "pointer",
          opacity: disabledNext ? 0.5 : 1,
          transition: "background-color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          if (!disabledNext) {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-bg-default-primary)";
        }}
      >
        <img src={directionalArrowRight} alt="Next" width="24" height="24" />
      </button>
    </div>
  );
};
