# Design Guidelines: RideCalc Pro

## Brand Identity

**Purpose**: A professional decision-making tool for rideshare drivers. Instantly analyze trip profitability across Uber, Bolt, and FreeNow without switching apps.

**Aesthetic Direction**: **Dashboard/Instrument Panel** – High-contrast, data-first design inspired by automotive gauges. Clean, immediate readability at a glance. Dark-optimized for night driving with minimal eye strain.

**Memorable Element**: The floating overlay bar that transforms complex trip data into instant profit signals using color-coded indicators (green=profitable, amber=marginal, red=loss).

## Navigation Architecture

**Root Navigation**: Tab Bar (3 tabs)
- **Dashboard** (home icon) – Main overlay controls and quick stats
- **History** (list icon) – Trip analysis log
- **Settings** (gear icon) – App configuration

**Additional Screens**:
- Trip Detail (modal) – Deep dive into specific trip calculations
- Onboarding (stack) – Platform integration setup

## Color Palette

**Primary Colors**:
- Profit Green: `#00D68F` (profitable trips)
- Warning Amber: `#FFB946` (marginal trips)
- Loss Red: `#FF4757` (unprofitable trips)
- Primary Accent: `#0EA5E9` (interactive elements)

**Neutral Palette**:
- Background Dark: `#0F172A` (main background)
- Surface: `#1E293B` (cards, elevated elements)
- Surface Light: `#334155` (secondary surfaces)
- Text Primary: `#F1F5F9` (headings, key data)
- Text Secondary: `#94A3B8` (labels, metadata)
- Border: `#475569`

**Semantic**:
- Use Profit Green/Warning Amber/Loss Red for trip profitability indicators

## Typography

**Font Family**: System font (SF Pro for iOS, Roboto for Android)

**Type Scale**:
- Display Large: 32pt, Bold (overlay trip earnings)
- Heading 1: 24pt, Bold (screen titles)
- Heading 2: 18pt, Semibold (section headers)
- Body: 16pt, Regular (trip details, labels)
- Caption: 14pt, Regular (metadata, secondary info)
- Data Large: 28pt, Semibold (key metrics in overlay)
- Data Small: 14pt, Medium (overlay supporting data)

## Screen Specifications

### 1. Dashboard (Tab 1)
**Purpose**: Control overlay bar and view real-time trip analysis

**Layout**:
- Transparent header, title: "Dashboard"
- Scrollable content
- Safe area: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Large toggle switch: "Overlay Mode ON/OFF" (Profit Green when active)
- Preview card showing miniature version of overlay bar
- Quick stats grid (4x2): Today's trips, Earnings, Distance, Fuel cost
- "Active Platform" selector (Uber/Bolt/FreeNow icons)

### 2. Overlay Bar (Floating Window)
**Purpose**: Displays live trip analysis over other apps

**Layout**:
- Compact horizontal bar (full width, ~120pt height)
- Draggable, semi-transparent dark background (0.95 opacity)
- Subtle shadow: shadowOffset (0, 4), shadowOpacity 0.15, shadowRadius 8

**Components** (left to right):
- Platform icon (small, 24pt)
- Earnings (Display Large, color-coded)
- Vertical divider
- Grid of 4 metrics in 2 columns:
  - Distance to pickup / Pickup time
  - Trip distance / Trip time
- Minimize button (right edge)

**Color Logic**:
- Background shifts subtly based on profitability (greenish/amber/reddish tint on Surface Dark)

### 3. History (Tab 2)
**Purpose**: Review past trip decisions and patterns

**Layout**:
- Header with search bar
- List view (scrollable)
- Safe area: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Trip cards: Platform logo, earnings (large, color-coded), distance/time summary, timestamp
- Filter chips at top: "All", "Accepted", "Rejected", "This Week"
- Empty state if no trips (use empty-history.png illustration)

**Interaction**: Tap card opens Trip Detail modal

### 4. Trip Detail (Modal)
**Purpose**: Full breakdown of trip economics

**Layout**:
- Navigation header with "Close" button (left), title: "Trip Analysis"
- Scrollable form-style layout
- Submit/cancel: N/A (read-only screen)

**Components**:
- Large profitability indicator at top (icon + percentage)
- Labeled rows for all 8 metrics (distance to pickup, pickup time, trip distance, trip time, gross earnings, driver percentage, fuel consumption, fuel price)
- Calculated fields: Net earnings, Fuel cost, Profit per km/hour
- Platform badge

### 5. Settings (Tab 3)
**Purpose**: Configure app behavior and defaults

**Layout**:
- Default navigation header, title: "Settings"
- Scrollable form
- Safe area: top = Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Profile section: User avatar (generated preset), Display name field
- Default values: Fuel consumption (l/100km), Fuel price (zł/L), Driver percentage for each platform
- Overlay preferences: Transparency slider, Vibration on new trip toggle
- Theme toggle (always default to dark)
- "About" and "Help" links

## Visual Design

**Icons**: Use Feather icons from @expo/vector-icons (e.g., navigation, trending-up, clock, droplet for fuel)

**Touchable Feedback**: Slight scale down (0.97) + opacity (0.7) on press

**Cards**: Surface color, 12pt border radius, no shadow (keep flat for speed)

**Floating Overlay**: Subtle shadow (specified above), rounded corners (16pt)

**Profitability Indicators**: Use filled circles with profit/warning/loss colors next to earnings

## Assets to Generate

1. **icon.png** – App icon featuring stylized overlay bar with upward trending arrow, dark background with Profit Green accent
2. **splash-icon.png** – Same as app icon
3. **empty-history.png** – Minimalist illustration of empty road/dashboard, muted teal and gray tones, WHERE USED: History screen when no trips logged
4. **avatar-driver.png** – Simple driver silhouette avatar in Primary Accent color, WHERE USED: Settings profile section (default user avatar)
5. **onboarding-overlay.png** – Illustration showing overlay bar floating above generic map/app interface, WHERE USED: Onboarding screen explaining overlay feature

**Platform Integration**: Use official Uber, Bolt, FreeNow logos (vector format) for platform selectors and trip cards.