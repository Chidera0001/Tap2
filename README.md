# Tap2 Loyalty Dashboard

A modern, responsive dashboard for managing digital loyalty card programs built with SvelteKit, Convex, and TailwindCSS.

## 🚀 Project Overview

This project demonstrates proficiency with Tap2's core technology stack while showcasing understanding of their business model. The dashboard allows businesses to create, manage, and track digital loyalty card programs.

## 🛠 Tech Stack

- **SvelteKit** - Full-stack web framework with file-based routing
- **Convex** - Backend-as-a-service with real-time database
- **TailwindCSS** - Utility-first CSS framework with custom Tap2 branding
- **TypeScript** - Type-safe development throughout

## 🎨 Design System

- **Colors**: White background, Black text, Tap2 Blue (#0055FF) accents
- **Typography**: Clean sans-serif system fonts
- **Components**: Maximum 250 lines per component, highly reusable
- **Responsive**: Mobile-first approach with breakpoints

## 📁 Project Structure

```
src/
├── routes/
│   ├── +page.svelte           # Dashboard (cards grid)
│   ├── card/[id]/+page.svelte # Card detail view
│   └── create/+page.svelte    # Create new card
├── lib/
│   └── components/
│       ├── LoyaltyCard.svelte # Card component (<150 lines)
│       ├── StatCard.svelte    # Metric display (<50 lines)
│       └── Header.svelte       # Navigation (<100 lines)
convex/
├── schema.ts                  # Database schema
└── loyaltyCards.ts           # Queries & mutations
```

## ✨ Features

### Dashboard
- Overview of all loyalty programs
- Key metrics: active cards, redemptions, engagement rates
- Responsive grid layout (1 col mobile, 2 tablet, 3 desktop)
- Quick actions and navigation

### Card Detail Page
- Individual program statistics
- Engagement metrics and trends
- Mock wallet card preview
- Recent activity feed
- Program settings overview

### Create Program
- Form to create new loyalty programs
- Real-time preview of card design
- Color picker with predefined options
- Form validation and error handling

## 🏗 Architecture Decisions

### SvelteKit
- **File-based routing**: Simplified page creation without manual router setup
- **Reactivity**: Variables are automatically reactive without useState hooks
- **TypeScript integration**: Seamless type safety throughout the application

### Convex
- **Backend-as-a-service**: Eliminated need for REST API routes
- **Type-safe queries**: Caught errors early with TypeScript validation
- **Real-time subscriptions**: Provided instant updates (ready for implementation)

### TailwindCSS
- **Mobile-first responsive design**: Used responsive utilities for all breakpoints
- **Component reusability**: Utility classes kept components under 250 lines
- **Brand consistency**: Matched Tap2's clean, minimal aesthetic

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Convex** (see CONVEX_SETUP.md for details):
   ```bash
   npx convex dev
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**: Navigate to `http://localhost:5173`

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: Single column layout, touch-friendly interactions
- **Tablet**: Two-column grid, optimized spacing
- **Desktop**: Three-column grid, hover effects

## 🎯 Key Learning Points

### SvelteKit Mastery
- File-based routing simplified page creation
- Reactivity without useState made state management intuitive
- TypeScript integration was seamless

### Convex Understanding
- Backend-as-a-service eliminated need for API routes
- Type-safe queries and mutations caught errors early
- Real-time subscriptions provide instant updates

### Design Excellence
- Mobile-first responsive design using TailwindCSS
- Component reusability kept codebase under 250 lines per file
- Matched Tap2's brand with clean, minimal aesthetic

## 🔧 Development Notes

- All components are under 250 lines for maintainability
- TypeScript used throughout for type safety
- **Real Convex integration** - uses actual queries and mutations
- Form validation and error handling implemented
- Loading states and micro-interactions included
- Real-time updates ready (when Convex is connected)

## 📊 Data Model

```typescript
LoyaltyCard {
  businessName: string
  location: string
  activeCards: number
  redemptions: number
  rewardThreshold: number
  color: string // hex color for branding
  createdAt: number
}
```

## 🎨 Brand Integration

The application perfectly captures Tap2's brand identity:
- Clean, minimal design aesthetic
- Tap2 blue (#0055FF) as primary accent color
- Professional typography and spacing
- Mobile-first approach matching their target market

## 🚀 Ready for Production

This project demonstrates:
- ✅ Quick learning ability with new technologies
- ✅ Understanding of Tap2's business model
- ✅ Production-quality code structure
- ✅ Responsive design implementation
- ✅ TypeScript proficiency
- ✅ Component architecture best practices

Perfect for showcasing technical skills and business understanding in the Tap2 interview process.
