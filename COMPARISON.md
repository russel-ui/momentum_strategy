# Pine Script vs FXR Script - Side by Side Comparison

This document shows key conversions from Pine Script to FXR Script syntax.

## 1. Script Declaration

### Pine Script
```pinescript
//@version=5

strategy("Sweep Strategy", shorttitle="Sweep Strategy", overlay=true, 
     max_labels_count=500, max_boxes_count=500, 
     initial_capital=100000, default_qty_type=strategy.fixed, 
     commission_type=strategy.commission.percent, commission_value=0.1)
```

### FXR Script
```javascript
//@version=1

init = () => {
  indicator({ onMainPanel: true, format: 'inherit' });
  // Note: FXR is for indicators, not strategies
  // No capital, commission, or position sizing in indicator mode
};
```

---

## 2. Input Parameters

### Pine Script
```pinescript
atrLength = input.int(5, "ATR Length (Days)", minval=1, 
    tooltip="Number of days for ATR calculation")
smaLength = input.int(35, "SMA Length", minval=1)
closeThreshold = input.float(0.6, "Close Position Threshold", 
    minval=0.0, maxval=1.0, step=0.05)
bullishColor = input.color(color.green, "Bullish Color")
useTimeFilter = input.bool(true, "Use Time Filter", group="Time Filter")
```

### FXR Script
```javascript
init = () => {
  indicator({ onMainPanel: true, format: 'inherit' });
  
  input.int('ATR Length (Days)', 5, 'atrLength');
  input.int('SMA Length', 35, 'smaLength');
  input.float('Close Position Threshold', 0.6, 'closeThreshold');
  input.color('Bullish Color', '#00FF00', 'bullishColor');
  input.bool('Use Time Filter', true, 'useTimeFilter');
};

// Access in onTick via: inputs.atrLength, inputs.smaLength, etc.
```

**Key Differences:**
- FXR: First param is label, second is default, third is key
- Pine: First param is default, second is label, then options
- FXR: Access via `inputs.keyName`
- Pine: Direct variable assignment

---

## 3. Price Data Access

### Pine Script
```pinescript
currentClose = close        // Current bar close
previousClose = close[1]    // Previous bar close
currentHigh = high          // Current bar high
previousLow = low[2]        // 2 bars ago low
```

### FXR Script
```javascript
const currentClose = closeC(0);     // Current bar close
const previousClose = closeC(1);    // Previous bar close
const currentHigh = high(0);        // Current bar high
const previousLow = low(2);         // 2 bars ago low

// Alternative: Store in arrays
closeArray.push(closeC(0));
const previousClose = closeArray[closeArray.length - 2];
```

---

## 4. Technical Indicators

### Pine Script
```pinescript
// Simple Moving Average
sma35 = ta.sma(close, 35)
sma150 = ta.sma(close, 150)

// ATR - automatic calculation
atr5 = ta.atr(5)

// Multi-timeframe ATR
atr5Daily = request.security(syminfo.tickerid, "D", ta.atr(5))

// RSI
rsi14 = ta.rsi(close, 14)
```

### FXR Script
```javascript
// Simple Moving Average
const sma35Array = ta.sma(closeArray, 35);
const sma35 = sma35Array.at(-1);  // Get last value

const sma150Array = ta.sma(closeArray, 150);
const sma150 = sma150Array.at(-1);

// ATR - manual calculation or approximation
const atr5 = calculateATR(highArray, lowArray, closeArray, 5);

// Multi-timeframe (approximation)
const atr5Daily = atr5 * Math.sqrt(6);  // Scale 4H to daily

// RSI
const rsiArray = ta.rsi(closeArray, 14);
const rsi14 = rsiArray.at(-1);
```

**Key Differences:**
- FXR `ta` functions expect **arrays** and return **arrays**
- Must use `.at(-1)` to get the latest value
- Multi-timeframe requires approximation or external data
- Need to manually maintain price arrays

---

## 5. Conditions and Logic

### Pine Script
```pinescript
sweepsLow = low < low[1]
bullishClose = closePosition >= closeThreshold
aboveSMA = close > sma35
bullishSetup = sweepsLow and bullishClose and aboveSMA
```

