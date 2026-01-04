# File Manifest

This repository contains a complete conversion of a Pine Script trading strategy to FXR Script format, along with comprehensive documentation.

## Main Files

### `sweep_strategy.fxr.js`
**Full-featured FXR conversion**

The complete conversion of the Sweep Strategy from Pine Script to FXR Script. This file includes:
- All original parameters and settings
- Multi-sweep detection logic
- ATR-based candle validation
- Visual markers (rectangles, labels, lines)
- Entry, stop-loss, and target level indicators
- 35 and 150 SMA plots with dynamic colors
- Time-based filtering
- Manual ATR calculation
- Pip value calculation for different instruments

**Use this when**: You want the full strategy with all features and customization options.

---

### `sweep_strategy_simple.fxr.js`
**Simplified FXR version**

A stripped-down version containing only the core functionality:
- Basic bullish/bearish setup detection
- Simple SMA (35-period)
- Entry/stop/target visualization
- Minimal parameters

**Use this when**: 
- Testing FXR for the first time
- Learning how the strategy works
- Debugging issues
- You want a clean starting point for customization

---

## Documentation Files

### `README.md`
**Quick start guide**

Overview of the project with:
- What the strategy does
- Quick start instructions
- Key differences from Pine Script
- Requirements and credits

**Start here** if you're new to this conversion.

---

### `CONVERSION_NOTES.md`
**Detailed technical documentation**

Comprehensive notes about the conversion process:
- Strategy vs Indicator differences
- Feature-by-feature conversion table
- Data access changes
- Visual marker implementation
- Removed features and why
- Usage instructions
- Limitations and considerations
- Testing recommendations
- Potential improvements

**Read this** to understand the technical details of the conversion.

---

### `COMPARISON.md`
**Side-by-side code comparison**

Direct comparisons between Pine Script and FXR Script:
- Script declaration
- Input parameters
- Price data access
- Technical indicators
- Conditions and logic
- Visual elements (boxes, labels, lines)
- Plotting functions
- Strategy logic
- Time handling
- Custom functions
- Color handling
- Summary table of differences

**Use this** when converting your own Pine Scripts or understanding syntax differences.

---

### `FXR_QUICK_REFERENCE.md`
**Function reference guide**

Quick reference for FXR Script:
- Script structure template
- Price data functions
- Input types
- Technical analysis functions (full ta library)
- Plotting functions
- Drawing functions (lines, shapes, text, arrows)
- Colors and color handling
- Array management
- Conditional logic
- Math functions
- Date/time functions
- Common patterns and examples
- Debugging tips
- Best practices

**Use this** as a cheat sheet when writing FXR scripts.

---

### `FILE_MANIFEST.md`
**This file**

Guide to all files in the repository and their purposes.

---

## Original Pine Script

### `pine_script`
Empty file serving as a placeholder. The original Pine Script is included as comments in the user's initial query.

---

## Git Files

### `.git/`
Git repository metadata

---

## File Organization Summary

```
/workspace/
├── sweep_strategy.fxr.js          # Full FXR conversion ⭐
├── sweep_strategy_simple.fxr.js   # Simplified version
├── README.md                       # Start here
├── CONVERSION_NOTES.md             # Technical details
├── COMPARISON.md                   # Side-by-side syntax
├── FXR_QUICK_REFERENCE.md         # Function reference
├── FILE_MANIFEST.md               # This file
└── pine_script                     # Original (placeholder)
```

---

## Recommended Reading Order

### For Beginners:
1. `README.md` - Understand what this is
2. `sweep_strategy_simple.fxr.js` - See a simple example
3. `FXR_QUICK_REFERENCE.md` - Learn FXR basics
4. `sweep_strategy.fxr.js` - Study the full version

### For Experienced Traders:
1. `README.md` - Quick overview
2. `CONVERSION_NOTES.md` - Understand limitations
3. `sweep_strategy.fxr.js` - Use the full version
4. `FXR_QUICK_REFERENCE.md` - Reference as needed

### For Developers Converting Scripts:
1. `COMPARISON.md` - Learn syntax differences
2. `CONVERSION_NOTES.md` - Understand conversion patterns
3. `FXR_QUICK_REFERENCE.md` - Function reference
4. Both `.fxr.js` files - Study examples

---

## File Sizes (Approximate)

| File | Lines | Purpose |
|------|-------|---------|
| `sweep_strategy.fxr.js` | ~550 | Complete conversion |
| `sweep_strategy_simple.fxr.js` | ~150 | Simplified version |
| `README.md` | ~60 | Quick start |
| `CONVERSION_NOTES.md` | ~250 | Technical documentation |
| `COMPARISON.md` | ~500 | Syntax comparison |
| `FXR_QUICK_REFERENCE.md` | ~600 | Reference guide |

---

## Version History

**v1.0** - Initial conversion
- Full Pine Script to FXR conversion
- Complete documentation
- Simple and full versions
- Comprehensive reference materials

---

## Contributing

If you find issues or want to improve the conversion:
1. Test thoroughly on demo accounts
2. Document any issues found
3. Suggest improvements with specific examples
4. Consider edge cases and error handling

---

## License

Original Pine Script: Mozilla Public License 2.0  
Conversion and Documentation: Mozilla Public License 2.0

---

## Support

For FXR Script questions, refer to:
- Official docs: https://custom-indicators.gitbook.io/custom-indicators-docs
- `FXR_QUICK_REFERENCE.md` in this repository

For strategy questions:
- See `CONVERSION_NOTES.md` for strategy logic
- Study the Pine Script comments in both `.fxr.js` files

---

**Last Updated**: 2026-01-04
