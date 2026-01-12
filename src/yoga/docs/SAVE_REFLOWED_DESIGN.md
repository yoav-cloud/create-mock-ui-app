# Save Reflowed Design Feature

## Overview

The Yoga Preview now includes the ability to **save reflowed layouts as new sub-designs** in the playground. This allows you to:
1. Reflow a design to a new banner size
2. Save it as a new sub-design
3. Generate Cloudinary URLs for the reflowed layout
4. Switch between designs in the Design Selector

## How to Use

### Step 1: Reflow to a Banner Size
1. Navigate to the **Yoga** tab in the playground
2. Click any banner size button (e.g., "Leaderboard 728×90")
3. The layout will reflow intelligently using Yoga engine

### Step 2: Save as Sub-Design
1. After reflowing, a **"💾 Save as Sub-Design"** button appears
2. Click the button
3. A success message confirms the save
4. The new design appears in the **Design Selector** dropdown

### Step 3: Use the New Design
1. Select the new design from the Design Selector
2. The Cloudinary URL is automatically generated
3. You can modify it further in the Rules panel
4. Generate variations using the Controls panel

## What Happens When You Save

### 1. Yoga Layout → Design Rules Conversion
The reflowed Yoga layout is converted back to playground design rules format:

```javascript
// Yoga layout (absolute positioning)
{
  container: { width: 728, height: 90 },
  children: [{
    key: 'logo',
    layout: { left: 10, top: 5, width: 80, height: 80 },
    type: 'image'
  }]
}

// Converts to ↓

// Design rules (gravity-based)
{
  width: 728,
  height: 90,
  logo: {
    x: 10,
    y: 5,
    width: 80,
    height: 80,
    gravity: 'north_west'
  }
}
```

### 2. Position Conversion
Absolute positions are intelligently converted back to gravity-based coordinates:

- **Closest edge detection**: Finds which edge (north/south/east/west) the layer is closest to
- **Gravity calculation**: Converts to Cloudinary gravity format
- **Offset calculation**: Calculates x/y offsets from that edge

### 3. Design Type Creation
A new design type entry is created:

```javascript
{
  id: 'leaderboard-1736690123456',  // Unique timestamped ID
  name: 'Leaderboard (728×90)',
  width: 728,
  height: 90,
  description: 'Reflowed from parent to Leaderboard format',
  isReflowed: true,
  sourceDesign: 'parent',
  reflowDate: '2026-01-12T...'
}
```

### 4. Cloudinary URL Generation
The saved design can immediately generate Cloudinary URLs using the existing `buildCloudinaryTransform` function.

## Technical Implementation

### Key Files

**Converter** (`src/yoga/utils/yogaToDesignRules.js`):
- `yogaLayoutToDesignRules()` - Converts yoga layout to design rules
- `createDesignType()` - Creates design type metadata
- `convertAbsoluteToGravity()` - Converts absolute positions to gravity-based

**UI** (`src/yoga/components/BannerSizeButtons.jsx`):
- Added "Save as Sub-Design" button
- Styled with green accent color
- Appears only when a reflow is active

**Integration** (`src/yoga/components/YogaPreview.jsx`):
- `handleSaveAsSubDesign()` - Save handler
- Receives `setEditableRules` and `setDesignTypes` from context
- Generates preview URL using `buildDesignPreviewUrl`

### Data Flow

```
1. User clicks "Leaderboard" button
   ↓
2. reflowYogaLayout(originalLayout, 728, 90)
   ↓
3. Yoga engine calculates new positions/sizes
   ↓
4. Display reflowed layout
   ↓
5. User clicks "💾 Save as Sub-Design"
   ↓
6. yogaLayoutToDesignRules(currentLayout)
   ↓
7. Convert absolute positions → gravity-based
   ↓
8. createDesignType() generates metadata
   ↓
9. setDesignTypes() adds to selector
   ↓
10. setEditableRules() adds design rules
   ↓
11. Design appears in selector with Cloudinary URL ready
```

## Position Conversion Logic

### Example: Logo in Top-Right

```javascript
// Original (500×900)
logo: { x: 10, y: 0, gravity: 'north_east' }

// After reflow (728×90)
Yoga calculates: { left: 638, top: 5, width: 80, height: 80 }

// Conversion detects:
- rightDist (728 - 638 - 80 = 10) < leftDist (638)
- topDist (5) < bottomDist (90 - 5 - 80 = 5)
- Result: gravity = 'north_east', x = 10, y = 5
```

### Gravity Detection Algorithm

```javascript
1. Calculate distances to all edges
2. Find closest vertical edge → north/south/center
3. Find closest horizontal edge → east/west/center
4. Combine: 'north_west', 'south_east', 'center', etc.
5. Calculate offsets from chosen gravity origin
```

