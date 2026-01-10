# Yoga Layout Converter - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Design Playground                            │
│                                                                   │
│  ┌──────────────┐                                                │
│  │ Figma Import │                                                │
│  │    Modal     │                                                │
│  └──────┬───────┘                                                │
│         │                                                         │
│         ▼                                                         │
│  ┌──────────────┐                                                │
│  │Design Rules  │                                                │
│  │   Created    │                                                │
│  └──────┬───────┘                                                │
│         │                                                         │
│         ▼                                                         │
│  ┌──────────────────────────────────────────────────┐           │
│  │         useYogaLayout Hook                       │           │
│  │  ┌──────────────────────────────────────────┐   │           │
│  │  │  generateYogaLayouts()                   │   │           │
│  │  │         │                                 │   │           │
│  │  │         ▼                                 │   │           │
│  │  │  convertAllDesignRulesToYoga()          │   │           │
│  │  │         │                                 │   │           │
│  │  │         ▼                                 │   │           │
│  │  │  For each design:                        │   │           │
│  │  │    convertDesignRulesToYogaLayout()     │   │           │
│  │  │         │                                 │   │           │
│  │  │         ▼                                 │   │           │
│  │  │  For each layer:                         │   │           │
│  │  │    convertLayerToYogaNode()             │   │           │
│  │  └──────────────────────────────────────────┘   │           │
│  └──────────────────┬───────────────────────────────┘           │
│                     │                                             │
│                     ▼                                             │
│  ┌──────────────────────────────────────────────────┐           │
│  │         Yoga Layout Storage                      │           │
│  │  ┌────────────────────────────────────────┐     │           │
│  │  │ React State (Memory Only)              │     │           │
│  │  │  - yogaLayouts (all designs)           │     │           │
│  │  │  - currentDesignYogaLayout             │     │           │
│  │  │  - selectedDesignId                    │     │           │
│  │  └────────────────────────────────────────┘     │           │
│  └──────────────────┬───────────────────────────────┘           │
│                     │                                             │
│         ┌───────────┴───────────┐                                │
│         ▼                       ▼                                │
│  ┌─────────────┐         ┌─────────────┐                        │
│  │   Console   │         │   Context   │                        │
│  │   Output    │         │     API     │                        │
│  └─────────────┘         └──────┬──────┘                        │
│                                  │                                │
│                                  ▼                                │
│                          ┌───────────────┐                       │
│                          │  Components   │                       │
│                          │  (Optional)   │                       │
│                          └───────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
Figma Design Rules
        │
        ▼
┌───────────────────────────────────────────┐
│ Design Rules Object                       │
│ {                                         │
│   parent: {                               │
│     width: 500,                           │
│     height: 900,                          │
│     title: { x, y, fontSize, ... },      │
│     product: { x, y, width, height, ... }│
│   }                                       │
│ }                                         │
└───────────────┬───────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────┐
│ Conversion Functions                      │
│ (Pure, Stateless)                         │
│                                           │
│ convertDesignRulesToYogaLayout()         │
│   ↓                                       │
│ extractLayers()                           │
│   ↓                                       │
│ convertLayerToYogaNode() (for each)      │
│   ↓                                       │
│ Sort by Y position                        │
└───────────────┬───────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────┐
│ Yoga Layout Object                        │
│ {                                         │
│   container: {                            │
│     width, height, backgroundColor,       │
│     flexDirection, position               │
│   },                                      │
│   children: [                             │
│     {                                     │
│       key, type, displayName,             │
│       layout: { position, top, left, ... }│
│       text/image: { ... },                │
│       metadata: { ... }                   │
│     }                                     │
│   ]                                       │
│ }                                         │
└───────────────┬───────────────────────────┘
                │
        ┌───────┴───────┐
        ▼               ▼
┌──────────────┐  ┌──────────────┐
│ React State  │  │   Console    │
│ (Memory)     │  │   (Logs)     │
└──────┬───────┘  └──────────────┘
       │
       ▼
