# Sweep Strategy - Pine Script to FXR Conversion

This repository contains the conversion of a TradingView Pine Script strategy to FXR Script format.

## Files

- **`sweep_strategy.fxr.js`** - The converted FXR script
- **`CONVERSION_NOTES.md`** - Detailed conversion notes, differences, and usage instructions
- **`pine_script`** - Original Pine Script (empty/reference)

## Quick Start

1. Open your FXR platform
2. Copy the contents of `sweep_strategy.fxr.js`
3. Paste into the FXR Script editor
4. Apply to a 4-hour chart

## What This Script Does

The Sweep Strategy identifies:
- **Bullish setups**: When price sweeps below previous lows and closes in the upper portion of the candle
- **Bearish setups**: When price sweeps above previous highs and closes in the lower portion of the candle

Features:
- Validates candle size using ATR (Average True Range)
- Checks price position relative to 35 SMA
- Detects multi-sweep patterns
- Shows entry, stop-loss, and target levels visually
- Plots 35 and 150 SMAs with dynamic colors
- Time-based signal filtering

## Key Differences from Pine Script

The original Pine Script was a **strategy** that executes trades automatically. The FXR version is an **indicator** that:
- Shows visual signals (rectangles, labels, lines)
- Displays entry/exit levels
- Does NOT execute trades automatically

See `CONVERSION_NOTES.md` for detailed differences and technical details.

## Parameters

All original parameters are preserved:
- ATR Length, SMA periods
- Candle size filters
- Multi-sweep detection settings
- Risk management settings
- Color customization
- Time filter options

## Requirements

- FXR platform with custom indicator support
- Recommended timeframe: 4-hour charts
- Works on Forex, Crypto, and Stock instruments

## Credits

**Original Strategy**: © mrussel (TradingView)  
**License**: Mozilla Public License 2.0
