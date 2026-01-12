# Quick Start: Yoga Banner Reflow

## Installation

The package has been added to `package.json`. Install it:

```bash
pnpm install
```

This will install `yoga-layout-prebuilt` (~200KB).

## Using the Feature

### 1. Navigate to Yoga Preview

1. Open the playground with any design
2. Click the **"Yoga"** tab
3. Scroll to the bottom to see banner size buttons

### 2. Click a Banner Size

Choose from 5 standard banner formats:
- **Leaderboard**: 728×90
- **Medium Rectangle**: 300×250
- **Wide Skyscraper**: 160×600
- **Large Rectangle**: 336×280
- **Half Page**: 300×600

### 3. Watch Intelligent Reflow

The layout will reflow using Yoga's flexbox engine with:
- ✅ Priority-based content preservation
- ✅ Automatic space distribution
- ✅ Minimum size enforcement
- ✅ Aspect ratio preservation

### 4. Check Console

Open browser console to see detailed reflow information:

```
🧘 Yoga Layout Reflow
  Original: {width: 500, height: 900}
  New: {width: 728, height: 90}
  Global scale: 0.100
  Visible layers: 3 / 5
  Layer details: [...]
```

### 5. Reset to Original

Click the **"↻ Reset"** button to return to original size.

## Setting Layer Priorities (Optional)

### Automatic Detection

Priorities are auto-assigned based on layer keys:

```javascript
// Auto-detected as CRITICAL
cta: { /* CTA button */ }
logo: { /* Brand logo */ }

// Auto-detected as HIGH
price: { /* Product price */ }
product: { /* Product image */ }

// Auto-detected as MEDIUM
title: { /* Main title */ }

// Auto-detected as LOW
tagline: { /* Subtitle */ }
description: { /* Extra info */ }
```

### Manual Override

To explicitly set priorities in your design rules:

```javascript
import { LAYER_PRIORITIES } from '@/yoga/utils'

const designRules = {
  parent: {
    logo: {
      publicId: 'brand/logo',
      priority: LAYER_PRIORITIES.CRITICAL  // Never shrinks
    },
    
    title: {
      defaultValue: 'Big Sale!',
      priority: LAYER_PRIORITIES.HIGH  // Important, resists shrinking
    },
    
    details: {
      defaultValue: 'Limited time offer',
      priority: LAYER_PRIORITIES.LOW  // Can hide if no space
    }
  }
}
```

## Priority Levels Explained

| Priority | Flex Shrink | Behavior | Use For |
|----------|-------------|----------|---------|
| CRITICAL (0) | 0 | Never shrinks | Logo, CTA button |
| HIGH (1) | 0.3 | Resists shrinking | Price, main product |
| MEDIUM (2) | 1.0 | Normal shrinking | Title, headlines |
| LOW (3) | 2.0 | Shrinks aggressively | Tagline, decorative |

## Example: Product Ad with Priorities

```javascript
const productAd = {
  parent: {
    width: 500,
    height: 900,
    
    // CRITICAL - Always visible
    logo: {
      x: 30, y: 30,
      width: 100, height: 100,
      publicId: 'brand/logo',
      priority: 0  // CRITICAL
    },
    
    ctaButton: {
      x: 150, y: 800,
      width: 200, height: 60,
      defaultValue: 'Shop Now',
      priority: 0  // CRITICAL
    },
    
    // HIGH - Important, keep visible
    product: {
      x: 100, y: 200,
      width: 300, height: 300,
      publicId: 'products/shoe',
      isMainProduct: true,
      priority: 1  // HIGH
    },
    
    price: {
      x: 150, y: 550,
      fontSize: 44,
      defaultValue: '$99',
      priority: 1  // HIGH
    },
    
    // MEDIUM - Can shrink moderately
    title: {
      x: 100, y: 130,
      fontSize: 32,
      defaultValue: 'Summer Collection',
      priority: 2  // MEDIUM
    },
    
    // LOW - First to shrink/hide
    tagline: {
      x: 100, y: 650,
      fontSize: 20,
      defaultValue: 'Free shipping on orders over $50',
      priority: 3  // LOW
    }
  }
}
```

### Reflow to 728×90 Leaderboard

Result:
- ✅ Logo: 60×60 (visible, readable)
- ✅ CTA Button: 140×50 (clickable)
- ✅ Product: 70×70 (visible, proportional)
- ✅ Price: 24px font (readable)
- ⚠️ Title: 14px font (small but readable)
- ❌ Tagline: Hidden (marked `isVisible: false`)

## Testing Different Sizes

Try multiple banner sizes to see how priorities work:

```javascript
// Wide & short - horizontal layout works best
728×90 (Leaderboard)

// Tall & narrow - vertical stacking
160×600 (Skyscraper)
300×600 (Half Page)

// Square-ish - balanced
300×250 (Medium Rectangle)
336×280 (Large Rectangle)
```

## Troubleshooting

### Package installation fails
```bash
# Try clearing pnpm cache
pnpm store prune
pnpm install
```

### "Cannot find module 'yoga-layout-prebuilt'"
```bash
# Ensure package is installed
pnpm list yoga-layout-prebuilt
pnpm install
```

### Text too small to read
- Increase layer priority
- Reduce number of layers
- Choose larger banner format

### Images distorted
- Aspect ratio preservation is automatic
- Check that original dimensions are correct

### Console errors
- Check browser console for detailed error messages
- Yoga nodes should be freed automatically
- Report issues with stack trace

## What's Next?

See detailed documentation:
- [REAL_YOGA_REFLOW.md](./REAL_YOGA_REFLOW.md) - Complete implementation details
- [YOGA_VS_MANUAL_COMPARISON.md](./YOGA_VS_MANUAL_COMPARISON.md) - Benefits analysis
- [BANNER_REFLOW_FEATURE.md](./BANNER_REFLOW_FEATURE.md) - Feature overview

## Resources

- Yoga Layout: https://yogalayout.com
- Flexbox Guide: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- Package: https://www.npmjs.com/package/yoga-layout-prebuilt
