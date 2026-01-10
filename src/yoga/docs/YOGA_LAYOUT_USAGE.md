# Yoga Layout Integration - Usage Guide

## Overview

The Yoga Layout integration automatically converts Figma-imported designs into Yoga Layout syntax. This functionality is self-contained, maintainable, and easy to detach from the rest of the codebase.

## What Happens After Figma Import

1. **Import Design from Figma**: User imports a design through the Figma Import Modal
2. **Design Rules Created**: The import process creates design rules with layers, positions, and styling
3. **Yoga Layout Generation**: Automatically triggered after import
4. **Storage**: Yoga layout is stored in memory (React state)
5. **Console Output**: Results are logged to the browser console

## Viewing the Results

### In Browser Console

After importing a Figma design, open the browser console to see:

```
🧘 Yoga Layout Generation
  Generated Yoga layouts for all designs:
  Design: parent
    JSON representation: {...}
    C-style syntax:
    YGNodeStyleSetWidth(root, 500);
    YGNodeStyleSetHeight(root, 900);
    ...
```

### Accessing in Code

The Yoga Layout is available through the design context:

```javascript
// In any component within DesignPlayground
import { useOutletContext } from 'react-router-dom'

function MyComponent() {
  const { design } = useOutletContext()
  const { yogaLayout } = design
  
  // Access current design's Yoga layout
  console.log(yogaLayout.currentDesignYogaLayout)
  
  // Get layout for a specific design
  const igAdLayout = yogaLayout.getYogaLayoutForDesign('ig-ad')
  
  // Export as JSON string
  const jsonExport = yogaLayout.exportYogaLayoutAsJSON()
  
  // Export as C-style code
  const cStyleExport = yogaLayout.exportYogaLayoutAsCStyle()
  
  // Get statistics
  console.log(yogaLayout.stats)
  // { total: 5, text: 3, image: 2 }
}
```

## Using the YogaLayoutViewer Component

A viewer component is provided for easy visualization:

```javascript
import YogaLayoutViewer from '@/components/YogaLayoutViewer'
import { useOutletContext } from 'react-router-dom'

function MyPage() {
  const { design } = useOutletContext()
  const { yogaLayout, selectedDesign } = design
  
  return (
    <div>
      <h2>Current Design Yoga Layout</h2>
      <YogaLayoutViewer 
        yogaLayout={yogaLayout.currentDesignYogaLayout}
        designId={selectedDesign.id}
      />
    </div>
  )
}
```

The viewer provides three views:
- **Tree View**: Visual hierarchy of the layout
- **JSON View**: Complete JSON representation
- **Stats View**: Quick statistics about the layout

## File Structure

All Yoga Layout code is isolated in these files:

```
src/
├── utils/
│   └── yoga/
│       ├── yogaLayoutConverter.js   # Core conversion logic
│       ├── index.js                  # Public exports
│       └── README.md                 # Documentation
├── hooks/
│   └── useYogaLayout.js              # React hook
└── components/
    ├── YogaLayoutViewer.jsx          # Optional viewer component
    └── YogaLayoutViewer.css          # Viewer styles
```

## Detaching the Functionality

To remove or detach the Yoga Layout integration:

1. **Remove the hook usage** from `DesignPlayground.jsx`:
   - Remove the `import { useYogaLayout }` line
   - Remove the `yogaLayoutHook` initialization
   - Remove the two useEffect hooks that call `generateYogaLayouts()` and `switchDesign()`
   - Remove `yogaLayout: yogaLayoutHook` from the designContext object
   - Remove the Yoga layout generation call from `handleTemplateImported`

2. **Delete the files**:
   ```bash
   rm -rf src/utils/yoga/
   rm src/hooks/useYogaLayout.js
   rm src/components/YogaLayoutViewer.jsx
   rm src/components/YogaLayoutViewer.css
   ```

## Example Output

### JSON Format

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
        "width": 400,
        "height": 80,
        "top": 100,
        "left": 50
      },
      "text": {
        "content": "New Arrivals",
        "fontSize": 48,
        "fontFamily": "Roboto",
        "color": "#FFFFFF",
        "fieldName": "title"
      }
    }
  ]
}
```

### C-Style Format

```c
YGNodeStyleSetWidth(root, 500);
YGNodeStyleSetHeight(root, 900);
YGNodeStyleSetFlexDirection(root, YGFlexDirectionColumn);

// Title (text)
const child0 = YGNodeNew();
YGNodeStyleSetPosition(child0, YGEdgeLeft, 50);
YGNodeStyleSetPosition(child0, YGEdgeTop, 100);
YGNodeStyleSetWidth(child0, 400);
YGNodeStyleSetHeight(child0, 80);
YGNodeStyleSetPositionType(child0, YGPositionTypeAbsolute);
// Text properties: "New Arrivals"
// fontSize: 48, fontFamily: Roboto
YGNodeInsertChild(root, child0, 0);
```

## Testing

To test the functionality:

1. Start the development server
2. Navigate to the Design Playground
3. Click "New" → "Start from Figma"
4. Complete the Figma import flow
5. Check the browser console for Yoga Layout output
6. Access `window` in console and explore the Yoga layouts

## API Reference

See the detailed API documentation in `src/utils/yoga/README.md`.

## Notes

- The conversion happens automatically on import and whenever design rules change
- All conversions are logged to console for debugging
- The data is stored in React state, not persisted to localStorage
- The converter preserves all layer metadata including original positions
- Layouts are sorted by Y position (top to bottom)
- Text wrapping information is preserved
- Background images are included in the output

## Support

For issues or questions about the Yoga Layout integration, check:
- `src/utils/yoga/README.md` - Detailed API documentation
- Browser console - Conversion results and any errors
- React DevTools - Inspect the yogaLayout state

