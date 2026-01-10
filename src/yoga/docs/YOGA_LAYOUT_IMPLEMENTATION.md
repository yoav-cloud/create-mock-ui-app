# Yoga Layout Implementation Summary

## ✅ Implementation Complete

A complete Yoga Layout conversion system has been implemented for Figma-imported designs in the playground editor.

## What Was Built

### 1. Core Conversion Logic (`src/utils/yoga/yogaLayoutConverter.js`)

Pure functions that convert Cloudinary design rules to Yoga Layout format:

- `convertLayerToYogaNode()` - Converts individual layers
- `convertDesignRulesToYogaLayout()` - Converts a complete design
- `convertAllDesignRulesToYoga()` - Converts all designs at once
- `yogaLayoutToString()` - Generates C-style Yoga code

**Key Features:**
- Handles both text and image layers
- Preserves positioning, sizing, and styling information
- Converts gravity values to flex alignment
- Maintains metadata about original properties
- Sorts layers by Y position (top to bottom)

### 2. React Hook (`src/hooks/useYogaLayout.js`)

State management and utilities for working with Yoga layouts:

```javascript
const {
  yogaLayouts,              // All generated layouts
  currentDesignYogaLayout,  // Current design's layout
  generateYogaLayouts,      // Trigger generation
  getYogaLayoutForDesign,   // Get specific design
  switchDesign,             // Switch active design
  exportYogaLayoutAsJSON,   // Export as JSON string
  exportYogaLayoutAsCStyle, // Export as C-style code
  stats                     // { total, text, image }
} = useYogaLayout(editableRules)
```

### 3. Viewer Component (`src/components/YogaLayoutViewer.jsx`)

Optional UI component for visualizing Yoga layouts with three views:
- **Tree View**: Visual hierarchy
- **JSON View**: Complete JSON representation
- **Stats View**: Quick statistics

### 4. Integration (`src/pages/DesignPlayground.jsx`)

Automatic generation triggered by:
- Figma design import
- Design rules changes
- Design switching

The Yoga layout is exposed through the design context for easy access.

## How It Works

### Flow Diagram

```
Figma Import → Design Rules Created → Yoga Layout Generated
                                    ↓
                            Stored in Memory (React State)
                                    ↓
                            Logged to Console
                                    ↓
                            Available via Context
```

### Example Input (Design Rules)

```javascript
{
  parent: {
    width: 500,
    height: 900,
    backgroundColor: '#000428',
    title: {
      x: 50,
      y: 100,
      fontSize: 48,
      font: 'Roboto',
      color: '#FFFFFF',
      fieldName: 'title',
      defaultValue: 'Welcome'
    },
    product: {
      x: 100,
      y: 300,
      width: 300,
      height: 300,
      publicId: 'products/shoe-1',
      isMainProduct: true
    }
  }
}
```

### Example Output (Yoga Layout)

**JSON Format:**
```json
{
  "container": {
    "width": 500,
    "height": 900,
    "backgroundColor": "#000428",
    "flexDirection": "column",
    "position": "relative"
  },
  "children": [
    {
      "key": "title",
      "type": "text",
      "displayName": "Title",
      "layout": {
        "position": "absolute",
        "width": 0,
        "height": 0,
        "top": 100,
        "left": 50
      },
      "text": {
        "content": "Welcome",
        "fontSize": 48,
        "fontFamily": "Roboto",
        "color": "#FFFFFF",
        "fieldName": "title"
      },
      "metadata": {
        "originalX": 50,
        "originalY": 100,
        "originalGravity": "north_west"
      }
    }
  ]
}
```

**C-Style Format:**
```c
YGNodeStyleSetWidth(root, 500);
YGNodeStyleSetHeight(root, 900);
YGNodeStyleSetFlexDirection(root, YGFlexDirectionColumn);

// Title (text)
const child0 = YGNodeNew();
YGNodeStyleSetPosition(child0, YGEdgeLeft, 50);
YGNodeStyleSetPosition(child0, YGEdgeTop, 100);
YGNodeStyleSetWidth(child0, 0);
YGNodeStyleSetHeight(child0, 0);
YGNodeStyleSetPositionType(child0, YGPositionTypeAbsolute);
// Text properties: "Welcome"
// fontSize: 48, fontFamily: Roboto
YGNodeInsertChild(root, child0, 0);
```

## File Structure

