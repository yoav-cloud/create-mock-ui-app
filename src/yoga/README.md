# Yoga Layout Module

Self-contained module for converting and visualizing Cloudinary design rules as Yoga Layout.

## 📁 Structure

```
src/yoga/
├── components/          # React components (small, focused)
│   ├── YogaPreview.jsx             # Main preview component
│   ├── YogaPreview.css             # Preview styles
│   ├── YogaLayerBox.jsx            # Individual layer box
│   ├── YogaBackgroundLayer.jsx     # Background layer component
│   ├── YogaPreviewHeader.jsx       # Header with stats
│   ├── YogaLegend.jsx              # Color legend
│   ├── YogaEmptyState.jsx          # Empty state message
│   ├── YogaLayoutViewer.jsx        # Alternative viewer
│   ├── YogaLayoutViewer.css        # Viewer styles
│   └── index.js                    # Component exports
├── hooks/              # React hooks
│   ├── useYogaLayout.js            # Main Yoga layout hook
│   └── index.js                    # Hook exports
├── utils/              # Pure utility functions
│   ├── yogaLayoutConverter.js      # Core conversion logic
│   ├── scaleCalculator.js          # Scale calculations
│   ├── layerHelpers.js             # Layer utility functions
│   ├── index.js                    # Utility exports
│   ├── README.md                   # API documentation
│   └── ARCHITECTURE.md             # Architecture details
├── index.js            # Main module exports
└── README.md           # This file
```

## 🎯 Design Principles

### 1. **Pure Functions**
All utility functions are pure - same input always produces same output, no side effects.

```javascript
// ✅ Pure function
export const calculateContainerScale = (width, height, maxW, maxH) => {
  return Math.min(maxW / width, maxH / height, 1)
}

// ❌ Avoid impure functions
let globalScale = 1
export const setScale = (width, height) => {
  globalScale = Math.min(800 / width, 600 / height, 1) // Mutates global state
}
```

### 2. **Small, Focused Components**
Each component has a single responsibility.

```javascript
// ✅ Small, focused component
const YogaLegend = () => (
  <div className="yoga-legend">
    <LegendItem type="text" label="Text Layer" />
    <LegendItem type="image" label="Image Layer" />
  </div>
)

// ❌ Avoid large, multi-purpose components
const YogaEverything = () => {
  // 500 lines of mixed concerns...
}
```

### 3. **Easy to Detach**
The entire module can be removed by deleting the `src/yoga` folder and removing a few imports.

### 4. **No External Dependencies**
Uses only React and standard JavaScript - no additional npm packages required.

## 🚀 Usage

### Basic Import

```javascript
import { YogaPreview, useYogaLayout } from '@/yoga'
```

### In a Component

```javascript
import { YogaPreview } from '@/yoga/components'

function MyComponent({ designRules }) {
  return (
    <YogaPreview 
      yogaLayout={yogaLayout.currentDesignYogaLayout}
      designId="parent"
    />
  )
}
```

### Using the Hook

```javascript
import { useYogaLayout } from '@/yoga/hooks'

function MyComponent({ editableRules }) {
  const {
    yogaLayouts,
    currentDesignYogaLayout,
    generateYogaLayouts,
    stats
  } = useYogaLayout(editableRules)
  
  return <div>Total layers: {stats.total}</div>
}
```

## 📦 Components

### YogaPreview
Main visualization component that displays the Yoga layout.

**Props:**
- `yogaLayout` (Object): The Yoga layout to display
- `designId` (String): ID of the design being displayed

**Features:**
- Auto-scaling to fit viewport
- Interactive layer boxes
- Hover tooltips with dimensions
- Color-coded layer types

### YogaLayerBox
Individual layer visualization.

**Props:**
- `layer` (Object): Layer data
- `index` (Number): Layer index

**Features:**
- Shows layer type, name, and details
- Displays dimensions and position on hover
- Color-coded by type (text/image)

### YogaEmptyState
Displayed when no Yoga layout is available.

**Features:**
- Friendly message
- Helpful hint about importing from Figma

## 🛠️ Utilities

### scaleCalculator.js

```javascript
// Calculate optimal scale for container
calculateContainerScale(width, height, maxW, maxH)

// Get scaled dimensions
getScaledDimensions(width, height, scale)
```

### layerHelpers.js

```javascript
// Check layer type
isTextLayer(layer)
isImageLayer(layer)

// Get layer properties
getLayerIcon(layer)
getLayerClassName(layer)
getLayerTitle(layer)

// Format display values
formatTextPreview(text, maxLength)
extractImageFilename(publicId)
```

### yogaLayoutConverter.js

