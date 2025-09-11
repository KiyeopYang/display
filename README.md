# Real-Time Google Analytics Dashboard

A real-time analytics dashboard for Google Analytics 4, optimized for 1920x1080 displays with Korean localization.

## Features

- **Real-time Active Users Display** - Shows current active users with large, readable text
- **Location Tracking** - Displays top cities and countries with Korean translations
- **Device & Platform Analytics** - Shows distribution across mobile, tablet, desktop and OS platforms
- **Automatic Data Collection** - Saves analytics data to SQLite every minute
- **Korean Localization** - All location names and UI text in Korean
- **Fixed Display Size** - Optimized for 1920x1080 monitors without scrolling
- **Smooth Gradient Animation** - Professional animated background

## Tech Stack

- **Next.js 15** with TypeScript
- **Google Analytics Data API** for real-time data
- **SQLite** for data persistence
- **Tailwind CSS** for styling
- **Node-cron** for scheduled tasks

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=3003
GA4_PROPERTY_ID=your_property_id
GOOGLE_APPLICATION_CREDENTIALS=./path-to-service-account.json
```

3. Run the development server:
```bash
npm run dev
```

4. Open dashboard at http://localhost:3003/dashboard

## Project Structure

```
├── app/
│   ├── api/analytics/    # API routes for GA4 data
│   ├── dashboard/         # Main dashboard page
│   └── page.tsx          # Home page
├── lib/
│   ├── googleAnalytics.ts    # GA4 integration
│   ├── database.ts           # SQLite service
│   ├── scheduler.ts          # Cron job scheduler
│   └── locationKoreanNames.ts # Korean translations
└── analytics.db              # SQLite database
```

## Database

View stored analytics data:
```bash
node showDatabase.js
```

## Design Guidelines

- Fixed 1920x1080 display (no scrolling)
- Large text for readability from distance
- Updates every 10 seconds
- Shows up to 20 cities simultaneously
