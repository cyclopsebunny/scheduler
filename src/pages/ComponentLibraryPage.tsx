import React, { useState } from "react";
import "../styles/schedule.css";
import { Button } from "@component-library/core";
import { PageLayout } from "../components/PageLayout";
import { Dropdown } from "../components/Dropdown";
import { NextPrevButtons } from "../components/NextPrevButtons";
import { DateDropdown } from "../components/DateDropdown";
import { DateRangeSelector } from "../components/DateRangeSelector";
import facilityIcon from "../assets/facility.svg";
import userIcon from "../assets/user.svg";
import checkCircleIcon from "../assets/check-circle.svg";
import plusIcon from "../assets/plus.svg";
import chevronDown from "../assets/chevron-down.svg";

const siteOptions = [
  "myQ Enterprise Demo Facility - Statesville, NC",
  "myQ Enterprise Demo Facility - Miami, FL",
  "myQ Enterprise Demo Facility - Atlanta, GA",
];

export const ComponentLibraryPage = () => {
  const [dropdownValue, setDropdownValue] = useState("Option 1");
  const [typeAheadValue, setTypeAheadValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [searchType, setSearchType] = useState<"Shipment ID" | "Confirmation #" | "Carrier">("Shipment ID");
  const dropdownOptions = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [dateRangeMode, setDateRangeMode] = useState<"Today" | "This Week" | "This Month" | "Time Range">("Today");
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [showModal, setShowModal] = useState(false);

  return (
    <>
    <PageLayout
      activeStep="shipment"
      onStepClick={() => {}}
      selectedSite={siteOptions[0]}
      onSiteChange={() => {}}
      siteOptions={siteOptions}
      showStepper={true}
    >
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
        <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 600, marginBottom: "8px" }}>Component Library</h1>
        <p style={{ fontSize: "16px", color: "var(--color-text-default-secondary)", marginBottom: "48px" }}>
          Design system documentation and component showcase
        </p>

        {/* @component-library/core (Figma design system) */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", borderBottom: "2px solid var(--color-border-muted)", paddingBottom: "8px" }}>
            @component-library/core
          </h2>
          <p style={{ fontSize: "14px", color: "var(--color-text-default-secondary)", marginBottom: "24px" }}>
            Buttons from the shared Figma component library.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
            <Button variant="CTA">CTA</Button>
            <Button variant="brand">Brand</Button>
            <Button variant="default">Default</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="CTA" size="Small">Small CTA</Button>
          </div>
        </section>

        {/* Design Tokens */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", borderBottom: "2px solid var(--color-border-muted)", paddingBottom: "8px" }}>
            Design Tokens
          </h2>

          {/* Color Reference by Component */}
          <div style={{ marginBottom: "48px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "24px" }}>Component Color Reference</h3>
            <p style={{ fontSize: "14px", color: "var(--color-text-default-secondary)", marginBottom: "24px" }}>
              Hex color values used across components organized by component type and state.
            </p>

            {/* Primary Button */}
            <div style={{ marginBottom: "32px", padding: "16px", background: "var(--color-bg-default-secondary)", borderRadius: "8px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Primary Button</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px", fontSize: "13px" }}>
                <div>
                  <strong>Default State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#003B5C", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#003B5C</code></li>
                    <li>Text: <code style={{ background: "#ececec", padding: "2px 6px", borderRadius: "3px" }}>#ececec</code></li>
                    <li>Border: <code style={{ background: "#003B5C", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#003B5C</code></li>
                  </ul>
                </div>
                <div>
                  <strong>Disabled State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#babfcc", padding: "2px 6px", borderRadius: "3px" }}>#babfcc</code></li>
                    <li>Text: <code style={{ background: "rgba(89, 89, 89, 1)", padding: "2px 6px", borderRadius: "3px" }}>rgba(89, 89, 89, 1)</code></li>
                    <li>Border: <code style={{ background: "#babfcc", padding: "2px 6px", borderRadius: "3px" }}>#babfcc</code></li>
                    <li>Opacity: 0.6</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Secondary Button */}
            <div style={{ marginBottom: "32px", padding: "16px", background: "var(--color-bg-default-secondary)", borderRadius: "8px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Secondary Button</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px", fontSize: "13px" }}>
                <div>
                  <strong>Default State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#ffffff</code></li>
                    <li>Text: <code style={{ background: "rgba(89, 89, 89, 1)", padding: "2px 6px", borderRadius: "3px" }}>rgba(89, 89, 89, 1)</code></li>
                    <li>Border: <code style={{ background: "#babfcc", padding: "2px 6px", borderRadius: "3px" }}>#babfcc</code></li>
                  </ul>
                </div>
                <div>
                  <strong>Disabled State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#ffffff</code></li>
                    <li>Text: <code style={{ background: "#cccccc", padding: "2px 6px", borderRadius: "3px" }}>#cccccc</code></li>
                    <li>Border: <code style={{ background: "#cccccc", padding: "2px 6px", borderRadius: "3px" }}>#cccccc</code></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Ghost Button */}
            <div style={{ marginBottom: "32px", padding: "16px", background: "var(--color-bg-default-secondary)", borderRadius: "8px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Ghost Button</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px", fontSize: "13px" }}>
                <div>
                  <strong>Default State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "transparent", padding: "2px 6px", borderRadius: "3px" }}>transparent</code></li>
                    <li>Text: <code style={{ background: "#0a76db", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#0a76db</code></li>
                    <li>Icon: Filtered to <code style={{ background: "#0a76db", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#0a76db</code></li>
                  </ul>
                </div>
                <div>
                  <strong>Disabled State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "transparent", padding: "2px 6px", borderRadius: "3px" }}>transparent</code></li>
                    <li>Text: <code style={{ background: "#B2B2B2", padding: "2px 6px", borderRadius: "3px" }}>#B2B2B2</code></li>
                    <li>Icon: Opacity 0.6, grayscale</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Filter Buttons - Scheduled */}
            <div style={{ marginBottom: "32px", padding: "16px", background: "var(--color-bg-default-secondary)", borderRadius: "8px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Filter Button - Scheduled Status</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px", fontSize: "13px" }}>
                <div>
                  <strong>Default State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#ffffff</code></li>
                    <li>Text: <code style={{ background: "#003b5c", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#003b5c</code></li>
                    <li>Border: <code style={{ background: "#babfcc", padding: "2px 6px", borderRadius: "3px" }}>#babfcc</code></li>
                    <li>Indicator: <code style={{ background: "#003b5c", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#003b5c</code></li>
                  </ul>
                </div>
                <div>
                  <strong>Hover State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#c7e3f2", padding: "2px 6px", borderRadius: "3px" }}>#c7e3f2</code></li>
                    <li>Border: <code style={{ background: "#003b5c", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#003b5c</code></li>
                  </ul>
                </div>
                <div>
                  <strong>Active State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#003b5c", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#003b5c</code></li>
                    <li>Text: <code style={{ background: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#ffffff</code></li>
                    <li>Border: <code style={{ background: "#003b5c", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#003b5c</code></li>
                    <li>Indicator: <code style={{ background: "#0078ab", padding: "2px 6px", borderRadius: "3px" }}>#0078ab</code></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Filter Buttons - In Progress */}
            <div style={{ marginBottom: "32px", padding: "16px", background: "var(--color-bg-default-secondary)", borderRadius: "8px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Filter Button - In Progress Status</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px", fontSize: "13px" }}>
                <div>
                  <strong>Default State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#ffffff</code></li>
                    <li>Text: <code style={{ background: "#348516", padding: "2px 6px", borderRadius: "3px" }}>#348516</code></li>
                    <li>Border: <code style={{ background: "#babfcc", padding: "2px 6px", borderRadius: "3px" }}>#babfcc</code></li>
                    <li>Indicator: <code style={{ background: "#43ac1d", padding: "2px 6px", borderRadius: "3px" }}>#43ac1d</code></li>
                  </ul>
                </div>
                <div>
                  <strong>Hover State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#e8f5e9", padding: "2px 6px", borderRadius: "3px" }}>#e8f5e9</code></li>
                    <li>Border: <code style={{ background: "#43ac1d", padding: "2px 6px", borderRadius: "3px" }}>#43ac1d</code></li>
                  </ul>
                </div>
                <div>
                  <strong>Active State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#43ac1d", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#43ac1d</code></li>
                    <li>Text: <code style={{ background: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#ffffff</code></li>
                    <li>Border: <code style={{ background: "#43ac1d", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#43ac1d</code></li>
                    <li>Indicator: <code style={{ background: "#5bc82a", padding: "2px 6px", borderRadius: "3px" }}>#5bc82a</code></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Filter Buttons - Complete */}
            <div style={{ marginBottom: "32px", padding: "16px", background: "var(--color-bg-default-secondary)", borderRadius: "8px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Filter Button - Complete Status</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px", fontSize: "13px" }}>
                <div>
                  <strong>Default State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#ffffff</code></li>
                    <li>Text: <code style={{ background: "#6b6b6b", padding: "2px 6px", borderRadius: "3px" }}>#6b6b6b</code></li>
                    <li>Border: <code style={{ background: "#babfcc", padding: "2px 6px", borderRadius: "3px" }}>#babfcc</code></li>
                    <li>Indicator: <code style={{ background: "#909090", padding: "2px 6px", borderRadius: "3px" }}>#909090</code></li>
                  </ul>
                </div>
                <div>
                  <strong>Hover State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#f5f5f5", padding: "2px 6px", borderRadius: "3px" }}>#f5f5f5</code></li>
                    <li>Border: <code style={{ background: "#909090", padding: "2px 6px", borderRadius: "3px" }}>#909090</code></li>
                  </ul>
                </div>
                <div>
                  <strong>Active State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#909090", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#909090</code></li>
                    <li>Text: <code style={{ background: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#ffffff</code></li>
                    <li>Border: <code style={{ background: "#909090", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#909090</code></li>
                    <li>Indicator: <code style={{ background: "#a8a8a8", padding: "2px 6px", borderRadius: "3px" }}>#a8a8a8</code></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Filter Buttons - Cancelled */}
            <div style={{ marginBottom: "32px", padding: "16px", background: "var(--color-bg-default-secondary)", borderRadius: "8px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Filter Button - Cancelled Status</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px", fontSize: "13px" }}>
                <div>
                  <strong>Default State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#ffffff</code></li>
                    <li>Label: <code style={{ background: "#9e2d08", padding: "2px 6px", borderRadius: "3px" }}>#9e2d08</code></li>
                    <li>Count: <code style={{ background: "#d13b0b", padding: "2px 6px", borderRadius: "3px" }}>#d13b0b</code></li>
                    <li>Border: <code style={{ background: "#babfcc", padding: "2px 6px", borderRadius: "3px" }}>#babfcc</code></li>
                    <li>Indicator: <code style={{ background: "#d13b0b", padding: "2px 6px", borderRadius: "3px" }}>#d13b0b</code></li>
                  </ul>
                </div>
                <div>
                  <strong>Hover State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#ffebee", padding: "2px 6px", borderRadius: "3px" }}>#ffebee</code></li>
                    <li>Border: <code style={{ background: "#d13b0b", padding: "2px 6px", borderRadius: "3px" }}>#d13b0b</code></li>
                  </ul>
                </div>
                <div>
                  <strong>Active State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#d13b0b", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#d13b0b</code></li>
                    <li>Text: <code style={{ background: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#ffffff</code></li>
                    <li>Border: <code style={{ background: "#d13b0b", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#d13b0b</code></li>
                    <li>Indicator: <code style={{ background: "#e85a2b", padding: "2px 6px", borderRadius: "3px" }}>#e85a2b</code></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Input Fields */}
            <div style={{ marginBottom: "32px", padding: "16px", background: "var(--color-bg-default-secondary)", borderRadius: "8px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Input Fields</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px", fontSize: "13px" }}>
                <div>
                  <strong>Default State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Background: <code style={{ background: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#ffffff</code></li>
                    <li>Text: <code style={{ background: "#17191c", padding: "2px 6px", borderRadius: "3px" }}>#17191c</code></li>
                    <li>Border: <code style={{ background: "#babfcc", padding: "2px 6px", borderRadius: "3px" }}>#babfcc</code></li>
                  </ul>
                </div>
                <div>
                  <strong>Placeholder State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Text: <code style={{ background: "#babfcc", padding: "2px 6px", borderRadius: "3px" }}>#babfcc</code></li>
                  </ul>
                </div>
                <div>
                  <strong>Focused State:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Border: <code style={{ background: "#0a76db", padding: "2px 6px", borderRadius: "3px" }}>#0a76db</code></li>
                    <li>Text: <code style={{ background: "#17191c", padding: "2px 6px", borderRadius: "3px" }}>#17191c</code></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Table Status Indicators */}
            <div style={{ marginBottom: "32px", padding: "16px", background: "var(--color-bg-default-secondary)", borderRadius: "8px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Table Status Indicators</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", fontSize: "13px" }}>
                <div>
                  <strong>Scheduled:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Text: <code style={{ background: "#10405A", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#10405A</code></li>
                    <li>Bar: <code style={{ background: "#10405A", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#10405A</code></li>
                  </ul>
                </div>
                <div>
                  <strong>In Progress:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Text: <code style={{ background: "#43ac1d", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#43ac1d</code></li>
                    <li>Bar: <code style={{ background: "#43ac1d", color: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#43ac1d</code></li>
                  </ul>
                </div>
                <div>
                  <strong>Complete:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Text: <code style={{ background: "#9E9E9E", padding: "2px 6px", borderRadius: "3px" }}>#9E9E9E</code></li>
                    <li>Bar: <code style={{ background: "#9E9E9E", padding: "2px 6px", borderRadius: "3px" }}>#9E9E9E</code></li>
                  </ul>
                </div>
                <div>
                  <strong>Cancelled:</strong>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                    <li>Text: <code style={{ background: "#d13b0b", padding: "2px 6px", borderRadius: "3px" }}>#d13b0b</code></li>
                    <li>Bar: <code style={{ background: "#d13b0b", padding: "2px 6px", borderRadius: "3px" }}>#d13b0b</code></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Panels */}
            <div style={{ marginBottom: "32px", padding: "16px", background: "var(--color-bg-default-secondary)", borderRadius: "8px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Panels</h4>
              <div style={{ fontSize: "13px" }}>
                <strong>Standard Panel:</strong>
                <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--color-text-default-secondary)" }}>
                  <li>Background: <code style={{ background: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>#ffffff</code></li>
                  <li>Border: <code style={{ background: "#efefef", padding: "2px 6px", borderRadius: "3px" }}>#efefef</code></li>
                  <li>Shadow: <code style={{ background: "rgba(0, 0, 0, 0.1)", padding: "2px 6px", borderRadius: "3px" }}>rgba(0, 0, 0, 0.1)</code></li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "32px" }}>
            {/* Colors */}
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Colors</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", color: "var(--color-text-default-secondary)" }}>Background</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ width: "60px", height: "60px", background: "var(--color-bg-default-primary)", border: "1px solid var(--color-border-input)", borderRadius: "4px" }} />
                      <div style={{ fontSize: "11px", color: "var(--color-text-default-secondary)" }}>Primary</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ width: "60px", height: "60px", background: "var(--color-bg-default-secondary)", border: "1px solid var(--color-border-input)", borderRadius: "4px" }} />
                      <div style={{ fontSize: "11px", color: "var(--color-text-default-secondary)" }}>Secondary</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ width: "60px", height: "60px", background: "var(--color-bg-brand-primary)", border: "1px solid var(--color-border-input)", borderRadius: "4px" }} />
                      <div style={{ fontSize: "11px", color: "var(--color-text-default-secondary)" }}>Brand</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ width: "60px", height: "60px", background: "var(--color-bg-brand-secondary)", border: "1px solid var(--color-border-input)", borderRadius: "4px" }} />
                      <div style={{ fontSize: "11px", color: "var(--color-text-default-secondary)" }}>Brand Light</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", color: "var(--color-text-default-secondary)" }}>Text</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ width: "60px", height: "60px", background: "var(--color-text-default-primary)", border: "1px solid var(--color-border-input)", borderRadius: "4px" }} />
                      <div style={{ fontSize: "11px", color: "var(--color-text-default-secondary)" }}>Primary</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ width: "60px", height: "60px", background: "var(--color-text-default-secondary)", border: "1px solid var(--color-border-input)", borderRadius: "4px" }} />
                      <div style={{ fontSize: "11px", color: "var(--color-text-default-secondary)" }}>Secondary</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ width: "60px", height: "60px", background: "var(--color-text-brand-primary)", border: "1px solid var(--color-border-input)", borderRadius: "4px" }} />
                      <div style={{ fontSize: "11px", color: "var(--color-text-default-secondary)" }}>Brand</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", color: "var(--color-text-default-secondary)" }}>Borders</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ width: "60px", height: "60px", background: "white", border: "2px solid var(--color-border-input)", borderRadius: "4px" }} />
                      <div style={{ fontSize: "11px", color: "var(--color-text-default-secondary)" }}>Input</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ width: "60px", height: "60px", background: "white", border: "2px solid var(--color-border-muted)", borderRadius: "4px" }} />
                      <div style={{ fontSize: "11px", color: "var(--color-text-default-secondary)" }}>Muted</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spacing */}
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Spacing</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { name: "100", value: "4px" },
                  { name: "200", value: "8px" },
                  { name: "300", value: "12px" },
                  { name: "400", value: "16px" },
                  { name: "600", value: "24px" },
                  { name: "800", value: "32px" },
                  { name: "1200", value: "48px" },
                ].map((space) => (
                  <div key={space.name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "60px", fontSize: "12px", color: "var(--color-text-default-secondary)" }}>{space.name}</div>
                    <div style={{ width: space.value, height: "20px", background: "var(--color-bg-brand-primary)", borderRadius: "2px" }} />
                    <div style={{ fontSize: "12px", color: "var(--color-text-default-secondary)" }}>{space.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Border Radius</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { name: "100", value: "4px" },
                  { name: "200", value: "8px" },
                  { name: "400", value: "16px" },
                  { name: "full", value: "9999px" },
                ].map((radius) => (
                  <div key={radius.name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "60px", fontSize: "12px", color: "var(--color-text-default-secondary)" }}>{radius.name}</div>
                    <div style={{ width: "60px", height: "60px", background: "var(--color-bg-brand-primary)", borderRadius: `var(--radius-${radius.name})` }} />
                    <div style={{ fontSize: "12px", color: "var(--color-text-default-secondary)" }}>{radius.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", borderBottom: "2px solid var(--color-border-muted)", paddingBottom: "8px" }}>
            Buttons
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Primary Button</h3>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <button className="primary">Primary Button</button>
                <button className="primary" disabled>Disabled</button>
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`<button className="primary">Primary Button</button>`}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Secondary Button</h3>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <button className="secondary">Secondary Button</button>
                <button className="secondary" disabled>Disabled</button>
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`<button className="secondary">Secondary Button</button>`}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Ghost Button</h3>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <button className="ghost-button">
                  <img className="plus" src={plusIcon} alt="" aria-hidden="true" />
                  Ghost Button
                </button>
                <button className="ghost-button" disabled>
                  <img className="plus" src={plusIcon} alt="" aria-hidden="true" />
                  Disabled
                </button>
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`<button className="ghost-button">
  <img className="plus" src={plusIcon} alt="" />
  Ghost Button
</button>`}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Next/Previous Buttons</h3>
              <p style={{ fontSize: "14px", color: "var(--color-text-default-secondary)", marginBottom: "16px" }}>
                A conjoined button component with left and right navigation arrows. The buttons share a border and are visually connected.
              </p>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--color-text-default-secondary)" }}>Default State</div>
                  <NextPrevButtons 
                    onPrevious={() => console.log("Previous clicked")}
                    onNext={() => console.log("Next clicked")}
                  />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--color-text-default-secondary)" }}>With Disabled States</div>
                  <NextPrevButtons 
                    onPrevious={() => console.log("Previous clicked")}
                    onNext={() => console.log("Next clicked")}
                    disabledPrevious={true}
                    disabledNext={false}
                  />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--color-text-default-secondary)" }}>Both Disabled</div>
                  <NextPrevButtons 
                    onPrevious={() => console.log("Previous clicked")}
                    onNext={() => console.log("Next clicked")}
                    disabledPrevious={true}
                    disabledNext={true}
                  />
                </div>
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`import { NextPrevButtons } from "./components/NextPrevButtons";

<NextPrevButtons 
  onPrevious={() => handlePrevious()}
  onNext={() => handleNext()}
  disabledPrevious={false}
  disabledNext={false}
/>`}
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-brand-secondary)", borderRadius: "8px", fontSize: "13px" }}>
                <strong>Props:</strong>
                <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", color: "var(--color-text-default-secondary)" }}>
                  <li><strong>onPrevious:</strong> Callback function called when the previous button is clicked</li>
                  <li><strong>onNext:</strong> Callback function called when the next button is clicked</li>
                  <li><strong>disabledPrevious:</strong> Boolean to disable the previous button (default: false)</li>
                  <li><strong>disabledNext:</strong> Boolean to disable the next button (default: false)</li>
                  <li><strong>className:</strong> Optional additional CSS class name</li>
                </ul>
                <div style={{ marginTop: "12px" }}>
                  <strong>Features:</strong>
                  <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", color: "var(--color-text-default-secondary)" }}>
                    <li>Conjoined buttons with shared border</li>
                    <li>Left button has rounded corners on the left side only</li>
                    <li>Right button has rounded corners on the right side only</li>
                    <li>Hover state with subtle background color change</li>
                    <li>Disabled state with reduced opacity</li>
                    <li>Uses directional arrow icons from assets</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Filter Button - Status Variations</h3>
              
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--color-text-default-secondary)" }}>Default States</div>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                  <button className="filter-button status-scheduled">
                    <div className="filter-button-indicator" />
                    <span className="filter-button-label">Scheduled</span>
                    <span className="filter-button-count">6</span>
                  </button>
                  <button className="filter-button status-in-progress">
                    <div className="filter-button-indicator" />
                    <span className="filter-button-label">In Progress</span>
                    <span className="filter-button-count">1</span>
                  </button>
                  <button className="filter-button status-complete">
                    <div className="filter-button-indicator" />
                    <span className="filter-button-label">Complete</span>
                    <span className="filter-button-count">2</span>
                  </button>
                  <button className="filter-button status-cancelled">
                    <div className="filter-button-indicator" />
                    <span className="filter-button-label">Cancelled</span>
                    <span className="filter-button-count">0</span>
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--color-text-default-secondary)" }}>Active/Selected States</div>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                  <button className="filter-button status-scheduled active">
                    <div className="filter-button-indicator" />
                    <span className="filter-button-label">Scheduled</span>
                    <span className="filter-button-count">6</span>
                  </button>
                  <button className="filter-button status-in-progress active">
                    <div className="filter-button-indicator" />
                    <span className="filter-button-label">In Progress</span>
                    <span className="filter-button-count">1</span>
                  </button>
                  <button className="filter-button status-complete active">
                    <div className="filter-button-indicator" />
                    <span className="filter-button-label">Complete</span>
                    <span className="filter-button-count">2</span>
                  </button>
                  <button className="filter-button status-cancelled active">
                    <div className="filter-button-indicator" />
                    <span className="filter-button-label">Cancelled</span>
                    <span className="filter-button-count">0</span>
                  </button>
                </div>
              </div>

              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`<button className="filter-button status-scheduled">
  <div className="filter-button-indicator" />
  <span className="filter-button-label">Scheduled</span>
  <span className="filter-button-count">6</span>
</button>

<button className="filter-button status-in-progress">
  <div className="filter-button-indicator" />
  <span className="filter-button-label">In Progress</span>
  <span className="filter-button-count">1</span>
</button>

<button className="filter-button status-complete">
  <div className="filter-button-indicator" />
  <span className="filter-button-label">Complete</span>
  <span className="filter-button-count">2</span>
</button>

<button className="filter-button status-cancelled">
  <div className="filter-button-indicator" />
  <span className="filter-button-label">Cancelled</span>
  <span className="filter-button-count">0</span>
</button>`}
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-brand-secondary)", borderRadius: "8px", fontSize: "13px" }}>
                <strong>Status Color Variations:</strong>
                <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", color: "var(--color-text-default-secondary)" }}>
                  <li><strong>Scheduled:</strong> Dark blue (#003b5c) - Hover: light blue background, Active: dark blue background with white text</li>
                  <li><strong>In Progress:</strong> Green (#43ac1d) - Hover: light green background, Active: green background with white text</li>
                  <li><strong>Complete:</strong> Gray (#909090) - Hover: light gray background, Active: gray background with white text</li>
                  <li><strong>Cancelled:</strong> Red (#d13b0b) - Hover: light red background, Active: red background with white text</li>
                </ul>
                <div style={{ marginTop: "12px" }}>
                  <strong>States:</strong>
                  <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", color: "var(--color-text-default-secondary)" }}>
                    <li><strong>Default:</strong> White background, colored indicator bar and text</li>
                    <li><strong>Hover:</strong> Light colored background matching status, colored border</li>
                    <li><strong>Active:</strong> Status color background, white text, status color border</li>
                    <li><strong>Active + Hover:</strong> Status color background, lighter indicator bar, white text</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", borderBottom: "2px solid var(--color-border-muted)", paddingBottom: "8px" }}>
            Inputs
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Text Input States</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "400px" }}>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", color: "var(--color-text-default-secondary)" }}>Default State (with value)</div>
                  <input 
                    type="text" 
                    className="input input-field" 
                    placeholder="Enter text..." 
                    value="Sample text"
                    readOnly
                  />
                  <div style={{ fontSize: "11px", color: "var(--color-text-default-tertiary)", marginTop: "4px" }}>
                    Normal state with a value - text appears in primary color
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", color: "var(--color-text-default-secondary)" }}>Focused State</div>
                  <input 
                    type="text" 
                    className="input input-field" 
                    placeholder="Enter text..." 
                    value="Sample text"
                    readOnly
                    autoFocus
                    onFocus={(e) => e.target.blur()}
                    style={{ borderColor: "var(--color-text-brand-primary)" }}
                  />
                  <div style={{ fontSize: "11px", color: "var(--color-text-default-tertiary)", marginTop: "4px" }}>
                    When focused, the border changes to brand primary color (blue)
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", color: "var(--color-text-default-secondary)" }}>Empty State (.placeholder class)</div>
                  <input 
                    type="text" 
                    className={`input input-field ${!inputValue ? "placeholder" : ""}`}
                    placeholder="Type here..." 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <div style={{ fontSize: "11px", color: "var(--color-text-default-tertiary)", marginTop: "4px" }}>
                    The <code style={{ background: "var(--color-bg-default-secondary)", padding: "2px 4px", borderRadius: "2px" }}>.placeholder</code> class is conditionally applied when the value is empty, making the text appear in tertiary color. Type in the field above to see it change.
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", color: "var(--color-text-default-secondary)" }}>Empty + Focused State</div>
                  <input 
                    type="text" 
                    className={`input input-field ${!inputValue ? "placeholder" : ""}`}
                    placeholder="Click to focus..." 
                    value=""
                    readOnly
                    style={{ borderColor: "var(--color-text-brand-primary)" }}
                  />
                  <div style={{ fontSize: "11px", color: "var(--color-text-default-tertiary)", marginTop: "4px" }}>
                    When an empty input is focused, the border turns blue and text color changes to primary
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`// Conditionally apply .placeholder class when empty
<input 
  type="text" 
  className={\`input input-field \${!value ? "placeholder" : ""}\`}
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// In the codebase, this pattern is used like:
className={\`input input-field \${!shipment.id ? "placeholder" : ""}\`}`}
              </div>
            </div>
          </div>
        </section>

        {/* Dropdown */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", borderBottom: "2px solid var(--color-border-muted)", paddingBottom: "8px" }}>
            Dropdown
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Standard Dropdown</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
                <Dropdown
                  value={dropdownValue}
                  options={dropdownOptions}
                  onChange={setDropdownValue}
                />
                <Dropdown
                  value=""
                  options={dropdownOptions}
                  onChange={() => {}}
                  placeholder="Select an option..."
                />
                <Dropdown
                  value={dropdownValue}
                  options={dropdownOptions}
                  onChange={setDropdownValue}
                  icon={facilityIcon}
                />
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`<Dropdown
  value={value}
  options={options}
  onChange={handleChange}
  icon={facilityIcon}
/>`}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Type-Ahead Dropdown</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
                <Dropdown
                  value={typeAheadValue}
                  options={dropdownOptions}
                  onChange={setTypeAheadValue}
                  typeAhead={true}
                  placeholder="Type to search..."
                />
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`<Dropdown
  value={value}
  options={options}
  onChange={handleChange}
  typeAhead={true}
  placeholder="Type to search..."
/>`}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Search Type Selector</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
                <div className="search-type-selector-wrapper">
                  <Dropdown
                    value={searchType}
                    options={["Shipment ID", "Confirmation #", "Carrier"]}
                    onChange={(value) => setSearchType(value as "Shipment ID" | "Confirmation #" | "Carrier")}
                    icon="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z' stroke='%230a76db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"
                    chevronIcon="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11.4355 5.43457C11.7479 5.12215 12.2539 5.12215 12.5663 5.43457C12.8788 5.74699 12.8788 6.25301 12.5663 6.56543L8.56635 10.5654C8.25393 10.8779 7.74791 10.8779 7.43549 10.5654L3.43549 6.56543C3.12307 6.25301 3.12307 5.74699 3.43549 5.43457C3.74791 5.12215 4.25393 5.12215 4.56635 5.43457L8.00092 8.86914L11.4355 5.43457Z' fill='%230a76db'/%3E%3C/svg%3E"
                  />
                </div>
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`<div className="search-type-selector-wrapper">
  <Dropdown
    value={searchType}
    options={["Shipment ID", "Confirmation #", "Carrier"]}
    onChange={setSearchType}
    icon="data:image/svg+xml,..." // Search icon SVG
    chevronIcon="data:image/svg+xml,..." // Blue chevron SVG
  />
</div>`}
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-brand-secondary)", borderRadius: "8px", fontSize: "13px" }}>
                <strong>Features:</strong>
                <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", color: "var(--color-text-default-secondary)" }}>
                  <li>Search icon (24px) on the left in blue (#0a76db)</li>
                  <li>Uppercase text in blue (#0a76db), 14px, normal weight</li>
                  <li>Blue chevron icon (24px) on the right</li>
                  <li>Transparent background with no border</li>
                  <li>16px gap between elements</li>
                  <li>8px vertical padding, 16px horizontal padding</li>
                  <li>Right border separator (1px solid muted border)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Panels */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", borderBottom: "2px solid var(--color-border-muted)", paddingBottom: "8px" }}>
            Panels
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Standard Panel</h3>
              <div className="panel" style={{ maxWidth: "600px" }}>
                <div className="panel-title-bar">
                  <h2>Panel Title</h2>
                </div>
                <div style={{ padding: "16px" }}>
                  <p style={{ margin: 0, color: "var(--color-text-default-secondary)" }}>
                    This is a standard panel with rounded corners, border, and shadow.
                  </p>
                </div>
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`<div className="panel">
  <div className="panel-title-bar">
    <h2>Panel Title</h2>
  </div>
  <div style={{ padding: "16px" }}>
    Content here
  </div>
</div>`}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Panel Variants</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--color-text-default-secondary)" }}>Shipments Panel</div>
                  <div className="panel shipments-panel" style={{ height: "200px" }}>
                    <div className="panel-title-bar">
                      <h2>Shipments Panel</h2>
                    </div>
                    <div style={{ padding: "16px", flex: 1, overflow: "auto" }}>
                      <p style={{ margin: 0, color: "var(--color-text-default-secondary)" }}>
                        Full-height flex panel for main content areas.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--color-text-default-secondary)" }}>Details Panel</div>
                  <div className="panel details-panel" style={{ width: "300px" }}>
                    <div className="panel-title-bar">
                      <h2>Details Panel</h2>
                    </div>
                    <div style={{ padding: "16px" }}>
                      <p style={{ margin: 0, color: "var(--color-text-default-secondary)" }}>
                        Fixed-width side panel for supplementary information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`<div className="panel shipments-panel">
  {/* Full-height flex panel */}
</div>

<div className="panel details-panel">
  {/* Fixed-width side panel */}
</div>`}
              </div>
            </div>
          </div>
        </section>

        {/* Stepper */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", borderBottom: "2px solid var(--color-border-muted)", paddingBottom: "8px" }}>
            Stepper
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Step Indicator</h3>
              <div className="stepper" style={{ maxWidth: "600px" }}>
                <div className="step active">
                  <span className="step-dot" />
                  <span className="step-label">Shipment</span>
                </div>
                <div className="step clickable">
                  <span className="step-dot" />
                  <span className="step-label">Schedule</span>
                </div>
                <div className="step clickable">
                  <span className="step-dot" />
                  <span className="step-label">Driver</span>
                </div>
                <div className="step clickable">
                  <span className="step-dot" />
                  <span className="step-label">Trailer</span>
                </div>
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`<div className="stepper">
  <div className="step active">
    <span className="step-dot" />
    <span className="step-label">Shipment</span>
  </div>
  <div className="step clickable">
    <span className="step-dot" />
    <span className="step-label">Schedule</span>
  </div>
</div>`}
              </div>
            </div>
          </div>
        </section>

        {/* Tags */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", borderBottom: "2px solid var(--color-border-muted)", paddingBottom: "8px" }}>
            Tags
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Tag Component</h3>
              <div className="details-tags">
                <span className="details-tag">Tag 1</span>
                <span className="details-tag">Tag 2</span>
                <span className="details-tag">Tag 3</span>
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`<div className="details-tags">
  <span className="details-tag">Tag 1</span>
  <span className="details-tag">Tag 2</span>
</div>`}
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", borderBottom: "2px solid var(--color-border-muted)", paddingBottom: "8px" }}>
            Typography
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: 600, marginBottom: "8px" }}>Heading 1</h1>
              <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px" }}>Heading 2</h2>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>Heading 3</h3>
              <p style={{ fontSize: "16px", marginBottom: "8px" }}>Body text - 16px</p>
              <p style={{ fontSize: "14px", marginBottom: "8px" }}>Small text - 14px</p>
              <p style={{ fontSize: "12px", marginBottom: "8px" }}>Extra small text - 12px</p>
            </div>
            <div>
              <div style={{ fontSize: "14px", color: "var(--color-text-default-primary)", marginBottom: "4px" }}>Primary Text</div>
              <div style={{ fontSize: "14px", color: "var(--color-text-default-secondary)", marginBottom: "4px" }}>Secondary Text</div>
              <div style={{ fontSize: "14px", color: "var(--color-text-default-tertiary)", marginBottom: "4px" }}>Tertiary Text</div>
              <div style={{ fontSize: "14px", color: "var(--color-text-brand-primary)", marginBottom: "4px" }}>Brand Text</div>
            </div>
          </div>
        </section>

        {/* Tables */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", borderBottom: "2px solid var(--color-border-muted)", paddingBottom: "8px" }}>
            Tables
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Table Component</h3>
              <div className="panel" style={{ maxWidth: "800px", padding: "0" }}>
                <div className="table" style={{ "--table-columns": "120px 180px 140px 140px" } as React.CSSProperties}>
                  <div className="table-scroll" style={{ maxHeight: "300px" }}>
                    <div className="table-header">
                      <span>Status</span>
                      <span>Shipment ID</span>
                      <span>Vendor</span>
                      <span>Date</span>
                    </div>
                    <div className="table-row">
                      <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>Scheduled</span>
                      <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>123456789</span>
                      <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>Nestle</span>
                      <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>1/6/26</span>
                    </div>
                    <div className="table-row">
                      <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>In Progress</span>
                      <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>987654321</span>
                      <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>Kraft Heinz</span>
                      <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>1/7/26</span>
                    </div>
                    <div className="table-row">
                      <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>Complete</span>
                      <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>456789123</span>
                      <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>General Mills</span>
                      <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>1/5/26</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`<div className="table" style={{ "--table-columns": "120px 180px 140px" }}>
  <div className="table-scroll">
    <div className="table-header">
      <span>Column 1</span>
      <span>Column 2</span>
    </div>
    <div className="table-row">
      <span>Data 1</span>
      <span>Data 2</span>
    </div>
  </div>
</div>`}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Table Status Indicator</h3>
              <p style={{ fontSize: "14px", color: "var(--color-text-default-secondary)", marginBottom: "16px" }}>
                Status indicators for table rows showing appointment status with a colored vertical bar and matching text.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--color-text-default-secondary)" }}>Scheduled Status</div>
                  <div className="panel" style={{ maxWidth: "800px", padding: "0" }}>
                    <div className="table" style={{ "--table-columns": "150px 180px 140px 140px" } as React.CSSProperties}>
                      <div className="table-scroll" style={{ maxHeight: "200px" }}>
                        <div className="table-header">
                          <span>Status</span>
                          <span>Shipment ID</span>
                          <span>Vendor</span>
                          <span>Date</span>
                        </div>
                        <div className="table-row">
                          <span className="table-status status-scheduled">
                            <span className="table-status-bar" />
                            Scheduled
                          </span>
                          <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>123456789</span>
                          <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>Nestle</span>
                          <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>1/6/26</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--color-text-default-secondary)" }}>In Progress Status</div>
                  <div className="panel" style={{ maxWidth: "800px", padding: "0" }}>
                    <div className="table" style={{ "--table-columns": "150px 180px 140px 140px" } as React.CSSProperties}>
                      <div className="table-scroll" style={{ maxHeight: "200px" }}>
                        <div className="table-header">
                          <span>Status</span>
                          <span>Shipment ID</span>
                          <span>Vendor</span>
                          <span>Date</span>
                        </div>
                        <div className="table-row">
                          <span className="table-status status-in-progress">
                            <span className="table-status-bar" />
                            In Progress
                          </span>
                          <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>987654321</span>
                          <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>Kraft Heinz</span>
                          <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>1/7/26</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--color-text-default-secondary)" }}>Complete Status</div>
                  <div className="panel" style={{ maxWidth: "800px", padding: "0" }}>
                    <div className="table" style={{ "--table-columns": "150px 180px 140px 140px" } as React.CSSProperties}>
                      <div className="table-scroll" style={{ maxHeight: "200px" }}>
                        <div className="table-header">
                          <span>Status</span>
                          <span>Shipment ID</span>
                          <span>Vendor</span>
                          <span>Date</span>
                        </div>
                        <div className="table-row">
                          <span className="table-status status-complete">
                            <span className="table-status-bar" />
                            Complete
                          </span>
                          <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>456789123</span>
                          <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>General Mills</span>
                          <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>1/5/26</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--color-text-default-secondary)" }}>Cancelled Status</div>
                  <div className="panel" style={{ maxWidth: "800px", padding: "0" }}>
                    <div className="table" style={{ "--table-columns": "150px 180px 140px 140px" } as React.CSSProperties}>
                      <div className="table-scroll" style={{ maxHeight: "200px" }}>
                        <div className="table-header">
                          <span>Status</span>
                          <span>Shipment ID</span>
                          <span>Vendor</span>
                          <span>Date</span>
                        </div>
                        <div className="table-row">
                          <span className="table-status status-cancelled">
                            <span className="table-status-bar" />
                            Cancelled
                          </span>
                          <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>789123456</span>
                          <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>PepsiCo</span>
                          <span style={{ fontSize: "12px", color: "var(--color-text-default-primary)" }}>1/4/26</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`<span className="table-status status-scheduled">
  <span className="table-status-bar" />
  Scheduled
</span>

<span className="table-status status-in-progress">
  <span className="table-status-bar" />
  In Progress
</span>

<span className="table-status status-complete">
  <span className="table-status-bar" />
  Complete
</span>

<span className="table-status status-cancelled">
  <span className="table-status-bar" />
  Cancelled
</span>`}
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-brand-secondary)", borderRadius: "8px", fontSize: "13px" }}>
                <strong>Features:</strong>
                <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", color: "var(--color-text-default-secondary)" }}>
                  <li>Vertical bar indicator (4px wide) on the left side</li>
                  <li>Dark blue color (#10405A) for scheduled status</li>
                  <li>Text color matches the bar color</li>
                  <li>8px gap between bar and text</li>
                  <li>12px font size for status text</li>
                  <li>Used in table row cells to indicate appointment status</li>
                </ul>
                <div style={{ marginTop: "12px" }}>
                  <strong>Status Colors:</strong>
                  <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", color: "var(--color-text-default-secondary)" }}>
                    <li><strong>Scheduled:</strong> #10405A (dark blue)</li>
                    <li><strong>In Progress:</strong> #43ac1d (vibrant green)</li>
                    <li><strong>Complete:</strong> #9E9E9E (medium grey)</li>
                    <li><strong>Cancelled:</strong> #d13b0b (red)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Layout Components */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", borderBottom: "2px solid var(--color-border-muted)", paddingBottom: "8px" }}>
            Layout Components
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>PageLayout</h3>
              <p style={{ fontSize: "14px", color: "var(--color-text-default-secondary)", marginBottom: "16px" }}>
                The main layout wrapper that provides the top bar, stepper navigation, and content area. This entire component library page is wrapped in a PageLayout component.
              </p>
              <div style={{ padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`import { PageLayout } from "./components/PageLayout";

<PageLayout
  activeStep="schedule"
  onStepClick={handleStepClick}
  selectedSite={selectedSite}
  onSiteChange={handleSiteChange}
  siteOptions={siteOptions}
  showStepper={true}
>
  {/* Page content */}
</PageLayout>`}
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-brand-secondary)", borderRadius: "8px", fontSize: "13px" }}>
                <strong>Features:</strong>
                <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", color: "var(--color-text-default-secondary)" }}>
                  <li>Top bar with brand, site selector, and user info</li>
                  <li>Optional stepper navigation</li>
                  <li>Content area for page content</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Date Components */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", borderBottom: "2px solid var(--color-border-muted)", paddingBottom: "8px" }}>
            Date Components
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>DateDropdown</h3>
              <p style={{ fontSize: "14px", color: "var(--color-text-default-secondary)", marginBottom: "16px" }}>
                A calendar dropdown component for selecting single dates or date ranges with a calendar picker interface.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
                <DateDropdown
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />
                <DateDropdown
                  selectedDate={null}
                  onDateChange={setSelectedDate}
                />
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`import { DateDropdown } from "./components/DateDropdown";

<DateDropdown
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  minDate={minDate}
  maxDate={maxDate}
  displayText="Custom text"
  dateRange={{ start: startDate, end: endDate }}
/>`}
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-brand-secondary)", borderRadius: "8px", fontSize: "13px" }}>
                <strong>Props:</strong>
                <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", color: "var(--color-text-default-secondary)" }}>
                  <li><strong>selectedDate:</strong> <code>Date | null</code> - Currently selected date</li>
                  <li><strong>onDateChange:</strong> <code>(date: Date | null) =&gt; void</code> - Change handler</li>
                  <li><strong>minDate?:</strong> <code>Date</code> - Minimum selectable date</li>
                  <li><strong>maxDate?:</strong> <code>Date</code> - Maximum selectable date</li>
                  <li><strong>displayText?:</strong> <code>string</code> - Custom text to display instead of formatted date</li>
                  <li><strong>dateRange?:</strong> <code>{`{ start: Date; end: Date | null }`}</code> - For date range selection mode</li>
                </ul>
                <div style={{ marginTop: "12px" }}>
                  <strong>Features:</strong>
                  <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", color: "var(--color-text-default-secondary)" }}>
                    <li>Calendar picker with month/year navigation</li>
                    <li>Single date or date range selection</li>
                    <li>Date formatting: "Tuesday, January 6th 2026" or "1/6/26 - 1/12/26" for ranges</li>
                    <li>Min/max date restrictions</li>
                    <li>Today indicator</li>
                    <li>Hover preview for date ranges</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>DateRangeSelector</h3>
              <p style={{ fontSize: "14px", color: "var(--color-text-default-secondary)", marginBottom: "16px" }}>
                A date range selector with quick options (Today, This Week, This Month, Time Range) and a dropdown menu.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
                <DateRangeSelector
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  mode={dateRangeMode}
                  onModeChange={setDateRangeMode}
                  dateRange={dateRange}
                  onDateRangeChange={(start, end) => setDateRange({ start, end })}
                />
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`import { DateRangeSelector } from "./components/DateRangeSelector";

<DateRangeSelector
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  mode="Today"
  onModeChange={setMode}
  dateRange={{ start: startDate, end: endDate }}
  onDateRangeChange={(start, end) => setDateRange({ start, end })}
/>`}
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-brand-secondary)", borderRadius: "8px", fontSize: "13px" }}>
                <strong>Modes:</strong>
                <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", color: "var(--color-text-default-secondary)" }}>
                  <li><strong>Today:</strong> Selects today's date</li>
                  <li><strong>This Week:</strong> Selects start of current week (Sunday)</li>
                  <li><strong>This Month:</strong> Selects start of current month</li>
                  <li><strong>Time Range:</strong> Allows custom date range selection (defaults to last 15 days)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Modals */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", borderBottom: "2px solid var(--color-border-muted)", paddingBottom: "8px" }}>
            Modals
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Confirmation Modal</h3>
              <p style={{ fontSize: "14px", color: "var(--color-text-default-secondary)", marginBottom: "16px" }}>
                Modal dialogs for displaying confirmation messages and important information. Used for appointment confirmations and terms & conditions.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <button className="primary" onClick={() => setShowModal(true)}>
                  Open Modal
                </button>
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`<div className="modal-overlay" onClick={() => setShowModal(false)}>
  <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
    <div className="modal-header">
      <h2 className="modal-title">Modal Title</h2>
      <button 
        className="modal-close-button" 
        onClick={() => setShowModal(false)}
        aria-label="Close modal"
      >
        ×
      </button>
    </div>
    <div className="modal-content">
      {/* Content here */}
    </div>
    <div className="modal-footer">
      <button 
        className="primary" 
        type="button"
        onClick={() => setShowModal(false)}
      >
        Close
      </button>
    </div>
  </div>
</div>`}
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-brand-secondary)", borderRadius: "8px", fontSize: "13px" }}>
                <strong>Features:</strong>
                <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", color: "var(--color-text-default-secondary)" }}>
                  <li>Overlay background with click-to-close</li>
                  <li>Centered modal with rounded corners</li>
                  <li>Header with title and close button (×)</li>
                  <li>Scrollable content area</li>
                  <li>Footer with action buttons</li>
                  <li>Click outside to close</li>
                  <li>Used for: Appointment Confirmation, Terms and Conditions</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", borderBottom: "2px solid var(--color-border-muted)", paddingBottom: "8px" }}>
            Footer
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Footer Component</h3>
              <p style={{ fontSize: "14px", color: "var(--color-text-default-secondary)", marginBottom: "16px" }}>
                Site footer with navigation links and copyright information. Appears on all pages.
              </p>
              <div className="footer" style={{ maxWidth: "800px" }}>
                <div className="footer-links">
                  <span>Contact</span>
                  <span>Customer Support</span>
                  <span>Products</span>
                  <span style={{ cursor: "pointer" }}>Terms and Conditions</span>
                </div>
                <div className="footer-copyright">© 2026 Chamberlain Group. All Rights Reserved</div>
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`<footer className="footer">
  <div className="footer-links">
    <span>Contact</span>
    <span>Customer Support</span>
    <span>Products</span>
    <span 
      style={{ cursor: "pointer" }}
      onClick={handleTermsClick}
    >
      Terms and Conditions
    </span>
  </div>
  <div className="footer-copyright">
    © 2026 Chamberlain Group. All Rights Reserved
  </div>
</footer>`}
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-brand-secondary)", borderRadius: "8px", fontSize: "13px" }}>
                <strong>Features:</strong>
                <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", color: "var(--color-text-default-secondary)" }}>
                  <li>Navigation links in footer-links section</li>
                  <li>Terms and Conditions link opens modal</li>
                  <li>Copyright information</li>
                  <li>Consistent across all pages</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Button Panel */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", borderBottom: "2px solid var(--color-border-muted)", paddingBottom: "8px" }}>
            Filter Button Panel
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Filter Icon Button</h3>
              <p style={{ fontSize: "14px", color: "var(--color-text-default-secondary)", marginBottom: "16px" }}>
                A compact filter button with an icon, typically displayed in a panel next to status filter buttons.
              </p>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "40px",
                      height: "40px",
                      background: "rgba(255, 255, 255, 1)",
                      border: "1px solid #babfcc",
                      borderRadius: "8px",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    onClick={() => {}}
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
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-default-secondary)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}>
                {`<div
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
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      background: "rgba(255, 255, 255, 1)",
      border: "1px solid #babfcc",
      borderRadius: "8px",
      cursor: "pointer",
      padding: 0,
    }}
    onClick={handleFilterClick}
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 4H14M4 8H12M6 12H10"
        stroke="#17191C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  </button>
</div>`}
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "var(--color-bg-brand-secondary)", borderRadius: "8px", fontSize: "13px" }}>
                <strong>Features:</strong>
                <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", color: "var(--color-text-default-secondary)" }}>
                  <li>40x40px square button</li>
                  <li>Filter icon (three horizontal lines)</li>
                  <li>White background with border</li>
                  <li>8px border radius</li>
                  <li>Wrapped in panel with shadow</li>
                  <li>Width: fit-content to wrap tightly around button</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Shadows */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", borderBottom: "2px solid var(--color-border-muted)", paddingBottom: "8px" }}>
            Shadows
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
            {[
              { name: "100", var: "--shadow-100" },
              { name: "200", var: "--shadow-200" },
              { name: "300", var: "--shadow-300" },
              { name: "400", var: "--shadow-400" },
              { name: "500", var: "--shadow-500" },
              { name: "600", var: "--shadow-600" },
            ].map((shadow) => (
              <div key={shadow.name} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-text-default-secondary)" }}>Shadow {shadow.name}</div>
                <div
                  style={{
                    width: "100%",
                    height: "100px",
                    background: "white",
                    borderRadius: "8px",
                    boxShadow: `var(${shadow.var})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    color: "var(--color-text-default-secondary)",
                  }}
                >
                  Preview
                </div>
              </div>
            ))}
          </div>
        </section>
        </div>
      </div>
    </PageLayout>
    {showModal && (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Example Modal</h2>
            <button 
              className="modal-close-button" 
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          <div className="modal-content">
            <div className="important-info-section">
              <p>This is an example modal dialog. Click the X button, Close button, or click outside to close.</p>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              className="primary" 
              type="button"
              onClick={() => setShowModal(false)}
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
