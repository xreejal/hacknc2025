# Wall Street Professional Finance Platform

## Color Scheme (CORRECT)

**Purple #8B5CF6**
- ALL UI elements
- Buttons, links, badges
- Accents, borders, glows
- Text highlights
- Interactive elements
- Headers, titles

**Green #10B981 (CHARTS ONLY)**
- Price charts when positive
- Performance graphs going up
- Chart gradients and lines
- Chart indicators

**Red #EF4444 (CHARTS ONLY)**
- Price charts when negative
- Performance graphs going down  
- Loss indicators

**Black #0a0a0a**
- Background
- Card backgrounds (black/40 opacity)

**White/Gray**
- Text
- Data
- Labels

## Where Green Appears

ONLY in these components:
- `PriceChart.tsx` - Chart lines, fills, LIVE badge
- `TickerCard.tsx` - Price change percentages
- `Sidebar.tsx` - Price change indicators  
- Dashboard market indices (S&P, NASDAQ gains)

Everywhere else: PURPLE

## Interactive Features

**Mouse-Reactive Grid**
- Purple (#8B5CF6) glowing particles
- Connects to cursor
- Smooth 60fps animation
- Canvas-based

**Live Stock Ticker**
- Scrolling prices
- Purple for price changes
- Monospace fonts

**Real-Time Charts**
- Green when up
- Red when down
- Gradient fills
- Animated updates

## Typography

**Inter** - Headlines, UI text
**JetBrains Mono** - Prices, data, symbols

## Pages

- Landing: Purple UI + Charts with green
- Dashboard: Purple UI + Market cards with green
- Auth: Purple accents
- All pages: Interactive grid background

## Build Status

SUCCESS - No errors

## Usage

Visit: http://localhost:3000
Move mouse to see interactive grid
Watch charts update with green/red
All other UI is purple

Perfect balance: Purple for UI, Green ONLY for charts!
