# Restaurant Menu PWA Admin

React + TypeScript admin dashboard for managing a restaurant menu PWA. It uses Vite 5, Tailwind CSS, reusable UI components, and local in-memory mock data.

## Run Locally

```bash
npm install
npm run dev
```

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Project Structure

- `src/components` reusable layout, form, modal, table, button, and card components
- `src/pages` dashboard, menu items, categories, and settings screens
- `src/types` shared TypeScript models
- `src/data` mock data and navigation metadata
- `src/hooks` admin data context access and dark mode state
- `src/utils` formatting helpers

## Data Storage

Menu items, categories, and restaurant settings start from `src/data/mockData.ts`. At runtime they are copied into React state by `src/components/AdminDataProvider.tsx`, so changes stay in memory only and reset when the page reloads.

## Backend Integration

Replace the state operations in `AdminDataProvider` with API calls or Firebase reads/writes. Keep the same typed methods, such as `addMenuItem`, `updateMenuItem`, `deleteMenuItem`, and `updateSettings`, so the page components do not need major changes.
