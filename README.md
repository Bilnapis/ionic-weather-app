# Jakarta Weather (Ionic + Vue)

Single-screen Ionic Vue app that pulls live Jakarta weather data from the Open-Meteo public API. It shows the latest conditions alongside an hourly temperature list with an in-app refresh.

## Features

- Current Jakarta conditions with dynamic icon, timestamp, and temperature card.
- Hourly temperature list in local time with loading and error states.
- One-tap refresh that re-fetches both current and hourly data.
- Built with Ionic Vue 8, Vite, and TypeScript; Axios for HTTP.

## Prerequisites

- Node.js 18+ and npm

## Setup

```bash
npm i -g @ionic/cli
ionic serve
```

## Run the app

```bash
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview  # optional, serve the production build locally
```

## API

- Uses the free Open-Meteo forecast endpoint (`https://api.open-meteo.com/v1/forecast`) for Jakarta (`-6.2, 106.8`); no API key required.
