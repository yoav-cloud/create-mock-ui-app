# Yoga Layout - Quick Start Guide

## 🚀 What You Need to Know

After importing a Figma design, the system **automatically** converts it to Yoga Layout syntax and:
- ✅ Stores it in memory (React state)
- ✅ Logs it to the browser console
- ✅ Makes it available via the design context

## 📋 How to Use

### Step 1: Import a Design from Figma

1. Click "New" in the Design Playground
2. Select "Start from Figma"
3. Complete the import flow
4. Wait for the design to load

### Step 2: View the Results

**Option A: Browser Console (Easiest)**

Open the browser console and look for:

```
🧘 Yoga Layout Generation
  Generated Yoga layouts for all designs:
  Design: parent
    JSON representation: {...}
    C-style syntax:
    YGNodeStyleSetWidth(root, 500);
    ...
```

**Option B: Access in Code**

```javascript
import { useOutletContext } from 'react-router-dom'

function MyComponent() {
  const { design } = useOutletContext()
  const { yogaLayout } = design
  
  // Get current layout
  console.log(yogaLayout.currentDesignYogaLayout)
  
  // Export as JSON
  const json = yogaLayout.exportYogaLayoutAsJSON()
  console.log(json)
  
  // Export as C-style
  const cStyle = yogaLayout.exportYogaLayoutAsCStyle()
  console.log(cStyle)
}
```

**Option C: Use the Viewer Component**

```javascript
import YogaLayoutViewer from '@/components/YogaLayoutViewer'
import { useOutletContext } from 'react-router-dom'

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

## 📊 What Gets Converted

### Input: Design Rules
```javascript
{
  width: 500,
  height: 900,
  backgroundColor: '#000428',
  title: {
    x: 50,
    y: 100,
    fontSize: 48,
    font: 'Roboto',
    color: '#FFFFFF',
    defaultValue: 'Welcome'
  }
}
```

### Output: Yoga Layout (JSON)
```json
{
  "container": {
    "width": 500,
    "height": 900,
    "backgroundColor": "#000428"
  },
  "children": [
    {
      "key": "title",
      "type": "text",
      "layout": {
        "position": "absolute",
        "top": 100,
        "left": 50
      },
      "text": {
        "content": "Welcome",
        "fontSize": 48,
        "fontFamily": "Roboto"
      }
    }
  ]
}
```

### Output: Yoga Layout (C-Style)
```c
YGNodeStyleSetWidth(root, 500);
YGNodeStyleSetHeight(root, 900);

const child0 = YGNodeNew();
YGNodeStyleSetPosition(child0, YGEdgeLeft, 50);
YGNodeStyleSetPosition(child0, YGEdgeTop, 100);
YGNodeInsertChild(root, child0, 0);
```

## 🎯 Common Use Cases

### Get Statistics
```javascript
const { yogaLayout } = design
console.log(yogaLayout.stats)
// { total: 5, text: 3, image: 2 }
```

### Get Layout for Specific Design
```javascript
const igAdLayout = yogaLayout.getYogaLayoutForDesign('ig-ad')
console.log(igAdLayout)
```

### Export for External Use
```javascript
// Get JSON string
const jsonString = yogaLayout.exportYogaLayoutAsJSON()

// Get C-style code
const cCode = yogaLayout.exportYogaLayoutAsCStyle()

// Copy to clipboard
navigator.clipboard.writeText(jsonString)
```

## 🔧 Where to Find Things

- **Core Logic**: `src/utils/yoga/yogaLayoutConverter.js`
- **React Hook**: `src/hooks/useYogaLayout.js`
- **Viewer Component**: `src/components/YogaLayoutViewer.jsx`
- **Integration**: `src/pages/DesignPlayground.jsx`

## 📚 Documentation

- **Quick Start**: This file
- **Usage Guide**: `YOGA_LAYOUT_USAGE.md`
- **Implementation Details**: `YOGA_LAYOUT_IMPLEMENTATION.md`
- **API Reference**: `src/utils/yoga/README.md`

## ⚡ That's It!

The system works automatically. Just import a Figma design and check the console!