```javascript
// Convert single layer
convertLayerToYogaNode(layerKey, layerData, parentDimensions)

// Convert entire design
convertDesignRulesToYogaLayout(designRules, designId)

// Convert all designs
convertAllDesignRulesToYoga(designRules)

// Export as C-style code
yogaLayoutToString(yogaLayout, indent)
```

## 🎨 Styling

All styles are scoped with `yoga-` prefix to avoid conflicts:

- `.yoga-preview` - Main container
- `.yoga-layer` - Layer box
- `.yoga-layer.text` - Text layer (orange)
- `.yoga-layer.image` - Image layer (purple)
- `.yoga-background` - Background layer (blue)

## 🔧 Customization

### Change Colors

Edit `YogaPreview.css`:

```css
.yoga-layer.text {
  border-color: #your-color;
  background: rgba(your-color, 0.1);
}
```

### Add New Layer Type

1. Add type check in `layerHelpers.js`:
```javascript
export const isVideoLayer = (layer) => layer?.type === 'video'
```

2. Add icon in `getLayerIcon()`:
```javascript
if (isVideoLayer(layer)) return '🎥'
```

3. Add styling in `YogaPreview.css`:
```css
.yoga-layer.video {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
}
```

### Change Viewport Size

Edit `scaleCalculator.js`:

```javascript
export const calculateContainerScale = (
  containerWidth, 
  containerHeight, 
  maxViewportWidth = 1000,  // Change this
  maxViewportHeight = 800   // And this
) => {
  // ...
}
```

## 📊 Performance

- **Pure functions**: Easily memoizable
- **Small components**: Fast re-renders
- **CSS-based**: Hardware accelerated
- **No heavy libraries**: Minimal bundle size

## 🧪 Testing

All utility functions are pure and easy to test:

```javascript
import { calculateContainerScale } from '@/yoga/utils'

test('scales down large containers', () => {
  const scale = calculateContainerScale(2000, 2000, 800, 600)
  expect(scale).toBe(0.3) // 600/2000
})
```

## 🔗 Integration Points

### With DesignPlayground

```javascript
// src/pages/DesignPlayground.jsx
import { useYogaLayout } from '@/yoga/hooks'

const yogaLayoutHook = useYogaLayout(editableRules)
// Pass to context...
```

### With Preview Component

```javascript
// src/pages/playground/Preview.jsx
import { YogaPreview } from '@/yoga/components'

{previewTab === 'yoga' && (
  <YogaPreview 
    yogaLayout={yogaLayout?.currentDesignYogaLayout}
    designId={selectedDesign?.id}
  />
)}
```

## 📝 Adding New Features

### Example: Add Export Button

1. Create component:
```javascript
// src/yoga/components/YogaExportButton.jsx
const YogaExportButton = ({ yogaLayout }) => {
  const handleExport = () => {
    const json = JSON.stringify(yogaLayout, null, 2)
    // Download logic...
  }
  return <button onClick={handleExport}>Export</button>
}
```

2. Export from index:
```javascript
// src/yoga/components/index.js
export { default as YogaExportButton } from './YogaExportButton'
```

3. Use in YogaPreview:
```javascript
import YogaExportButton from './YogaExportButton'

// In YogaPreview component:
<YogaExportButton yogaLayout={yogaLayout} />
```

## 🗑️ Removal

To completely remove this module:

1. Delete the folder:
```bash
rm -rf src/yoga
```

2. Remove imports from:
   - `src/pages/DesignPlayground.jsx`
   - `src/pages/playground/Preview.jsx`

3. Remove the "Yoga" tab from Preview component

That's it! No other dependencies to clean up.

## 📚 Additional Documentation

- [API Reference](./utils/README.md) - Detailed API documentation
- [Architecture](./utils/ARCHITECTURE.md) - System architecture
- [Quick Start](../../YOGA_LAYOUT_QUICK_START.md) - Getting started guide
- [Usage Guide](../../YOGA_LAYOUT_USAGE.md) - Complete usage guide

## 🤝 Contributing

When adding new features:

1. Keep functions pure
2. Keep components small (< 100 lines)
3. Add JSDoc comments
4. Update this README
5. Test with different design sizes

## ⚡ Quick Reference

```javascript
// Import everything
import * as Yoga from '@/yoga'

// Import specific items
import { YogaPreview, useYogaLayout, calculateContainerScale } from '@/yoga'

// Import from submodules
import { YogaPreview } from '@/yoga/components'
import { useYogaLayout } from '@/yoga/hooks'
import { calculateContainerScale } from '@/yoga/utils'
```

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Maintainer**: Self-contained module
