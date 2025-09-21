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

## Data Analysis Guidelines for Arimate User Purchase Behavior

### Database Access via Supabase MCP

#### Required Tables
1. **arimate_users** - User information table
   - `id`: User UUID
   - `birthday`: User's birthdate (for age calculation)
   - `gender`: User gender (m/f)
   - `created_at`: Account creation timestamp
   - `lastVisited`: Last activity timestamp
   - `gem`: Current gem balance
   - `is_gender_birthday_requested`: Boolean flag for data collection

2. **arimate_gem_changes** - Transaction history table
   - `user`: User ID (foreign key to arimate_users.id)
   - `type`: Transaction type (filter for 'purchase')
   - `change`: Amount of gems (positive for purchases)
   - `created_at`: Transaction timestamp
   - `reason`: Transaction reason/description

#### How to Connect and Fetch Data
```python
# Use Supabase MCP tools to access data
# Available tools:
# - mcp__supabase__execute_sql: Run SQL queries
# - mcp__supabase__list_tables: List all tables
# - mcp__supabase__get_project_url: Get project URL
# - mcp__supabase__get_anon_key: Get anonymous key

# Example usage in Claude:
# 1. List tables: mcp__supabase__list_tables
# 2. Execute query: mcp__supabase__execute_sql with SQL parameter
```

```sql
-- Example: Get total purchases
SELECT COUNT(*) as total_purchases, 
       SUM(change) as total_revenue
FROM arimate_gem_changes 
WHERE type = 'purchase' AND change > 0;

-- Example: Join users with purchases (NOTE: Use "user" in quotes)
SELECT u.*, SUM(gc.change) as total_spent
FROM arimate_users u
JOIN arimate_gem_changes gc ON u.id = gc."user"
WHERE gc.type = 'purchase' AND gc.change > 0
GROUP BY u.id;

-- IMPORTANT: The 'user' column in arimate_gem_changes needs quotes
-- because 'user' is a reserved keyword in PostgreSQL
```

### Step-by-Step Analysis Process

#### 1. Data Preparation & Initial Exploration
```sql
-- First check overall purchase statistics
SELECT COUNT(*) as total_purchases, SUM(change) as total_revenue, AVG(change) as avg_purchase
FROM arimate_gem_changes WHERE type = 'purchase' AND change > 0;

-- Check user demographics
SELECT COUNT(*) as total_users FROM arimate_users WHERE birthday IS NOT NULL;
```

#### 2. Age Group Analysis
- **Segment users by age groups**: 20대, 30대, 40대, 50대+
- **DO NOT display data for users under 20** (privacy/sensitivity)
- Calculate for each age group:
  - Total revenue contribution (%)
  - Purchase conversion rate
  - Average purchase per buyer
  - Purchase frequency

#### 3. Gender Analysis
- Analyze gender distribution (m/f)
- Cross-reference with age groups
- Focus on male users (99% of user base)

#### 4. Time Pattern Analysis
```sql
-- Check weekday vs weekend patterns
-- IMPORTANT: Calculate both total and daily average
-- Weekend may have higher daily average despite lower total
```
- Peak hours analysis (especially 0-6 AM)
- Weekday vs weekend comparison (total AND daily average)

#### 5. Customer Lifetime Value
- First purchase timing (days from signup)
- Retention analysis
- Whale user identification (top 10%)
- Purchase frequency patterns

#### 6. Key Insights to Extract
1. **Primary Target**: Identify age group with highest revenue & conversion
2. **Hidden Opportunities**: Look for underserved segments with potential
3. **Time-based Patterns**: Find unexpected peak times
4. **Quick Converters**: Which age converts fastest to first purchase
5. **VIP Behavior**: Characteristics of top 10% spenders

### Report Generation Format

#### Executive Summary Structure
- Main target user profile (age, gender, behavior)
- Top 3 actionable insights
- Revenue maximization formula (X users, Y behavior, Z target)

#### Data Presentation Rules
- **Always exclude teenage data** from reports
- Show percentages with context (base numbers)
- Include both averages and medians
- Compare with logical benchmarks

#### Critical Metrics to Include
1. **Conversion Rate by Age**: % of users who make purchases
2. **ARPU (Average Revenue Per User)**: By age group
3. **Purchase Velocity**: Days to first purchase
4. **Frequency & Recency**: How often users buy
5. **Concentration Risk**: Revenue dependency on top users

### Revenue Maximization Analysis Template

**Formula: X Users → Y Action → Z Goal = Expected Impact**

Example:
- X: 20s non-buyers (268 users)
- Y: Convert to first purchase
- Z: Within signup day
- Impact: +720,000 gems (8.4% revenue increase)

### Important Considerations
- **Privacy First**: Never show data for minors
- **Statistical Significance**: Ensure sample sizes are meaningful
- **Actionable Insights**: Every finding should suggest an action
- **Context Matters**: Weekend may have fewer days but higher per-day revenue
- **Validate Assumptions**: Double-check surprising findings

### SQL Query Best Practices
```sql
-- Always filter positive purchases
WHERE type = 'purchase' AND change > 0

-- Use proper age calculation
DATE_PART('year', AGE(CURRENT_DATE, birthday))::int as age

-- Handle NULLs appropriately
WHERE birthday IS NOT NULL

-- Consider time zones if relevant
-- Group by meaningful segments
```