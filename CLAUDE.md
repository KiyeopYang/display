# Project Guidelines for Claude

## Display Requirements
- **Do not make scrollable website, the display size (1920 x 1080) is fixed**
- This is a dashboard designed for a fixed Full HD monitor (1920x1080)
- All content must fit within the viewport without scrolling
- Design layouts to fit exactly within 1920x1080 pixels

## Pagination System
- **Dashboard is paginated by height, not traditional pagination**
- Each page is exactly 1920x1080 pixels (Full HD screen size)
- Pages are stacked vertically:
  - Page 1: 0-1080px (first screen)
  - Page 2: 1080-2160px (second screen, below first)
  - Page 3: 2160-3240px (third screen, below second)
  - And so on...
- **Browser scrollbar must NEVER be visible**
  - Use CSS `overflow: hidden` on body/html
  - Control page transitions programmatically via JavaScript
  - Use `window.scrollTo()` with specific pixel values for navigation
- Page navigation should be instant (no smooth scrolling) for clean transitions
- Each page must be self-contained within its 1920x1080 boundary

## Content Size Requirements
- **Text and images must be large and easily readable**
- Minimum font sizes:
  - Headers: 36px or larger (text-4xl minimum)
  - Main metrics: 60px or larger (text-6xl or bigger)
  - Body text: 14px minimum (text-sm minimum)
  - Small labels: 12px minimum (text-xs minimum)
- Numbers and key metrics should be prominently displayed
- Ensure high contrast for readability from a distance
- Design for viewing from 2-3 meters away from the monitor

## Project Overview
This is a real-time Google Analytics 4 dashboard that:
- Displays active user counts
- Shows top cities/locations with Korean translations
- Updates every 30 seconds automatically
- Saves data to SQLite database every minute

## Tech Stack
- Next.js with TypeScript
- Tailwind CSS for styling
- Google Analytics Data API
- SQLite for data persistence
- Node-cron for scheduled tasks

## Important Files
- `/app/dashboard/page.tsx` - Main dashboard component
- `/lib/googleAnalytics.ts` - GA4 API integration
- `/lib/database.ts` - SQLite database service
- `/lib/locationKoreanNames.ts` - Korean translation mappings
- `/app/api/analytics/*` - API routes for data fetching

## Development Notes
- Server runs on port 3003 (auto-selected if 3000 is busy)
- Hot-reload is enabled by default with Next.js
- CORS is handled automatically (same origin)
- Environment variables are in `.env` file

## Design Constraints
- Fixed viewport: 1920x1080
- No scrollbars allowed
- All content must be visible without scrolling
- Optimize layout for Full HD displays only