### FXR Script
```javascript
const sweepsLow = low_val < getAtOffset(lowArray, 1);
const bullishClose = closePosition >= inputs.closeThreshold;
const aboveSMA = close > sma35;
const bullishSetup = sweepsLow && bullishClose && aboveSMA;
```

**Key Differences:**
- FXR uses `&&` and `||` instead of `and` and `or`
- Must access inputs via `inputs.` prefix
- Array indexing requires helper functions or direct access

---

## 6. Visual Elements - Boxes/Rectangles

### Pine Script
```pinescript
if bullishSetup
    bullBoxTop = low
    bullBoxBot = low - atr5
    boxColor = bullishColor
    bullBgColor = color.new(boxColor, boxOpacity)
    
    bullBox := box.new(bar_index, bullBoxTop, bar_index + 1, bullBoxBot, 
        boxColor, 1, line.style_solid, extend.none, 
        xloc.bar_index, bullBgColor, atrText, size.small, boxColor)
```

### FXR Script
```javascript
if (bullishSetup) {
  const bullBoxTop = low_val;
  const bullBoxBot = low_val - atr5;
  const boxColor = inputs.bullishColor;
  const opacity = inputs.boxOpacity / 100;
  
  rectangle(
    current_time,
    bullBoxTop,
    current_time + 14400000,  // 4 hours in ms
    bullBoxBot,
    {
      backgroundColor: hexToRgba(boxColor, opacity),
      color: boxColor,
      linewidth: 1
    }
  );
}
```

**Key Differences:**
- FXR uses `rectangle()` instead of `box.new()`
- Coordinates are (time, price) not (bar_index, price)
- Time is in milliseconds
- Options passed as object
- Opacity in rgba format

---

## 7. Visual Elements - Labels/Text

### Pine Script
```pinescript
if bullishSetup
    pctText = str.tostring(bullishPercent, "#") + "%"
    bullPctLabel := label.new(bar_index, high, pctText, 
        xloc.bar_index, yloc.price, boxColor, 
        label.style_label_down, color.white, size.small)
```

### FXR Script
```javascript
if (bullishSetup) {
  const pctText = Math.round(bullishPercent) + '%';
  text(
    current_time,
    high_val,
    pctText,
    {
      color: boxColor,
      backgroundColor: boxColor,
      textColor: '#FFFFFF',
      fontSize: 10
    }
  );
}
```

**Key Differences:**
- FXR uses `text()` instead of `label.new()`
- JavaScript `Math.round()` instead of `str.tostring()`
- Position by time, not bar_index
- Options in object format

---

## 8. Visual Elements - Lines

### Pine Script
```pinescript
// Lines are typically drawn with box edges or label connections
// Or using line.new() for explicit lines
```

### FXR Script
```javascript
// Draw horizontal line for entry level
trendline(
  current_time,
  entryPrice,
  current_time + 57600000,  // 16 hours ahead
  entryPrice,
  {
    color: '#00FF00',
    linewidth: 1,
    linestyle: 1  // dashed
  }
);
```

---

## 9. Plotting Lines

### Pine Script
```pinescript
sma35Color = close > sma35 ? color.green : color.red
plot(sma35, "35 SMA", color=sma35Color, linewidth=2)
plot(sma150, "150 SMA", color=sma150Color, linewidth=2)
```

### FXR Script
```javascript
const sma35Color = close > sma35 ? '#00FF00' : '#FF0000';
plot.line('35 SMA', sma35, sma35Color, 0);
plot.line('150 SMA', sma150, sma150Color, 0);
```

**Key Differences:**
- FXR uses `plot.line()` function
- Colors as hex strings
- Plot type as number (0 = line, 1 = histogram, etc.)

---

## 10. Strategy Logic - Entry/Exit

### Pine Script
```pinescript
if bullishPending and strategy.position_size == 0
    riskAmount = bullishEntryPrice - bullishStopLoss
    targetPrice = bullishEntryPrice + (riskAmount * targetMultiplier)
    positionSize = riskPerTrade / riskAmount
    
    strategy.entry("Long", strategy.long, qty=positionSize)
    strategy.exit("Exit Long", "Long", 
        stop=bullishStopLoss, limit=targetPrice)
```