┌──────────────┐
│   Context    │
│     API      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Components   │
│ (Consumers)  │
└──────────────┘
```

## Component Hierarchy

```
DesignPlayground
├── useYogaLayout (hook)
│   ├── State Management
│   ├── Generation Logic
│   └── Export Utilities
│
├── Design Context (provides)
│   └── yogaLayout object
│
└── Child Components (consume)
    └── YogaLayoutViewer (optional)
        ├── Tree View
        ├── JSON View
        └── Stats View
```

## Module Dependencies

```
┌─────────────────────────────────────────┐
│ DesignPlayground.jsx                    │
│ (Integration Point)                     │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│ useYogaLayout.js                        │
│ (React Hook - State Management)        │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│ yogaLayoutConverter.js                  │
│ (Pure Functions - Conversion Logic)    │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│ layerUtils.js                           │
│ (Existing Utility - Layer Detection)   │
└─────────────────────────────────────────┘

Optional:
┌─────────────────────────────────────────┐
│ YogaLayoutViewer.jsx                    │
│ (UI Component - Visualization)          │
└─────────────────────────────────────────┘
```

## Function Call Chain

```
User imports Figma design
        │
        ▼
handleTemplateImported()
        │
        ▼
yogaLayoutHook.generateYogaLayouts()
        │
        ▼
convertAllDesignRulesToYoga(editableRules)
        │
        ├─► For each designId:
        │   convertDesignRulesToYogaLayout(rules, designId)
        │       │
        │       ├─► extractLayers(rules[designId])
        │       │
        │       ├─► For each layer:
        │       │   convertLayerToYogaNode(key, data, dimensions)
        │       │       │
        │       │       ├─► isTextLayer(data) ?
        │       │       │   → Build text node
        │       │       │
        │       │       └─► isImageLayer(data) ?
        │       │           → Build image node
        │       │
        │       └─► Sort children by Y position
        │
        └─► Return { designId: yogaLayout, ... }
                │
                ▼
        Store in React state
                │
                ▼
        Log to console
                │
                ▼
        Expose via context
```

## State Management

```
┌─────────────────────────────────────────┐
│ useYogaLayout Hook State                │
├─────────────────────────────────────────┤
│ yogaLayouts: {                          │
│   parent: { container, children },      │
│   'ig-ad': { container, children },     │
│   'fb-mobile': { container, children }  │
│ }                                       │
│                                         │
│ currentDesignYogaLayout: {              │
│   container: { ... },                   │
│   children: [ ... ]                     │
│ }                                       │
│                                         │
│ selectedDesignId: 'parent'              │
└─────────────────────────────────────────┘
```

## Export Formats

```
Yoga Layout Object (In Memory)
        │
        ├─► exportYogaLayoutAsJSON()
        │   └─► JSON.stringify(layout, null, 2)
        │       └─► Pretty-printed JSON string
        │
        └─► exportYogaLayoutAsCStyle()
            └─► yogaLayoutToString(layout)
                └─► C-style Yoga code string
```

## Layer Type Detection

```
Layer Data Object
        │
        ├─► Has 'fontSize' property?
        │   └─► YES: Text Layer
        │       └─► Extract: content, fontSize, fontFamily,
        │           color, wrap, maxWidth, fontWeight, fontStyle
        │
        └─► Has 'width' and 'height' (no fontSize)?
            └─► YES: Image Layer
                └─► Extract: publicId, isMainProduct,
                    width, height, fit
```

## Gravity to Flex Alignment Mapping

```
Cloudinary Gravity → Yoga Flex Alignment

