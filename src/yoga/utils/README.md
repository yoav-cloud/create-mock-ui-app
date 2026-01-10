# Yoga Layout Converter

This module converts Cloudinary design rules (from Figma imports or playground designs) into [Yoga Layout](https://yogalayout.com/) representations.

## Overview

Yoga is a cross-platform layout engine that implements Flexbox. This converter takes absolute-positioned layers from Cloudinary designs and converts them into a Yoga-compatible format.

## Usage

### Basic Conversion

```javascript
import { convertDesignRulesToYogaLayout } from '@/utils/yoga'

const designRules = {
  parent: {
    width: 500,
    height: 900,
    backgroundColor: '#000428',
    title: {
      x: 50,
      y: 100,
      fontSize: 48,
      color: '#FFFFFF',
      font: 'Roboto',
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

const yogaLayout = convertDesignRulesToYogaLayout(designRules, 'parent')
console.log(yogaLayout)
```

### Using the Hook

```javascript
import { useYogaLayout } from '@/hooks/useYogaLayout'

function MyComponent() {
  const { 
    yogaLayouts, 
    currentDesignYogaLayout,
    generateYogaLayouts,
    exportYogaLayoutAsJSON,
    exportYogaLayoutAsCStyle,
    stats 
  } = useYogaLayout(editableRules)
  
  // Generate layouts on demand
  useEffect(() => {
    generateYogaLayouts()
  }, [editableRules])
  
  // Access current layout
  console.log('Current layout:', currentDesignYogaLayout)
  console.log('Stats:', stats) // { total: 5, text: 3, image: 2 }
  
  // Export as JSON
  const jsonExport = exportYogaLayoutAsJSON()
  
  // Export as C-style code
  const cStyleExport = exportYogaLayoutAsCStyle()
  
  return <div>...</div>
}
```

## Output Format

### JSON Structure

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
        "height": 60,
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

### C-Style Output

```c
YGNodeStyleSetWidth(root, 500);
YGNodeStyleSetHeight(root, 900);
YGNodeStyleSetFlexDirection(root, YGFlexDirectionColumn);

// Title (text)
const child0 = YGNodeNew();
YGNodeStyleSetPosition(child0, YGEdgeLeft, 50);
YGNodeStyleSetPosition(child0, YGEdgeTop, 100);
YGNodeStyleSetWidth(child0, 400);
YGNodeStyleSetHeight(child0, 60);
YGNodeStyleSetPositionType(child0, YGPositionTypeAbsolute);
// Text properties: "Welcome"
// fontSize: 48, fontFamily: Roboto
YGNodeInsertChild(root, child0, 0);
```

## Features

- **Automatic conversion** from Cloudinary design rules
- **Multiple export formats**: JSON and C-style
- **Layer detection**: Automatically identifies text and image layers
- **Metadata preservation**: Keeps original positioning data
- **Console logging**: Outputs results to console for debugging
- **Memory storage**: Stores layouts in React state for runtime access

## Integration

The Yoga Layout converter is automatically triggered when:

1. **Figma import**: After importing a design from Figma
2. **Design rules change**: When any design rule is modified in the playground
3. **Design switch**: When switching between parent and child designs

Results are:
- ✅ Stored in memory (React state)
- ✅ Logged to console with grouped output
- ✅ Available through the `yogaLayout` property in design context

## API Reference

### `convertDesignRulesToYogaLayout(designRules, designId)`
Converts a single design to Yoga layout format.

**Parameters:**
- `designRules` (Object): The full design rules object
- `designId` (String): The design ID to convert (e.g., 'parent', 'ig-ad')

**Returns:** Object with `container` and `children` properties

---

### `convertAllDesignRulesToYoga(designRules)`
Converts all designs in the rules to Yoga layout format.

**Parameters:**
- `designRules` (Object): The full design rules object

**Returns:** Object with designId keys and Yoga layout values

---

### `yogaLayoutToString(yogaLayout, indent)`
Converts a Yoga layout to C-style code string.

**Parameters:**
- `yogaLayout` (Object): The Yoga layout object
- `indent` (Number): Number of spaces for indentation (default: 0)

**Returns:** String of C-style Yoga code

## Console Output

When generating layouts, the converter outputs to console in this format:

```
🧘 Yoga Layout Generation
  Generated Yoga layouts for all designs:
  Design: parent
    JSON representation: {...}
    C-style syntax:
    YGNodeStyleSetWidth(root, 500);
    ...
```

## Architecture

```
src/
├── utils/
│   └── yoga/
│       ├── yogaLayoutConverter.js  # Core conversion logic
│       ├── index.js                # Public exports
│       └── README.md               # This file
└── hooks/
    └── useYogaLayout.js            # React hook for state management
```

## Notes

- The converter assumes absolute positioning for all layers
- Gravity values are converted to flex alignment properties where applicable
- Text wrapping is preserved if specified in the original design
- Background images are included if present
- Layers are sorted by Y position (top to bottom)

