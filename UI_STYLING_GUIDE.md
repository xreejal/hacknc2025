# APEX CAPITAL UI Styling Guide

## Overview
This is a comprehensive styling reference for maintaining consistent UI across all pages in the APEX CAPITAL dashboard. The design follows a professional Wall Street finance platform aesthetic with a dark theme, purple accents, and interactive elements.

---

## 🎨 Color System

### Primary Colors

**Purple (#8B5CF6)** - Use for ALL UI elements:
- Buttons, links, badges
- Accents, borders, glows
- Text highlights and gradients
- Interactive element hover states
- Icons and status indicators
- Headers and section titles

```tsx
// Examples:
className="text-purple"
className="border-purple/30"
className="hover:border-purple/50"
className="bg-purple/10"
className="text-gradient-purple"
```

**Green (#10B981) & Red (#EF4444)** - ONLY for chart data:
- Price charts (positive = green, negative = red)
- Performance indicators
- Price change percentages
- Market index cards
- Chart gradients and fills

```tsx
// Only in: PriceChart, TickerCard, Sidebar price indicators
className="text-chartGreen"
className="text-chartRed"
className="border-chartGreen/20"
```

### Background Colors

**Black (#0a0a0a)** - Base background:
```css
background: #0a0a0a;
```

**Card Backgrounds** - Semi-transparent with blur:
```tsx
className="bg-black/40 backdrop-blur-sm border-white/10"
```

**Gradients**:
```tsx
// Purple text gradient
className="text-gradient-purple"

// Chart background gradients
className="bg-gradient-to-br from-chartGreen/10 to-transparent"
className="bg-gradient-to-br from-chartRed/10 to-transparent"
```

### Text Colors

- Primary text: `text-white` or `text-foreground`
- Secondary/muted text: `text-gray-400` or `text-muted-foreground`
- Financial data: Use with `font-mono`

---

## 📝 Typography

### Font Families

**Inter** - For all UI text, headlines, labels:
```tsx
className="font-display" // Already set as default on body
```

**JetBrains Mono** - For financial data, prices, symbols, numbers:
```tsx
className="font-mono"
```

### Font Weights & Sizes

**Headlines:**
```tsx
// Page titles
className="font-black text-4xl tracking-tight"

// Section headers
className="font-black text-2xl tracking-tight"

// Card titles
className="font-black text-lg tracking-tight"
```

**Data Display:**
```tsx
// Large prices/values
className="font-mono font-black text-3xl"

// Regular prices
className="font-mono font-bold text-lg"

// Stock symbols
className="font-mono font-bold text-sm"

// Small data
className="font-mono text-xs"
```

---

## 🎯 Component Patterns

### Cards

**Standard Card:**
```tsx
<Card className="bg-black/40 backdrop-blur-sm border-white/10">
  <CardHeader>
    <CardTitle className="font-black tracking-tight">
      TITLE HERE
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

**Interactive Card (with hover):**
```tsx
<Card className="bg-black/40 backdrop-blur-sm border-white/10 hover:border-purple/50 transition-all cursor-pointer">
```

**Market Index Card (with gradient):**
```tsx
<div className="group bg-gradient-to-br from-chartGreen/10 to-transparent p-6 border border-chartGreen/20 hover:border-chartGreen/50 rounded-xl transition-all cursor-pointer">
```

### Buttons

```tsx
// Primary action
<Button className="bg-purple hover:bg-purple/90">

// Ghost/icon buttons
<Button variant="ghost" size="icon" className="text-white hover:text-purple">

// Secondary
<Button variant="secondary">
```

### Badges

```tsx
// Status badge with purple
<div className="flex items-center gap-2 bg-purple/10 px-4 py-2 border border-purple/30 rounded-full">
  <Activity className="w-4 h-4 text-purple animate-pulse" />
  <span className="font-mono font-bold text-purple text-sm">STATUS</span>
</div>
```

### Icons

**With Purple accent:**
```tsx
<TrendingUp className="w-6 h-6 text-purple" />
```

**Chart indicators (conditional color):**
```tsx
{isPositive ? (
  <TrendingUp className="w-4 h-4 text-chartGreen" />
) : (
  <TrendingDown className="w-4 h-4 text-chartRed" />
)}
```

**Icon containers:**
```tsx
<div className="flex justify-center items-center bg-purple/10 border border-purple/30 rounded-lg w-12 h-12">
  <TrendingUp className="w-6 h-6 text-purple" />
</div>
```

---

## 📐 Layout Structure

### Page Layout

All dashboard pages use the `<Layout>` component with 12-column grid:

```tsx
// Layout.tsx structure:
<div className="bg-black min-h-screen text-white">
  <InteractiveGrid /> {/* Background grid */}
  <Header />
  <div className="z-10 relative mx-auto px-4 py-6 container">
    <div className="gap-6 grid grid-cols-12">
      {/* Sidebar - hidden on mobile, visible lg+ */}
      <aside className="hidden lg:block col-span-3">
        <Sidebar />
      </aside>
      
      {/* Main content */}
      <main className="col-span-12 lg:col-span-6">
        <Outlet />
      </main>
      
      {/* Right panel - hidden until xl */}
      <aside className="hidden xl:block col-span-3">
        <RightPanel />
      </aside>
    </div>
  </div>
</div>
```

### Sticky Elements

**Sidebar:**
```tsx
<div className="top-20 sticky space-y-4">
```

**Header:**
```tsx
<header className="top-0 z-50 sticky bg-black/80 backdrop-blur-xl border-white/10 border-b">
```

### Spacing

```tsx
// Page sections
className="space-y-6"

// Between elements
className="gap-4 grid"
className="gap-6 grid"

// Card internal spacing
<CardHeader className="pb-3">
<CardContent className="p-6 pt-0">
```

---

## ✨ Interactive Effects

### Interactive Grid Background

Always include on full-page layouts:
```tsx
<InteractiveGrid />
```

This creates the purple particle grid that reacts to mouse movement.

### Hover States

**Cards:**
```tsx
className="hover:bg-white/5 transition-colors"
className="hover:border-purple/30 transition-all"
```

**Buttons/Links:**
```tsx
className="hover:text-purple transition-colors"
className="hover:scale-110 transition-transform"
```

**Glow effects:**
```tsx
// Purple glow
className="glow-purple"

// Green glow
className="glow-green"

// Custom glow on hover
<div className="relative">
  <Icon className="text-purple group-hover:scale-110 transition-transform" />
  <div className="absolute inset-0 bg-purple/50 opacity-0 group-hover:opacity-100 blur-lg transition-opacity" />
</div>
```

### Animations

**Pulse:**
```tsx
className="animate-pulse"
```

**Fade In:**
```tsx
className="animate-fadeIn"
```

**Slide In:**
```tsx
className="animate-slideIn"
```

---

## 🎪 Special Components

### Header

Features:
- Sticky positioning
- Glass morphism effect (backdrop-blur)
- Purple accent gradient line at top
- Search bar with purple focus state
- Notification bell with pulse indicator

```tsx
<header className="top-0 z-50 sticky bg-black/80 backdrop-blur-xl border-white/10 border-b">
  <div className="top-0 absolute inset-x-0 bg-gradient-to-r from-transparent via-purple to-transparent h-px" />
  {/* Content */}
</header>
```

### Live Ticker

Scrolling stock ticker component - use at top of dashboard pages.

### Price Charts

Uses Recharts with:
- Green fill/stroke for positive trends
- Red fill/stroke for negative trends
- Gradient fills
- Responsive container

---

## 🔧 CSS Variables System

All colors use HSL-based CSS variables for consistency:

```css
:root {
  --background: 0 0% 5%;
  --foreground: 0 0% 98%;
  --card: 0 0% 8%;
  --primary: 250 91% 65%;  /* Purple */
  --border: 0 0% 20%;
  --radius: 0.5rem;
}
```

Use via Tailwind:
```tsx
className="bg-background text-foreground"
className="border-border"
className="bg-primary text-primary-foreground"
```

---

## 📋 Quick Reference Checklist

When creating a new page:

- [ ] Wrap content in appropriate layout (or use `<Layout>`)
- [ ] Include `<InteractiveGrid />` for background
- [ ] Use `bg-black` or `bg-black/40` for backgrounds
- [ ] Use `text-white` for primary text, `text-gray-400` for secondary
- [ ] Apply `font-mono` to all financial data (prices, symbols, percentages)
- [ ] Use `text-purple` for all UI accents and interactive elements
- [ ] Use `text-chartGreen` / `text-chartRed` ONLY for chart data
- [ ] Add `border-white/10` to cards
- [ ] Add `hover:border-purple/50` for interactive cards
- [ ] Use `font-black tracking-tight` for headers
- [ ] Apply `backdrop-blur-sm` to floating elements
- [ ] Add transitions: `transition-all` or `transition-colors`
- [ ] Use `z-10 relative` for content over grid background
- [ ] Include proper responsive classes (`hidden lg:block`, etc.)

---

## 🎨 Example Page Template

```tsx
import { InteractiveGrid } from '@/components/InteractiveGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

export default function NewPage() {
  return (
    <div className="relative space-y-6">
      <InteractiveGrid />
      
      <div className="z-10 relative">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-black text-4xl tracking-tight">
            PAGE <span className="text-gradient-purple">TITLE</span>
          </h1>
          <p className="text-gray-400">
            Page description
          </p>
        </div>

        {/* Content Cards */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-black tracking-tight">
              <TrendingUp className="w-6 h-6 text-purple" />
              SECTION TITLE
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Card content */}
            <div className="font-mono text-white">
              Data here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

---

## 🔗 Configuration Files

**Tailwind Config** (`tailwind.config.js`):
- Custom purple, chartGreen, chartRed colors
- Font families: display (Inter), mono (JetBrains Mono)
- Border radius via CSS variables
- Animations for accordion effects

**Global Styles** (`src/index.css`):
- Google Fonts imports
- CSS variables for color system
- Custom utility classes (.text-gradient-purple, .glow-purple)
- Animation keyframes (fadeIn, slideIn)

**PostCSS** (`postcss.config.js`):
- Standard Tailwind + Autoprefixer setup

---

## 🎯 Color Usage Rules

### Purple (#8B5CF6) - UI Elements ONLY
- ✅ Buttons, links, badges
- ✅ Accents, borders, glows
- ✅ Text highlights and gradients
- ✅ Interactive element hover states
- ✅ Icons and status indicators
- ✅ Headers and section titles
- ✅ Navigation elements
- ✅ Form inputs and controls

### Green (#10B981) & Red (#EF4444) - Chart Data ONLY
- ✅ Price charts (positive = green, negative = red)
- ✅ Performance indicators
- ✅ Price change percentages
- ✅ Market index cards
- ✅ Chart gradients and fills
- ✅ Financial data visualization
- ❌ NEVER use for UI elements, buttons, or navigation

### Black (#0a0a0a) - Backgrounds
- ✅ Main page background
- ✅ Card backgrounds (with opacity)
- ✅ Modal overlays
- ✅ Sidebar backgrounds

---

## 🚀 Getting Started

1. **Import the Layout component** for dashboard pages
2. **Include InteractiveGrid** for the animated background
3. **Follow the color rules** - Purple for UI, Green/Red for charts only
4. **Use the typography system** - Inter for UI, JetBrains Mono for data
5. **Apply the component patterns** from the examples above
6. **Test responsive behavior** with the grid system
7. **Add interactive effects** for better user experience

This guide ensures all future pages maintain the professional, cohesive Wall Street finance platform aesthetic established in the dashboard branch.
