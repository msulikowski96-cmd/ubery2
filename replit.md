# RideCalc Pro

## Overview
RideCalc Pro to aplikacja mobilna stworzona dla kierowców platform przewozowych (Uber, Bolt, FreeNow). Pomaga analizować opłacalność kursów poprzez automatyczne przeliczanie stawek, kosztów paliwa i rzeczywistego zarobku.

## Features
- **Panel główny (Dashboard)** - Podgląd nakładki z przykładowymi danymi, przełącznik trybu overlay, wybór aktywnej platformy, dzienne statystyki
- **Historia kursów** - Lista wszystkich dodanych kursów z filtrami (wszystkie, tydzień, Uber, Bolt, FreeNow)
- **Dodawanie kursów** - Formularz do ręcznego wprowadzania danych kursu z podglądem opłacalności w czasie rzeczywistym
- **Szczegóły kursu** - Pełna analiza ekonomiczna kursu z podziałem na dojazd, kurs i finanse
- **Ustawienia** - Konfiguracja spalania, ceny paliwa, prowizji dla każdej platformy

## Tech Stack
- **Frontend**: React Native + Expo
- **Storage**: AsyncStorage (lokalne przechowywanie danych)
- **Navigation**: React Navigation (bottom tabs + stack)
- **Styling**: Custom theme system z ciemnym motywem dashboard
- **Android Auto**: react-native-carplay (obsługa ekranów samochodowych)

## Project Structure
```
client/
├── androidAuto/       # Android Auto integration
│   ├── AndroidAutoApp.tsx  # Android Auto screen templates
│   └── index.ts
├── components/         # Reusable UI components
│   ├── EmptyState.tsx
│   ├── FilterChip.tsx
│   ├── InputField.tsx
│   ├── MetricCard.tsx
│   ├── OverlayPreview.tsx
│   ├── PlatformIcon.tsx
│   ├── PlatformSelector.tsx
│   ├── ProfitIndicator.tsx
│   ├── ToggleSwitch.tsx
│   └── TripCard.tsx
├── screens/           # App screens
│   ├── DashboardScreen.tsx
│   ├── HistoryScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── AddTripScreen.tsx
│   └── TripDetailScreen.tsx
├── navigation/        # Navigation setup
├── hooks/             # Custom hooks
├── lib/               # Storage utilities
├── types/             # TypeScript types
└── constants/         # Theme and design tokens

android/
├── app/src/main/
│   ├── AndroidManifest.xml  # Android Auto service config
│   └── res/xml/
│       └── automotive_app_desc.xml  # Android Auto descriptor
```

## Color Scheme
- Background Dark: `#0F172A`
- Surface: `#1E293B`
- Profit Green: `#00D68F`
- Warning Amber: `#FFB946`
- Loss Red: `#FF4757`
- Primary Accent: `#0EA5E9`

## Profitability Logic
- **Profit (Green)**: zysk/km >= 1.5 zł
- **Marginal (Amber)**: zysk/km >= 0.8 zł
- **Loss (Red)**: zysk/km < 0.8 zł

## User Preferences
- Wszystkie dane przechowywane lokalnie (AsyncStorage)
- Ciemny motyw zoptymalizowany do jazdy nocą
- Wibracje haptic przy kluczowych akcjach

## Android Auto
Aplikacja obsługuje wyświetlanie na ekranach Android Auto z następującymi funkcjami:
- Dashboard - podgląd dziennych zarobków
- New Trip - rozpoczęcie nowego kursu
- History - historia kursów
- Settings - ustawienia aplikacji

Aby zbudować aplikację z Android Auto:
```bash
npx expo run:android
```

## Recent Changes
- Added Android Auto support with react-native-carplay library
- Created Android Auto screen templates (ListTemplate)
- Updated AndroidManifest.xml with Android Auto service
- Initial MVP release with Dashboard, History, Settings, and Trip management screens
- Local storage implementation for trips and settings
- Polish language interface