```
src/
├── utils/
│   └── yoga/
│       ├── yogaLayoutConverter.js   # Core conversion logic (pure functions)
│       ├── index.js                  # Public exports
│       └── README.md                 # API documentation
├── hooks/
│   └── useYogaLayout.js              # React hook for state management
├── components/
│   ├── YogaLayoutViewer.jsx          # Optional viewer component
│   └── YogaLayoutViewer.css          # Viewer styles
└── pages/
    └── DesignPlayground.jsx          # Integration point

Documentation:
├── YOGA_LAYOUT_USAGE.md              # User guide
└── YOGA_LAYOUT_IMPLEMENTATION.md     # This file
```

## Usage

### Viewing Results After Import

1. Import a design from Figma
2. Open browser console
3. Look for the `🧘 Yoga Layout Generation` log group
4. Expand to see JSON and C-style representations

### Accessing in Code

```javascript
// In any component within DesignPlayground
import { useOutletContext } from 'react-router-dom'

function MyComponent() {
  const { design } = useOutletContext()
  const { yogaLayout } = design
  
  // Current layout
  console.log(yogaLayout.currentDesignYogaLayout)
  
  // Get specific design
  const layout = yogaLayout.getYogaLayoutForDesign('ig-ad')
  
  // Export formats
  const json = yogaLayout.exportYogaLayoutAsJSON()
  const cStyle = yogaLayout.exportYogaLayoutAsCStyle()
  
  // Statistics
  console.log(yogaLayout.stats)
}
```

### Using the Viewer Component

```javascript
import YogaLayoutViewer from '@/components/YogaLayoutViewer'

function MyPage() {
  const { design } = useOutletContext()
  
  return (
    <YogaLayoutViewer 
      yogaLayout={design.yogaLayout.currentDesignYogaLayout}
      designId={design.selectedDesign.id}
    />
  )
}
```

## Design Principles

### 1. Self-Contained
- All Yoga-related code is in dedicated directories
- No scattered dependencies across the codebase
- Clear separation of concerns

### 2. Pure Functions
- Core conversion logic uses pure functions
- Easy to test and reason about
- No side effects in conversion logic

### 3. Easy to Detach
- Remove 5 lines from DesignPlayground.jsx
- Delete 3 directories
- No breaking changes to other features

### 4. Memory-Only Storage
- Results stored in React state
- Not persisted to localStorage
- Regenerated on demand

### 5. Console-First Output
- Primary output is to console
- Grouped, formatted logs
- Easy to inspect and debug

## Maintenance

### Adding New Layer Types

Edit `yogaLayoutConverter.js`:

```javascript
// Add new type detection
export const isNewLayerType = (layerData) => {
  return layerData && typeof layerData === 'object' && 'newProperty' in layerData
}

// Handle in convertLayerToYogaNode
if (isNewLayerType(layerData)) {
  yogaNode.newType = {
    // ... properties
  }
}
```

### Modifying Output Format

Edit `yogaLayoutToString()` in `yogaLayoutConverter.js` to change C-style output format.

### Adding New Export Formats

Add new methods to `useYogaLayout.js`:

```javascript
const exportYogaLayoutAsSwift = useCallback((designId) => {
  const layout = designId ? getYogaLayoutForDesign(designId) : currentDesignYogaLayout
  if (!layout) return null
  
  // Convert to Swift syntax
  return swiftFormatter(layout)
}, [getYogaLayoutForDesign, currentDesignYogaLayout])
```

## Testing

Manual testing workflow:

1. Start dev server: `pnpm start`
2. Navigate to Design Playground
3. Click "New" → "Start from Figma"
4. Complete Figma import
5. Check browser console for output
6. Verify JSON structure
7. Verify C-style code generation

## Future Enhancements

Potential improvements (not implemented):

- [ ] Export to file (download JSON/C code)
- [ ] Visual diff between designs
- [ ] Yoga layout validation
- [ ] Performance metrics
- [ ] Undo/redo for layout changes
- [ ] Layout templates library
- [ ] Integration with Yoga Playground
- [ ] TypeScript definitions
- [ ] Unit tests (requires test framework setup)

## Notes

- The converter assumes absolute positioning for all layers
- Text layers without explicit width/height get 0 dimensions (Yoga will auto-size)
- Image layers must have explicit dimensions
- Background images are included in the container
- Layers are sorted by Y position (top to bottom)
- Gravity values are converted to flex alignment where applicable
- All metadata is preserved for reference

## Support

For questions or issues:

1. Check `src/utils/yoga/README.md` for API details
2. Check `YOGA_LAYOUT_USAGE.md` for usage examples
3. Inspect browser console for conversion results
4. Use React DevTools to inspect yogaLayout state

## Credits

- **Yoga Layout**: Facebook's cross-platform layout engine
- **Implementation**: Self-contained, maintainable, detachable design
- **Integration**: Automatic generation on Figma import

