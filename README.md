# Cloudinary Create - Mock UI App

A client-side only React application for exploring the Cloudinary Create product concept. This is a mock application that simulates full interactivity without requiring a backend or API.

## Getting Started

### Install Dependencies
```bash
pnpm install
```

### Run Development Server
```bash
pnpm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
pnpm run build
```

## Project Structure

```
src/
  ├── components/       # Reusable UI components
  ├── pages/           # Page components
  ├── data/            # Mock JSON data files
  ├── App.jsx          # Main app component with routing
  ├── main.jsx         # Entry point
  └── index.css        # Global styles
```

## Current Pages

- **Projects Index** (`/`) - Home page displaying projects and designs

## Mock Data

All data is stored in JSON files in the `src/data/` directory. The structure can be expanded based on the database entities defined in the product specification.

## Design Principles

- Clean and airy design
- Modern, polished UI
- Fully interactive feel without backend
- Responsive layout

