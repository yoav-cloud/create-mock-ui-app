# Banner Ad Reflow Feature

## Overview

The Yoga Preview now includes a banner ad reflow feature powered by the **real Yoga layout engine** that intelligently reflows your design to different standard banner ad sizes with priority-based content preservation.

> **🚀 Now Using Real Yoga**: This feature uses the actual `yoga-layout-prebuilt` library for intelligent flexbox-based layout calculations, not just proportional scaling!

## How It Works

### Location
The reflow controls appear at the bottom of the Yoga Preview tab (parent design only).

### Available Banner Sizes
- **Leaderboard**: 728×90
- **Medium Rectangle**: 300×250
- **Wide Skyscraper**: 160×600
- **Large Rectangle**: 336×280
- **Half Page**: 300×600

### Reflow Algorithm (Real Yoga Engine)

The `reflowYogaLayout` function uses Yoga's flexbox engine for intelligent layout:

1. **Priority Detection**: Automatically or explicitly sets layer priorities (CRITICAL, HIGH, MEDIUM, LOW)
2. **Yoga Container Setup**: Creates a flex container with wrapping enabled
3. **Flex Properties**: 
   - CRITICAL layers: `flex-shrink: 0` (never shrink)
   - HIGH layers: `flex-shrink: 0.3` (resist shrinking)
   - MEDIUM layers: `flex-shrink: 1` (normal)
   - LOW layers: `flex-shrink: 2` (shrink first, may hide)
4. **Constraints**: Enforces minimum sizes to keep content readable/clickable
5. **Aspect Ratios**: Preserves image proportions automatically
6. **Layout Calculation**: Yoga engine distributes space optimally
7. **Visibility Detection**: Marks layers as invisible if too small

### Usage

1. Navigate to the Yoga tab in the playground
2. At the bottom, you'll see 5 banner size buttons
3. Click any button to reflow the layout to that size
4. Click "Reset" to return to the original layout
5. Console logs show details about the reflow operation

### Technical Details

**Files Created:**
- `src/yoga/components/BannerSizeButtons.jsx` - UI component for banner size selection
- `src/yoga/components/BannerSizeButtons.css` - Styling for the buttons
- `src/yoga/utils/reflowLayout.js` - Core reflow algorithm

**Files Modified:**
- `src/yoga/components/YogaPreview.jsx` - Integrated reflow state and controls
- `src/yoga/components/index.js` - Exported new component
- `src/yoga/utils/index.js` - Exported reflow utility

### Example Console Output

When you click a banner size button, you'll see:

```
🎯 Reflowed to Leaderboard
  Original: {width: 500, height: 900, ...}
  New: {width: 728, height: 90, ...}
  Scale factor: 0.1
```

### State Management

The component maintains:
- `originalLayout` - The source layout from design rules
- `currentLayout` - The active layout (original or reflowed)
- `activeBannerSize` - Which banner size is currently selected (if any)

### Benefits

This feature lets you:
- Quickly preview how designs adapt to different ad formats
- Test layout flexibility and content priorities
- Identify potential issues with specific banner sizes
- Explore Yoga's layout capabilities for responsive designs

## Future Enhancements

Potential improvements:
- Custom size input
- Save reflowed layouts
- A/B comparison view (original vs. reflowed side-by-side)
- Export reflowed layouts as new design variants
- Animation between sizes
- Aspect ratio preservation options
