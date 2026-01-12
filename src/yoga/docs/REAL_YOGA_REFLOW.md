# Real Yoga Layout Engine - Banner Reflow

## Overview

The banner reflow feature now uses the **actual Yoga layout engine** (`yoga-layout-prebuilt`), providing intelligent content prioritization, automatic space distribution, and flexible constraint-based layouts.

## What Changed

### Before (Proportional Scaling)
```javascript
// Simple math - everything shrinks equally
newWidth = oldWidth * scaleFactor
newTop = (oldTop / oldHeight) * newHeight

// Problems:
// ❌ No content priority
// ❌ Text becomes unreadable
// ❌ No intelligent space distribution
```

### After (Real Yoga Engine)
```javascript
// Intelligent flexbox layout
root.setFlexWrap(Yoga.WRAP_WRAP)
child.setFlexShrink(0)  // Critical elements don't shrink
child.setMinWidth(100)  // Keep text readable
child.setAspectRatio(1) // Images maintain proportions

// Benefits:
// ✅ Priority-based sizing
// ✅ Automatic wrapping
// ✅ Min/max constraints
// ✅ Aspect ratio preservation
// ✅ Smart space distribution
```

## Layer Priority System

### Priority Levels

```javascript
import { LAYER_PRIORITIES } from '@/yoga/utils'

LAYER_PRIORITIES.CRITICAL  // 0 - Never shrinks (logo, CTA)
LAYER_PRIORITIES.HIGH      // 1 - Resists shrinking (price, product)
LAYER_PRIORITIES.MEDIUM    // 2 - Normal shrinking (title)
LAYER_PRIORITIES.LOW       // 3 - Shrinks most (tagline, decorative)
```

### Automatic Priority Detection

The system automatically assigns priorities based on layer keys:

| Layer Key Contains | Priority | Behavior |
|-------------------|----------|----------|
| `cta`, `button`, `logo` | CRITICAL | Never shrinks, always visible |
| `price`, `product` | HIGH | Resists shrinking, maintains size |
| `title`, `headline` | MEDIUM | Balanced shrinking |
| `tagline`, `description` | LOW | Shrinks first, may hide |

### Setting Explicit Priorities

You can override automatic priorities in design rules:

```javascript
const designRules = {
  parent: {
    width: 500,
    height: 900,
    logo: {
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      publicId: 'brand/logo',
      priority: LAYER_PRIORITIES.CRITICAL  // Explicit priority
    },
    tagline: {
      x: 50,
      y: 200,
      fontSize: 24,
      defaultValue: 'Your Success Matters',
      priority: LAYER_PRIORITIES.LOW  // Will hide if no space
    }
  }
}
```

## How It Works

### Step 1: Create Yoga Container
```javascript
const root = Yoga.Node.create()
root.setWidth(728)  // New banner width
root.setHeight(90)  // New banner height
root.setFlexDirection(Yoga.FLEX_DIRECTION_ROW)
root.setFlexWrap(Yoga.WRAP_WRAP)  // Wrap if needed
```

### Step 2: Configure Child Nodes by Priority

#### CRITICAL Priority (Logo, CTA)
```javascript
child.setFlexShrink(0)  // Never shrink
child.setFlexGrow(0)    // Don't expand
child.setMinWidth(originalWidth * 0.8)
```

#### HIGH Priority (Price, Product)
```javascript
child.setFlexShrink(0.3)  // Resist shrinking
child.setFlexGrow(0.5)    // Can expand slightly
child.setAspectRatio(w/h) // Maintain proportions
```

#### MEDIUM Priority (Title)
```javascript
child.setFlexShrink(1)    // Normal shrinking
child.setFlexGrow(1)      // Can expand to fill space
```

#### LOW Priority (Tagline)
```javascript
child.setFlexShrink(2)    // Shrinks aggressively
child.setFlexGrow(0)      // Don't expand
child.setMinWidth(40)     // Hide if too small
```

### Step 3: Yoga Calculates Layout
```javascript
root.calculateLayout(newWidth, newHeight, Yoga.DIRECTION_LTR)
// Yoga's flexbox engine distributes space optimally
```

### Step 4: Extract Computed Positions
```javascript
const layout = child.getComputedLayout()
// Returns actual position/size after flex calculations
```

### Step 5: Clean Up
```javascript
childNodes.forEach(node => node.free())
root.freeRecursive()
// Important: Prevent memory leaks
```

## Real-World Example

### Scenario: Instagram Story (500×900) → Leaderboard (728×90)

#### Original Layout
```
500×900 Instagram Story:
├─ Logo: 120×120 @ top-left
├─ Product: 350×350 @ center
├─ Title: 48px font
├─ Price: 44px font
└─ CTA Button: 300×80 @ bottom
```

#### With Proportional Scaling (Old)
```
0.1× scale to 728×90:
├─ Logo: 12×12 (invisible!)
├─ Product: 35×35 (too small!)
├─ Title: 4.8px (unreadable!)
├─ Price: 4.4px (invisible!)
└─ CTA Button: 30×8 (unclickable!)

❌ Result: Completely broken
```