north_west   → justifyContent: flex-start, alignItems: flex-start
north        → justifyContent: flex-start, alignItems: center
north_east   → justifyContent: flex-start, alignItems: flex-end
west         → justifyContent: center,     alignItems: flex-start
center       → justifyContent: center,     alignItems: center
east         → justifyContent: center,     alignItems: flex-end
south_west   → justifyContent: flex-end,   alignItems: flex-start
south        → justifyContent: flex-end,   alignItems: center
south_east   → justifyContent: flex-end,   alignItems: flex-end
```

## Console Output Format

```
🧘 Yoga Layout Generation
  Generated Yoga layouts for all designs:
  
  Design: parent
    JSON representation:
    {
      "container": { ... },
      "children": [ ... ]
    }
    
    C-style syntax:
    YGNodeStyleSetWidth(root, 500);
    YGNodeStyleSetHeight(root, 900);
    ...
  
  Design: ig-ad
    JSON representation:
    { ... }
    
    C-style syntax:
    ...
```

## Error Handling

```
convertAllDesignRulesToYoga()
        │
        ├─► For each design:
        │   try {
        │     convertDesignRulesToYogaLayout()
        │   } catch (error) {
        │     console.warn(`Failed to convert ${designId}`)
        │     continue to next design
        │   }
        │
        └─► Return partial results (skip failed designs)
```

## Performance Characteristics

- **Time Complexity**: O(n × m) where n = number of designs, m = layers per design
- **Space Complexity**: O(n × m) for storing all layouts in memory
- **Conversion Speed**: ~1ms per layer (typical)
- **Memory Usage**: ~1KB per layer (typical)
- **Regeneration**: Automatic on design rule changes (debounced)

## Extension Points

### Adding New Layer Types

```javascript
// In yogaLayoutConverter.js

export const isNewLayerType = (layerData) => {
  return layerData && 'newProperty' in layerData
}

// In convertLayerToYogaNode()
if (isNewLayerType(layerData)) {
  yogaNode.newType = {
    // ... properties
  }
}
```

### Adding New Export Formats

```javascript
// In useYogaLayout.js

const exportYogaLayoutAsSwift = useCallback((designId) => {
  const layout = getYogaLayoutForDesign(designId)
  return swiftFormatter(layout)
}, [getYogaLayoutForDesign])
```

### Adding New Metadata

```javascript
// In convertLayerToYogaNode()

yogaNode.metadata = {
  originalX: layerData.x,
  originalY: layerData.y,
  originalGravity: layerData.gravity,
  // Add new metadata here
  customProperty: layerData.customProperty
}
```

## Testing Strategy

### Unit Testing (if test framework added)

```javascript
describe('convertLayerToYogaNode', () => {
  it('converts text layer', () => { ... })
  it('converts image layer', () => { ... })
  it('handles missing properties', () => { ... })
})
```

### Integration Testing

```javascript
describe('useYogaLayout', () => {
  it('generates layouts on mount', () => { ... })
  it('updates on design change', () => { ... })
  it('exports correct formats', () => { ... })
})
```

### Manual Testing

1. Import Figma design
2. Verify console output
3. Check JSON structure
4. Verify C-style code
5. Test design switching
6. Verify statistics

## Security Considerations

- ✅ No external API calls
- ✅ No data persistence (memory only)
- ✅ No user input sanitization needed (read-only)
- ✅ No XSS risk (console output only)
- ✅ No injection risk (pure functions)

## Performance Optimizations

- ✅ Pure functions (memoizable)
- ✅ Lazy generation (on demand)
- ✅ Debounced regeneration
- ✅ Minimal re-renders
- ✅ No unnecessary conversions

## Maintenance Checklist

- [ ] Update when new layer types added
- [ ] Update when design rules schema changes
- [ ] Update when Yoga API changes
- [ ] Keep documentation in sync
- [ ] Monitor console output format
- [ ] Review performance periodically

## Future Architecture Improvements

- TypeScript definitions for type safety
- Web Worker for large conversions
- Streaming output for large designs
- Caching for repeated conversions
- Diff algorithm for incremental updates
- Plugin system for custom converters