## Preserved Properties

### Text Layers
✅ fontSize (scaled)
✅ color
✅ font (fontFamily)
✅ bold, italic
✅ fieldName (for form inputs)
✅ defaultValue (text content)
✅ textWrap, textWidth

### Image Layers
✅ width, height (scaled)
✅ publicId (if set, like logos)
✅ isMainProduct flag
✅ isLogo flag
✅ show flag

### All Layers
✅ gravity (converted from absolute)
✅ x, y (offsets from gravity origin)
✅ displayName
✅ priority (if set)

## Console Output

When you save, detailed information is logged:

```
💾 Saved as Sub-Design
  Design Type: {
    id: 'leaderboard-1736690123456',
    name: 'Leaderboard (728×90)',
    width: 728,
    height: 90,
    isReflowed: true
  }
  Design Rules: {
    width: 728,
    height: 90,
    logo: { x: 10, y: 5, gravity: 'north_east', ... },
    title: { x: 20, y: 10, gravity: 'north_west', fontSize: 18, ... }
  }
  Cloudinary URL can now be generated from the new sub-design
```

## Using the Saved Design

### 1. Switch to the New Design
- Open Design Selector dropdown
- Find "Leaderboard (728×90)" or similar
- Click to switch

### 2. View in Visual Tab
- Cloudinary URL is automatically generated
- Image renders with the reflowed layout

### 3. View in Rules Tab
- All layer rules are editable
- Modify positions, sizes, colors, etc.
- Changes update the URL in real-time

### 4. Generate Variations
- Use Controls panel to change text/images
- Use form fields to test different content
- Export URLs for production use

## Benefits

### Design Workflow
✅ **Rapid prototyping**: Test multiple banner sizes instantly
✅ **No manual conversion**: Yoga → Design Rules automatic
✅ **Reusable designs**: Save and refine later
✅ **URL ready**: Cloudinary URL generated immediately

### Technical Advantages
✅ **Intelligent positioning**: Gravity-based for responsiveness
✅ **Priority preserved**: Layer priorities maintained
✅ **Metadata intact**: fieldNames, colors, fonts preserved
✅ **Production ready**: Works with existing playground features

## Limitations

### Current Version
- ⚠️ Saves to localStorage (not persistent across devices)
- ⚠️ No undo/redo for save operation
- ⚠️ Manual naming (uses banner size + timestamp)

### Position Conversion
- ⚠️ Gravity detection is best-effort (closest edge)
- ⚠️ Complex layouts may need manual adjustment
- ⚠️ Center-aligned elements might shift slightly

## Future Enhancements

- [ ] Custom naming for saved designs
- [ ] Edit saved design metadata
- [ ] Delete saved designs
- [ ] Export/import saved designs
- [ ] A/B test multiple reflowed versions
- [ ] Batch save multiple banner sizes
- [ ] Save to backend/database

## Troubleshooting

### "Design not appearing in selector"
→ Check browser console for errors
→ Ensure save completed (look for success message)
→ Refresh the page

### "Cloudinary URL not generating"
→ Switch to the saved design in selector
→ Check Rules tab to see if design rules are present
→ Verify selectedAsset has a valid publicId

### "Positions look wrong"
→ Review console output for gravity conversion
→ Manually adjust in Rules tab
→ Original metadata preserved as `_originalX`, `_originalY`

## Example Workflow

```
1. Import Figma design (500×900) as "parent"
2. Navigate to Yoga tab
3. Click "Leaderboard" button
4. Review reflowed layout (728×90)
5. Click "💾 Save as Sub-Design"
6. Success: "Leaderboard (728×90)" saved
7. Open Design Selector
8. Select "Leaderboard (728×90)"
9. View in Visual tab → Cloudinary URL works!
10. Modify in Rules tab if needed
11. Export URL for ad campaign
```

## API Reference

### yogaLayoutToDesignRules(yogaLayout, designId, designName, originalDesignId)

Converts a Yoga layout to design rules format.

**Parameters:**
- `yogaLayout` (Object) - The yoga layout to convert
- `designId` (String) - ID for the new design
- `designName` (String) - Display name
- `originalDesignId` (String) - Source design ID

**Returns:** Design rules object

### createDesignType(yogaLayout, bannerName, bannerId, originalDesignId)

Creates a design type metadata object.

**Parameters:**
- `yogaLayout` (Object) - The yoga layout
- `bannerName` (String) - Banner name (e.g., "Leaderboard")
- `bannerId` (String) - Banner ID (e.g., "leaderboard")  
- `originalDesignId` (String) - Source design ID

**Returns:** Design type object

---

**Status**: ✅ Fully Implemented
**Date**: January 12, 2026
**Version**: 1.0
