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
  - Page 1: 0-1080px (Main Dashboard - 실시간 데이터)
  - Page 2: 1080-2160px (User Metrics Chart - 사용자 통계 차트)
  - Page 3: 2160-3240px (Character Rankings - 캐릭터 순위)
  - Page 4: 3240-4320px (Character Reviews - 캐릭터 리뷰)
  - Page 5: 4320-5400px (Company Mission - 회사 미션)
  - Page 6: 5400-6480px (YouTube Player - 유튜브 플레이어) *Not in rotation*
- **Automatic Page Rotation**
  - Pages rotate automatically every 10 minutes (600000ms)
  - Rotation cycle: Page 1 → Page 2 → Page 3 → Page 4 → Page 5 → Page 1 (반복)
  - Page 6 (YouTube) is excluded from normal rotation
  - No manual navigation controls are displayed
- **Browser scrollbar must NEVER be visible**
  - Scrollbar is hidden but scrolling is enabled programmatically
  - Use CSS to hide scrollbar while allowing scroll functionality
  - Control page transitions via JavaScript `window.scrollTo()`
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

## Dashboard Behavior & Time-based Features

### Night Mode (22:00 - 09:00)
- Screen turns completely black for monitor protection
- All dashboard functions are paused
- Can be disabled with `?noblack` URL parameter (saved in session)

### Lunch Time Music (11:45 - 13:00)
- YouTube music player activates automatically by scrolling to page 6
- Dashboard page rotation is paused during this time
- Returns to normal dashboard after lunch time ends (13:00)
- **Important**: YouTube player is always rendered as page 6 but NOT included in normal page rotation
- Normal rotation cycles through pages 1-5 only (excluding YouTube player page)

### Data Refresh Intervals
- **Real-time data**: Updates every 10 seconds
- **Database save**: Every 1 minute (via scheduler)
- **Page rotation**: Every 10 minutes (cycles through 3 pages)

### Visual Design Elements
- **No dashed borders**: All borders are solid lines
- **Full screen charts**: Page 2 chart uses full screen without borders
- **Date range display**: Shows date range without "기간" label
- **Large text**: All text sized for viewing from 2-3 meters distance

## Development Notes
- Server runs on port 3003 (auto-selected if 3000 is busy)
- Hot-reload is enabled by default with Next.js
- CORS is handled automatically (same origin)
- Environment variables are in `.env` file
- Console logs show page changes and scroll events for debugging

## Design Constraints
- Fixed viewport: 1920x1080
- No scrollbars visible (hidden via CSS)
- All content must be visible without scrolling within each page
- Optimize layout for Full HD displays only
- No manual navigation controls displayed