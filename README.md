# Jakarta Weather (Ionic + Vue)

Single-screen Ionic Vue app that pulls live Jakarta weather data from the Open-Meteo public API. It shows the latest conditions alongside an hourly temperature list with an in-app refresh.

## Features

- Current Jakarta conditions with dynamic icon, timestamp, and temperature card.
- Hourly temperature list in local time with loading and error states.
- One-tap refresh that re-fetches both current and hourly data.
- Built with Ionic Vue 8, and TypeScript; Axios for HTTP.

## Prerequisites

- Node.js 18+ and npm

## Setup

```bash
npm i -g @ionic/cli
npm install
```

## Run the app

```bash
ionic serve
```

Then open the printed local URL (typically `http://localhost:8100`).

## API

- Uses the free Open-Meteo forecast endpoint (`https://api.open-meteo.com/v1/forecast`) for Jakarta (`-6.2, 106.8`); no API key required.
