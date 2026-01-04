# Pine Script to FXR Script Conversion

## Overview

This document explains the conversion of the "Sweep Strategy" from Pine Script (TradingView) to FXR Script format.

## Important Notes

### 1. Strategy vs Indicator

**Pine Script**: The original is a **strategy** that executes trades automatically with entry/exit logic, position sizing, and risk management.

**FXR Script**: FXR is designed for **indicators** that provide visual signals and analysis. The converted script:
- Shows visual markers (rectangles, labels) when bullish/bearish setups occur
- Draws entry, stop-loss, and target price levels
- Plots the 35 SMA and 150 SMA
- Does NOT execute trades automatically

### 2. Key Conversions

| Pine Script Feature | FXR Script Equivalent | Notes |
|---------------------|----------------------|-------|
| `@version=5` | `//@version=1` | FXR version syntax |
| `strategy()` | `indicator()` | Strategy converted to indicator |
| `input.int()` | `input.int()` | Same syntax, third param is the key |
| `ta.sma()` | `ta.sma()` | Similar but expects/returns arrays |
| `ta.atr()` | Custom function | Manually calculated ATR |
| `request.security()` | Approximation | Simulated daily ATR with scaling |
| `strategy.entry()` | Visual markers | Shows entry points with lines |
| `strategy.exit()` | Visual markers | Shows stop/target levels |
| `box.new()` | `rectangle()` | Rectangle drawing |
| `label.new()` | `text()` | Text annotation |
| `plot()` | `plot.line()` | Line plotting |

### 3. Data Access Differences

**Pine Script**:
```pinescript
close[1]  // Previous close
high[0]   // Current high
```

**FXR Script**:
```javascript
closeC(0)  // Current close
closeC(1)  // Previous close
high(0)    // Current high
```

### 4. Technical Analysis

**Pine Script**: Built-in `ta.atr()` function with automatic calculation

**FXR Script**: 
- Manual ATR calculation implemented
- Uses arrays to store historical data
- `ta` library functions expect full arrays and return arrays
- Use `.at(-1)` to get the most recent value

### 5. Multi-Timeframe Data

**Pine Script**:
```pinescript
atr5 = request.security(syminfo.tickerid, "D", ta.atr(atrLength))
```

**FXR Script**:
- FXR doesn't have direct multi-timeframe support in the examples
- Approximation: Calculate 4H ATR and scale to daily using `atr5Daily = atr5 * Math.sqrt(6)`
- This assumes ~6 4H bars per day and uses volatility scaling

### 6. Visual Markers

The FXR script creates visual markers for:

#### Bullish Setups:
- Green rectangle below the candle (height = 1 ATR)
- Label showing close position percentage
- Entry level (green dashed line)
- Stop loss (red dashed line, 2 pips below low)
- Target (gold dashed line, 1.2x or 2.5x risk depending on SMA alignment)
- Gold star marker for multi-sweep signals

#### Bearish Setups:
- Red rectangle above the candle (height = 1 ATR)
- Label showing close position percentage
- Entry level (red dashed line)
- Stop loss (green dashed line, 2 pips above high)
- Target (gold dashed line, 1.2x or 2.5x risk)
- Magenta star marker for multi-sweep signals

### 7. Time Filter

The time filter is implemented but may need adjustment based on:
- FXR's timezone handling
- How `time(0)` returns timestamps
- Exchange timezone vs UTC

### 8. Removed Features

The following Pine Script features were removed as they don't translate to indicators:

- `strategy.entry()` - Automatic trade execution
- `strategy.exit()` - Automatic exit orders
- Position sizing calculations (kept for display purposes)
- Backtesting period filter (FXR shows all historical signals)
- `initial_capital`, `default_qty_type`, `commission_type` - Strategy-specific settings

### 9. Array Management

**Important**: FXR scripts need to manage arrays manually:
```javascript
// Store historical data
const closeArray = [];
const highArray = [];
const lowArray = [];

// Limit array size to prevent memory issues
if (closeArray.length > 200) {
  closeArray.shift();
}
```

### 10. Color Handling

**Pine Script**: 
```pinescript
color.new(#FFD700, 0)
```

**FXR Script**:
```javascript
// Use hex colors directly
'#FFD700'

// For opacity, convert to rgba
hexToRgba('#FFD700', 0.8)
```

## Usage Instructions

1. Copy the contents of `sweep_strategy.fxr.js`
2. Open the FXR Script editor in your FXR platform
3. Paste the code
4. Save and apply to a 4H chart (strategy was designed for 4H timeframe)

## Parameters

All original parameters have been preserved:

- **ATR Length**: Number of periods for ATR calculation (default: 5)
- **SMA Length**: Primary SMA period (default: 35)
- **Min/Max ATR Multiplier**: Valid candle size range
- **Close Position Threshold**: How far the close must be in the candle
- **Multi-Sweep Lookback**: Bars to check for multi-sweep signals
- **Multi-Sweep Min Count**: Minimum sweeps to highlight
- **Risk Per Trade**: Dollar amount (used for display)
- **Colors**: All color customizations available
- **Time Filter**: Hour-based signal filtering

## Limitations and Considerations

1. **No Automatic Trading**: This is an indicator only. You must manually execute trades based on signals.

2. **ATR Calculation**: The daily ATR is approximated. For accurate results, you may need to adjust the scaling factor based on your specific timeframe and instrument.

3. **Performance**: Large arrays can slow down the indicator. The script limits history to 200 bars, which should be sufficient for most use cases.

4. **Drawing Persistence**: FXR drawing tools may have different persistence behavior than Pine Script boxes and labels.

5. **Timeframe Validation**: The original Pine Script enforced 4H timeframe only. This check was removed in FXR - ensure you use appropriate timeframes manually.

6. **Pip Calculation**: The pip value calculation is simplified. You may need to adjust it based on your specific instruments.

## Testing Recommendations

1. Test on multiple instruments (Forex, Crypto, Stocks)
2. Verify that signals appear as expected
3. Check that SMA plots are accurate
4. Ensure multi-sweep detection works correctly
5. Validate time filter functionality

## Potential Improvements

1. Add alert conditions for bullish/bearish setups
2. Implement more accurate multi-timeframe ATR
3. Add option to show/hide different visual elements
4. Include win rate statistics (if FXR supports)
5. Add position size calculator display

## Support and Questions

Refer to the FXR Script documentation at:
https://custom-indicators.gitbook.io/custom-indicators-docs

---

**Original Pine Script Author**: © mrussel  
**Conversion**: Pine Script v5 → FXR Script v1  
**License**: Mozilla Public License 2.0
