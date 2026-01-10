# Yoga Layout Integration

## 🎯 What Is This?

After importing a Figma design into the playground editor, the system automatically converts it to **Yoga Layout** syntax and outputs the result to the browser console.

**Yoga Layout** is Facebook's cross-platform layout engine that implements Flexbox. This integration provides a bridge between Cloudinary's absolute-positioned designs and Yoga's flex-based layout system.

## ⚡ Quick Start (2 Minutes)

1. **Import a Figma design**
   - Click "New" in Design Playground
   - Select "Start from Figma"
   - Complete the import flow

2. **View the results**
   - Open browser console (F12)
   - Look for `🧘 Yoga Layout Generation`
   - See JSON and C-style output

That's it! The conversion happens automatically.

## 📚 Documentation

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [YOGA_LAYOUT_QUICK_START.md](YOGA_LAYOUT_QUICK_START.md) | Get started immediately | 2 min |
| [YOGA_LAYOUT_USAGE.md](YOGA_LAYOUT_USAGE.md) | Complete usage guide | 10 min |
| [YOGA_LAYOUT_IMPLEMENTATION.md](YOGA_LAYOUT_IMPLEMENTATION.md) | Technical details | 15 min |
| [YOGA_LAYOUT_SUMMARY.md](YOGA_LAYOUT_SUMMARY.md) | Complete overview | 5 min |
| [src/utils/yoga/README.md](src/utils/yoga/README.md) | API reference | 10 min |
| [src/utils/yoga/ARCHITECTURE.md](src/utils/yoga/ARCHITECTURE.md) | System architecture | 15 min |

## 📦 What's Included

### Core Files

```
src/
├── utils/yoga/
│   ├── yogaLayoutConverter.js   # Conversion logic
│   ├── index.js                  # Exports
│   ├── README.md                 # API docs
│   └── ARCHITECTURE.md           # Architecture
├── hooks/
│   └── useYogaLayout.js          # React hook
└── components/
    ├── YogaLayoutViewer.jsx      # UI component (optional)
    └── YogaLayoutViewer.css      # Styles
```

### Documentation Files

```
├── YOGA_LAYOUT_README.md            # This file
├── YOGA_LAYOUT_QUICK_START.md       # 2-min guide
├── YOGA_LAYOUT_USAGE.md             # Usage guide
├── YOGA_LAYOUT_IMPLEMENTATION.md    # Tech details
└── YOGA_LAYOUT_SUMMARY.md           # Overview
```

## 🚀 Example

### Input: Figma Design Rules

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
      defaultValue: 'Welcome'
    }
  }
}
```

### Output: Console

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

### Output: JSON

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

### Output: C-Style

```c
YGNodeStyleSetWidth(root, 500);
YGNodeStyleSetHeight(root, 900);

const child0 = YGNodeNew();
YGNodeStyleSetPosition(child0, YGEdgeLeft, 50);
YGNodeStyleSetPosition(child0, YGEdgeTop, 100);
YGNodeInsertChild(root, child0, 0);
```

## 🎨 Features

- ✅ **Automatic conversion** on Figma import
- ✅ **Multiple output formats** (JSON, C-style)
- ✅ **Console logging** with formatted output
- ✅ **Memory storage** (React state)
- ✅ **Context API** access
- ✅ **Optional viewer** component
- ✅ **Layer support** (text, image, background)
- ✅ **Metadata preservation**
- ✅ **Zero configuration**
- ✅ **Zero dependencies**

## 💻 Usage in Code

```javascript
import { useOutletContext } from 'react-router-dom'

function MyComponent() {
  const { design } = useOutletContext()
  const { yogaLayout } = design
  
  // Get current layout
  const layout = yogaLayout.currentDesignYogaLayout
  
  // Export as JSON
  const json = yogaLayout.exportYogaLayoutAsJSON()
  
  // Export as C-style
  const cStyle = yogaLayout.exportYogaLayoutAsCStyle()
  
  // Get statistics
  const { total, text, image } = yogaLayout.stats
}
```

## 🎯 Use Cases

- **Mobile app development** - Convert web designs to native layouts
- **Cross-platform UI** - Share layouts between web and native
- **Layout debugging** - Inspect design structure
- **Code generation** - Generate Yoga code from designs
- **Documentation** - Export design specifications
- **Testing** - Validate layout structure

## 🔧 Maintenance

### Easy to Modify

All code is isolated in dedicated directories. To modify:

- **Conversion logic**: Edit `src/utils/yoga/yogaLayoutConverter.js`
- **Export formats**: Add methods to `src/hooks/useYogaLayout.js`
- **UI component**: Edit `src/components/YogaLayoutViewer.jsx`

### Easy to Remove

To completely remove the integration:

1. Remove 5 lines from `src/pages/DesignPlayground.jsx`
2. Delete `src/utils/yoga/`
3. Delete `src/hooks/useYogaLayout.js`
4. Delete `src/components/YogaLayoutViewer.*`
5. Delete documentation files

## 📊 Status

- ✅ **Implementation**: Complete
- ✅ **Testing**: Manual testing complete
- ✅ **Documentation**: Comprehensive
- ✅ **Linting**: No errors
- ✅ **Integration**: Fully integrated
- ✅ **Performance**: Optimized

## 🎓 Learn More

- [Yoga Layout Official Site](https://yogalayout.com/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [React Native Layout](https://reactnative.dev/docs/flexbox)

## 📞 Support

For questions or issues:

1. Read the [Quick Start Guide](YOGA_LAYOUT_QUICK_START.md)
2. Check the [Usage Guide](YOGA_LAYOUT_USAGE.md)
3. Review the [API Reference](src/utils/yoga/README.md)
4. Inspect browser console output
5. Use React DevTools to inspect state

## 🙏 Notes

- Conversion happens automatically on Figma import
- Results are logged to console for easy access
- Data is stored in memory only (not persisted)
- All layer metadata is preserved
- Layers are sorted by Y position (top to bottom)
- Text layers support wrapping and styling
- Image layers include publicId and dimensions

## ✨ Highlights

- **Zero Configuration**: Works out of the box
- **Zero Dependencies**: Uses existing project dependencies only
- **Zero Breaking Changes**: Completely additive
- **Zero Persistence**: Memory-only storage
- **Zero Manual Steps**: Fully automated

---

**Ready to use!** Just import a Figma design and check the console.

For detailed information, see the documentation files listed above.

