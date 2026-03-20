# Component Library

This document provides an overview of the design system and component library for the Enterprise Scheduling Portal.

## Accessing the Component Library

To view the interactive component library, navigate to the application and add `#component-library` to the URL:

```
http://localhost:5173/#component-library
```

Or in production:
```
https://your-domain.com/#component-library
```

## Design System Overview

### Design Tokens

The design system uses CSS custom properties (variables) defined in `src/styles/tokens.css`:

#### Colors
- **Background Colors**: Primary (#ffffff), Secondary (#F5F5F5), Brand (#009cde)
- **Text Colors**: Primary (#17191c), Secondary (rgba(89, 89, 89, 1)), Brand (#0a76db)
- **Border Colors**: Input (#babfcc), Muted (#e4e8f2), Panel (#d1d7e3)

#### Spacing
- `--space-100`: 4px
- `--space-200`: 8px
- `--space-300`: 12px
- `--space-400`: 16px
- `--space-600`: 24px
- `--space-800`: 32px
- `--space-1200`: 48px

#### Border Radius
- `--radius-100`: 4px
- `--radius-200`: 8px
- `--radius-400`: 16px
- `--radius-full`: 9999px

#### Shadows
- `--shadow-100` through `--shadow-600`: Various elevation levels

### Typography
- **Font Family**: Inter, SF Pro Text, system-ui, sans-serif
- **Headings**: 32px (H1), 24px (H2), 18px (H3)
- **Body**: 16px, 14px, 12px

## Components

### Buttons

#### Primary Button
```tsx
<button className="primary">Primary Button</button>
```
- Background: #003B5C
- Text: Light gray
- Border radius: 8px
- Padding: 10px 18px

#### Secondary Button
```tsx
<button className="secondary">Secondary Button</button>
```
- Background: White
- Text: Secondary gray
- Border: 1px solid input border
- Border radius: 8px

#### Ghost Button
```tsx
<button className="ghost-button">
  <img className="plus" src={icon} alt="" />
  Ghost Button
</button>
```
- Transparent background
- Brand primary text color
- Uppercase text
- Used for icon + text combinations

### Inputs

#### Text Input
```tsx
<input type="text" className="input input-field" placeholder="Enter text..." />
```
- Border: 1px solid input border color
- Border radius: 8px
- Padding: 8px 10px
- Font size: 14px

### Dropdown

The `Dropdown` component supports both standard selection and type-ahead search:

```tsx
import { Dropdown } from "./components/Dropdown";

<Dropdown
  value={selectedValue}
  options={["Option 1", "Option 2", "Option 3"]}
  onChange={handleChange}
  icon={facilityIcon}  // Optional
  placeholder="Select an option..."  // Optional
  typeAhead={true}  // Optional, enables search
  chevronIcon={customChevron}  // Optional, custom chevron icon
/>
```

**Props:**
- `value`: string - Currently selected value
- `options`: string[] - Array of options
- `onChange`: (value: string) => void - Change handler
- `icon?`: string - Optional icon path
- `placeholder?`: string - Placeholder text
- `typeAhead?`: boolean - Enable type-ahead search
- `chevronIcon?`: string - Optional custom chevron icon path

**Features:**
- Standard dropdown with button toggle
- Type-ahead search mode with input field
- Keyboard navigation (Arrow keys, Enter, Escape)
- Click outside to close
- Shows "No matches found" when type-ahead has no results
- Placeholder text support
- Icon support (left side)
- Custom chevron icon support

### DateDropdown

A calendar dropdown component for selecting single dates or date ranges:

```tsx
import { DateDropdown } from "./components/DateDropdown";

<DateDropdown
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  minDate={minDate}  // Optional
  maxDate={maxDate}  // Optional
  displayText="Custom text"  // Optional
  dateRange={{ start: startDate, end: endDate }}  // Optional, for range selection
/>
```

**Props:**
- `selectedDate`: Date | null - Currently selected date
- `onDateChange`: (date: Date | null) => void - Change handler
- `minDate?`: Date - Minimum selectable date
- `maxDate?`: Date - Maximum selectable date
- `displayText?`: string - Custom text to display instead of formatted date
- `dateRange?`: { start: Date; end: Date | null } - For date range selection mode

**Features:**
- Calendar picker with month/year navigation
- Single date or date range selection
- Date formatting: "Tuesday, January 6th 2026" or "1/6/26 - 1/12/26" for ranges
- Min/max date restrictions
- Today indicator
- Hover preview for date ranges
- Custom display text support via `displayText` prop
- Click outside to close
- Angular Material-style range selection (click start, then end)

### DateRangeSelector

A date range selector with quick options (Today, This Week, This Month, Time Range):

```tsx
import { DateRangeSelector } from "./components/DateRangeSelector";

<DateRangeSelector
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  mode="Today"  // "Today" | "This Week" | "This Month" | "Time Range"
  onModeChange={setMode}
  dateRange={{ start: startDate, end: endDate }}
  onDateRangeChange={(start, end) => setDateRange({ start, end })}
/>
```

**Modes:**
- `Today`: Selects today's date
- `This Week`: Selects start of current week (Sunday)
- `This Month`: Selects start of current month
- `Time Range`: Allows custom date range selection (defaults to last 15 days)

**Features:**
- Conjoined button design (left button + right dropdown)
- Dropdown menu for mode selection
- Automatically initializes date range to last 15 days in Time Range mode
- Click outside to close dropdown
- Hover states on buttons

### Panels

```tsx
<div className="panel">
  <div className="panel-title-bar">
    <h2>Panel Title</h2>
  </div>
  <div style={{ padding: "16px" }}>
    Content here
  </div>
</div>
```

**Variants:**
- `.panel` - Standard panel with shadow and border
- `.shipments-panel` - Full-height flex panel
- `.details-panel` - Fixed-width side panel

### Stepper

```tsx
<div className="stepper">
  <div className="step active">
    <span className="step-dot" />
    <span className="step-label">Shipment</span>
  </div>
  <div className="step clickable">
    <span className="step-dot" />
    <span className="step-label">Schedule</span>
  </div>
</div>
```

**States:**
- `.active` - Current step (white dot with border)
- `.clickable` - Navigable step (hover effect)

### Tags

```tsx
<div className="details-tags">
  <span className="details-tag">Tag 1</span>
  <span className="details-tag">Tag 2</span>
</div>
```

- Rounded pill shape
- Border and background
- Used for categorization

### Tables

```tsx
<div className="table">
  <div className="table-scroll">
    <div className="table-header">
      <span>Column 1</span>
      <span>Column 2</span>
      <span className="table-actions-column" style={{ zIndex: 20 }}>Actions</span>
    </div>
    <div className="table-row">
      <span>Data 1</span>
      <span>Data 2</span>
      <span className="table-actions-column" style={{ zIndex: 5 }}>Actions</span>
    </div>
  </div>
</div>
```

**Features:**
- Scrollable table container
- Grid-based column layout
- Sticky header with `position: sticky` and `z-index: 20`
- Gradient overlays for scroll indicators
- Actions column with sticky positioning and z-index management
  - Header actions column: `z-index: 20` (matches header)
  - Row actions column: `z-index: 5` (when dropdown closed), `z-index: 1001` (when dropdown open)
- Alternating row backgrounds (gray/white)
- Row hover states with gradient backgrounds
- Selected row highlighting with blue background

## Layout Components

### PageLayout

The main layout wrapper that provides:
- Top bar with brand, site selector, and user info
- Optional stepper navigation
- Content area for page content

```tsx
import { PageLayout } from "./components/PageLayout";

<PageLayout
  activeStep="schedule"
  onStepClick={handleStepClick}
  selectedSite={selectedSite}
  onSiteChange={handleSiteChange}
  siteOptions={siteOptions}
  showStepper={true}
  selectedDate={selectedDate}  // Optional
  onDateChange={handleDateChange}  // Optional
  minDate={minDate}  // Optional
  maxDate={maxDate}  // Optional
>
  {/* Page content */}
</PageLayout>
```

## Modals

### Confirmation Modal

Modal dialogs for displaying confirmation messages and important information:

```tsx
<div className="modal-overlay" onClick={() => setShowModal(false)}>
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
</div>
```

**Features:**
- Overlay background with click-to-close
- Centered modal with rounded corners
- Header with title and close button (×)
- Scrollable content area
- Footer with action buttons
- Used for: Appointment Confirmation, Terms and Conditions

## Footer

### Footer Component

Site footer with navigation links and copyright information:

```tsx
<footer className="footer">
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
</footer>
```

**Features:**
- Navigation links in footer-links section
- Terms and Conditions link opens modal
- Copyright information
- Consistent across all pages

## Filter Button Panel

### Filter Icon Button

A compact filter button with an icon, typically displayed in a panel:

```tsx
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
</div>
```

**Features:**
- 40x40px square button
- Filter icon (three horizontal lines)
- White background with border
- Wrapped in panel with shadow
- Width: fit-content to wrap tightly around button

## Table Status Indicators

Status indicators for table rows showing appointment status with a colored vertical bar and matching text:

```tsx
<span className="table-status status-scheduled">
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
</span>
```

**Status Colors:**
- **Scheduled**: #10405A (dark blue)
- **In Progress**: #43ac1d (vibrant green)
- **Complete**: #9E9E9E (medium grey)
- **Cancelled**: #d13b0b (red)

**Features:**
- Vertical bar indicator (4px wide) on the left side
- Text color matches the bar color
- 8px gap between bar and text
- 12px font size for status text
- Used in table row cells to indicate appointment status

## File Structure

```
src/
├── components/
│   ├── DateDropdown.tsx          # Date picker dropdown component
│   ├── DateRangeSelector.tsx    # Date range selector component
│   ├── Dropdown.tsx             # Dropdown component
│   ├── NextPrevButtons.tsx      # Navigation buttons component
│   └── PageLayout.tsx           # Main layout wrapper
├── pages/
│   ├── ComponentLibraryPage.tsx  # Component library showcase
│   ├── DashboardPage.tsx
│   ├── SchedulePage.tsx
│   └── ...
└── styles/
    ├── tokens.css            # Design tokens (CSS variables)
    ├── global.css            # Global styles
    └── schedule.css          # Component styles
```

## Usage Guidelines

1. **Always use design tokens** - Use CSS variables instead of hardcoded values
2. **Follow component patterns** - Use existing components before creating new ones
3. **Maintain consistency** - Follow spacing, typography, and color guidelines
4. **Accessibility** - Ensure proper ARIA labels and keyboard navigation
5. **Responsive design** - Test components at different screen sizes

## Development

To add new components:
1. Create component file in `src/components/`
2. Add styles to `src/styles/schedule.css` using design tokens
3. Document in `ComponentLibraryPage.tsx`
4. Update this README

## Resources

- Design tokens: `src/styles/tokens.css`
- Component styles: `src/styles/schedule.css`
- Interactive library: Navigate to `#component-library` in the app