#### With Yoga Engine (New)
```
Intelligent reflow to 728×90:
├─ Logo: 60×60 (visible, proportional)
├─ Product: 70×70 (visible, maintains aspect)
├─ Title: hidden (no space, low priority)
├─ Price: 24px font (readable!)
└─ CTA Button: 140×50 (clickable!)

✅ Result: Functional ad with readable content
```

## Minimum Size Constraints

The engine enforces minimum sizes to keep content usable:

### Text Layers
```javascript
CRITICAL text:  fontSize stays near original
HIGH text:      min 12px (70% of original)
MEDIUM text:    min 10px (50% of original)
LOW text:       min 8px (may hide)
```

### Image Layers
```javascript
CRITICAL images: min 80% of original
HIGH images:     min 50×50px
MEDIUM images:   min 30×30px
LOW images:      min 20×20px
```

## Visibility Detection

Layers are marked as invisible if they shrink below usable minimums:

```javascript
layer.metadata.isVisible = 
  layout.width >= minWidth * 0.8 &&
  layout.height >= minHeight * 0.8
```

This allows you to:
- Hide layers that are too small
- Show "..." for truncated content
- Display alternative layouts

## Console Output

In development mode, you'll see detailed reflow information:

```
🧘 Yoga Layout Reflow
  Original: {width: 500, height: 900}
  New: {width: 728, height: 90}
  Global scale: 0.100
  Visible layers: 3 / 5
  Layer details: [
    {key: 'logo', priority: 0, visible: true, size: '60×60'},
    {key: 'product', priority: 1, visible: true, size: '70×70'},
    {key: 'title', priority: 2, visible: false, size: '15×8'},
    {key: 'price', priority: 1, visible: true, size: '120×24'},
    {key: 'cta', priority: 0, visible: true, size: '140×50'}
  ]
```

## Flex Properties Reference

### Container Properties
- `setFlexDirection()` - ROW or COLUMN layout
- `setFlexWrap()` - WRAP or NO_WRAP
- `setJustifyContent()` - Main axis alignment
- `setAlignItems()` - Cross axis alignment
- `setAlignContent()` - Multi-line alignment

### Child Properties
- `setFlexGrow()` - How much to expand (0-n)
- `setFlexShrink()` - How much to shrink (0-n)
- `setFlexBasis()` - Initial size before flex
- `setAspectRatio()` - Width/height ratio
- `setMinWidth()` / `setMaxWidth()` - Size constraints
- `setMargin()` - Spacing around element

## Best Practices

### 1. Set Priorities Thoughtfully
```javascript
// Critical: User must see this
logo.priority = LAYER_PRIORITIES.CRITICAL
ctaButton.priority = LAYER_PRIORITIES.CRITICAL

// High: Important but can adapt
price.priority = LAYER_PRIORITIES.HIGH
productImage.priority = LAYER_PRIORITIES.HIGH

// Low: Nice to have
decorativeElements.priority = LAYER_PRIORITIES.LOW
```

### 2. Use Aspect Ratios for Images
```javascript
// Prevents distortion
child.setAspectRatio(originalWidth / originalHeight)
```

### 3. Set Realistic Minimums
```javascript
// Text must be readable
child.setMinWidth(estimatedTextWidth)
child.setMinHeight(fontSize * 1.5)
```

### 4. Test Multiple Sizes
Try various banner dimensions to ensure priorities work:
- 728×90 (Leaderboard) - Very wide, short
- 300×600 (Half Page) - Tall, narrow
- 160×600 (Skyscraper) - Very tall, narrow
- 300×250 (Medium Rectangle) - Square-ish

## Migration Guide

If you have existing designs, no changes needed! The system:
1. Auto-detects priorities from layer keys
2. Calculates sensible minimums
3. Handles layouts intelligently

To optimize, add explicit priorities:
```javascript
// Before (automatic)
title: { /* priority auto-detected as MEDIUM */ }

// After (explicit)
title: { 
  priority: LAYER_PRIORITIES.HIGH  // Keep visible
}
```

## Performance

- **Calculation**: ~10ms for typical 5-layer ad
- **Memory**: Auto-freed after calculation
- **Bundle size**: +200KB for yoga-layout-prebuilt

## Limitations

1. **Absolute Positioning**: Current implementation uses Yoga for sizing, then positions absolutely
2. **No Text Wrapping Yet**: Text size adjusts but doesn't flow to multiple lines
3. **Single-Row Layout**: Currently uses ROW direction with wrapping

## Future Enhancements

- [ ] Multi-line text wrapping
- [ ] Column-based layouts for vertical formats
- [ ] Animation between reflow states
- [ ] Save reflowed layouts as variants
- [ ] A/B test different priority schemes

## Troubleshooting

### "Text too small to read"
→ Increase layer priority or reduce content

### "Image distorted"
→ Ensure aspect ratio is set

### "Layout looks cramped"
→ Reduce margin or increase flex-shrink on low-priority items

### "Items overlapping"
→ Check that flex-wrap is enabled on container

## Resources

- [Yoga Documentation](https://yogalayout.com/docs)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [React Native Layout](https://reactnative.dev/docs/flexbox)