### FXR Script
```javascript
// FXR: Show visual markers instead of executing trades
if (bullishSetup) {
  const riskAmount = entryPrice - stopLoss;
  const targetPrice = entryPrice + (riskAmount * targetMultiplier);
  const positionSize = riskPerTrade / riskAmount;
  
  // Draw entry line (green)
  trendline(current_time, entryPrice, endTime, entryPrice, 
    {color: '#00FF00', linewidth: 1, linestyle: 1});
  
  // Draw stop line (red)
  trendline(current_time, stopLoss, endTime, stopLoss, 
    {color: '#FF0000', linewidth: 1, linestyle: 1});
  
  // Draw target line (gold)
  trendline(current_time, targetPrice, endTime, targetPrice, 
    {color: '#FFD700', linewidth: 1, linestyle: 1});
}
```

**Key Differences:**
- FXR cannot execute trades automatically
- Show entry/stop/target as visual lines
- User must manually execute trades based on signals

---

## 11. Time Handling

### Pine Script
```pinescript
currentHour = hour(time, syminfo.timezone)
isInExcludedTime = currentHour >= excludeStartHour and 
                   currentHour < excludeEndHour
```

### FXR Script
```javascript
const current_time = time(0);  // Timestamp in ms
const currentDate = new Date(current_time);
const currentHour = currentDate.getUTCHours();
const isInExcludedTime = inputs.useTimeFilter ? 
  (currentHour >= inputs.excludeStartHour && 
   currentHour < inputs.excludeEndHour) : false;
```

---

## 12. Custom Functions

### Pine Script
```pinescript
countDistinctLowsSwept() =>
    count = 0
    minLowSoFar = high
    for i = 1 to multiSweepLookback
        if low[i] < minLowSoFar and low < low[i]
            count := count + 1
            minLowSoFar := low[i]
    count
```

### FXR Script
```javascript
const countDistinctLowsSwept = (lowArray, lookback) => {
  if (lowArray.length < lookback + 1) return 0;
  
  const currentLow = lowArray[lowArray.length - 1];
  let count = 0;
  let minLowSoFar = Infinity;
  
  for (let i = 1; i <= lookback; i++) {
    const idx = lowArray.length - 1 - i;
    if (idx < 0) break;
    const prevLow = lowArray[idx];
    
    if (prevLow < minLowSoFar && currentLow < prevLow) {
      count++;
      minLowSoFar = prevLow;
    }
  }
  
  return count;
};
```

---

## 13. Color Handling

### Pine Script
```pinescript
bullishColor = input.color(color.green, "Bullish Color")
boxBgColor = color.new(bullishColor, boxOpacity)
multiSweepColor = color.new(#FFD700, 0)
```

### FXR Script
```javascript
input.color('Bullish Color', '#00FF00', 'bullishColor');

// Convert hex to rgba for opacity
const hexToRgba = (hex, alpha) => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const boxBgColor = hexToRgba(inputs.bullishColor, 0.8);
```

---

## Summary of Major Differences

| Aspect | Pine Script | FXR Script |
|--------|-------------|------------|
| **Type** | Strategy or Indicator | Indicator only |
| **Trade Execution** | Automatic with `strategy.entry()` | Manual (visual signals) |
| **Price Access** | `close`, `close[1]` | `closeC(0)`, arrays |
| **Indicators** | `ta.sma(close, 20)` returns single value | `ta.sma(array, 20)` returns array |
| **Multi-timeframe** | `request.security()` | Manual approximation |
| **Drawing** | `box.new()`, `label.new()` | `rectangle()`, `text()` |
| **Coordinates** | bar_index based | Time (milliseconds) based |
| **Colors** | `color.green`, `color.new()` | Hex strings, rgba |
| **Logic Operators** | `and`, `or`, `not` | `&&`, `\|\|`, `!` |
| **String Format** | `str.tostring()` | `String()`, `.toString()` |
| **Arrays** | Built-in history with `[offset]` | Manual array management |

---

## Recommended Workflow

1. **Start with simple version** (`sweep_strategy_simple.fxr.js`)
2. **Test on demo data** to verify signals appear
3. **Move to full version** (`sweep_strategy.fxr.js`) 
4. **Customize parameters** for your trading style
5. **Manually execute trades** based on visual signals
6. **Track results** to validate strategy performance
