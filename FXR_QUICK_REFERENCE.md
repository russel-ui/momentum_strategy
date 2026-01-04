# FXR Script Quick Reference

A quick reference for common FXR Script functions and syntax.

## Script Structure

```javascript
//@version=1

// Initialization - runs once
init = () => {
  indicator({ onMainPanel: true, format: 'inherit' });
  // Define inputs here
};

// Arrays for storing data
const priceArray = [];

// Main function - runs every tick
onTick = (length, _moment, _, ta, inputs) => {
  // Your logic here
};
```

## Price Data Functions

```javascript
// Current bar (index 0)
const close = closeC(0);      // Close price
const high_val = high(0);     // High price
const low_val = low(0);       // Low price
const open_val = openC(0);    // Open price
const volume_val = volume(0); // Volume
const current_time = time(0); // Timestamp (milliseconds)

// Previous bars (index 1, 2, 3...)
const prevClose = closeC(1);  // Previous bar close
const close2ago = closeC(2);  // 2 bars ago close
```

## Input Types

```javascript
init = () => {
  indicator({ onMainPanel: true, format: 'inherit' });
  
  // Integer input
  input.int('Label', defaultValue, 'keyName');
  // Example: input.int('Period', 14, 'period');
  
  // Float input
  input.float('Label', defaultValue, 'keyName');
  // Example: input.float('Multiplier', 2.0, 'mult');
  
  // Boolean input
  input.bool('Label', defaultValue, 'keyName');
  // Example: input.bool('Show Signals', true, 'showSignals');
  
  // Color input
  input.color('Label', '#RRGGBB', 'keyName');
  // Example: input.color('Line Color', '#00FF00', 'lineColor');
  
  // String input
  input.str('Label', 'default', 'keyName');
  // Example: input.str('Symbol', 'EURUSD', 'symbol');
};

// Access inputs in onTick
onTick = (length, _moment, _, ta, inputs) => {
  const period = inputs.period;
  const multiplier = inputs.mult;
  const showSignals = inputs.showSignals;
};
```

## Technical Analysis Functions (ta library)

All functions expect **arrays** and return **arrays**.

```javascript
// Moving Averages
const smaArray = ta.sma(closeArray, period);      // Simple MA
const emaArray = ta.ema(closeArray, period);      // Exponential MA
const wmaArray = ta.wma(closeArray, period);      // Weighted MA
const demaArray = ta.dema(closeArray, period);    // Double EMA
const temaArray = ta.tema(closeArray, period);    // Triple EMA

// Get latest value
const sma = smaArray.at(-1);

// Bollinger Bands
const bb = ta.bb(closeArray, period, mult);
// Returns: { upper: number[], middle: number[], lower: number[] }
const upperBand = bb.upper.at(-1);
const middleBand = bb.middle.at(-1);
const lowerBand = bb.lower.at(-1);

// ATR (Average True Range)
const atrArray = ta.atr(highArray, lowArray, closeArray, period);
const atr = atrArray.at(-1);

// RSI (Relative Strength Index)
const rsiArray = ta.rsi(closeArray, period);
const rsi = rsiArray.at(-1);

// MACD
const macd = ta.macd(closeArray, fast, slow, signal);
// Returns: { macd: number[], signal: number[], histogram: number[] }
const macdLine = macd.macd.at(-1);
const signalLine = macd.signal.at(-1);
const histogram = macd.histogram.at(-1);

// Stochastic
const stoch = ta.stoch(highArray, lowArray, closeArray, window, signal, smooth);
// Returns: { k: number[], d: number[] }
const k = stoch.k.at(-1);
const d = stoch.d.at(-1);

// Standard Deviation
const stdevArray = ta.stdev(closeArray, period);
const stdev = stdevArray.at(-1);

// Rate of Change
const rocArray = ta.roc(closeArray, period);
const roc = rocArray.at(-1);

// Williams %R
const williamsArray = ta.williams(highArray, lowArray, closeArray, period);
const williams = williamsArray.at(-1);

// ADX (Average Directional Index)
const adxArray = ta.adx(highArray, lowArray, closeArray, period);
const adx = adxArray.at(-1);

// CCI (Commodity Channel Index)
const cciArray = ta.cci(highArray, lowArray, closeArray, period, mult);
const cci = cciArray.at(-1);
```

## Plotting Functions

```javascript
// Line plot
plot.line(title, value, color, plottype, id);
// plottype: 0=line, 1=histogram, 3=cross, 4=area, 5=columns, 
//           6=circles, 7=line with breaks, 8=area with breaks, 9=step line
// Example:
plot.line('SMA 20', sma20, '#0000FF', 0);

// Filled area between two lines
plot.filledArea(id, sourceLine1, sourceLine2, title, color, opacity, visible, targetPlot);
// Example:
plot.line('Upper', upper, '#00FF00', 0, 'upper_id');
plot.line('Lower', lower, '#FF0000', 0, 'lower_id');
plot.filledArea('area1', 'upper_id', 'lower_id', 'Band', '#0000FF', 50, true, 'plot_plot');
```

## Drawing Functions

### Lines

```javascript
// Trend line
trendline(x1, y1, x2, y2, options);
// Example:
trendline(
  time(0),           // Start time
  high(0),           // Start price
  time(0) + 86400000, // End time (24 hours later)
  high(0) * 1.01,    // End price
  {
    color: '#00FF00',
    linewidth: 2,
    linestyle: 0  // 0=solid, 1=dashed, 2=dotted
  }
);

// Horizontal line
horizontalline(y, options);
// Example:
horizontalline(close, {
  color: '#FF0000',
  linewidth: 1,
  linestyle: 1
});

// Vertical line
verticalline(x, options);
```

### Shapes

```javascript
// Rectangle
rectangle(x1, y1, x2, y2, options);
// Example:
rectangle(
  time(0),              // Left time
  high(0),              // Top price
  time(0) + 14400000,   // Right time (4 hours)
  low(0),               // Bottom price
  {
    color: '#00FF00',        // Border color
    backgroundColor: 'rgba(0, 255, 0, 0.2)', // Fill color
    linewidth: 2
  }
);

// Circle
circle(centerX, centerY, radius, options);

// Triangle
triangle(x1, y1, x2, y2, x3, y3, options);
```

### Text & Labels

```javascript
// Text annotation
text(x, y, content, options);
// Example:
text(
  time(0),
  high(0),
  'Signal ▲',
  {
    color: '#00FF00',
    backgroundColor: '#00FF00',
    textColor: '#FFFFFF',
    fontSize: 12
  }
);

// Note (anchored annotation)
note(x, y, content, options);

// Icon/Emoji
emoji(x, y, emojiChar, options);
// Example:
emoji(time(0), high(0), '🚀', {fontSize: 20});
```

### Arrows

```javascript
// Arrow up
arrowup(x, y, options);

// Arrow down
arrowdown(x, y, options);

// Arrow marker
arrowmarker(x1, y1, x2, y2, options);
```

## Colors

```javascript
// Hex colors
const green = '#00FF00';
const red = '#FF0000';
const blue = '#0000FF';

// RGBA colors (with opacity)
const greenTransparent = 'rgba(0, 255, 0, 0.5)';

// Convert hex to rgba
const hexToRgba = (hex, alpha) => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Named colors (if supported)
const namedColors = {
  green: '#00FF00',
  red: '#FF0000',
  blue: '#0000FF',
  yellow: '#FFFF00',
  orange: '#FFA500',
  purple: '#800080',
  cyan: '#00FFFF',
  magenta: '#FF00FF'
};
```

## Array Management

```javascript
// Create arrays
const closeArray = [];
const highArray = [];
const lowArray = [];

// Add data
onTick = (length, _moment, _, ta, inputs) => {
  closeArray.push(closeC(0));
  highArray.push(high(0));
  lowArray.push(low(0));
  
  // Limit array size to prevent memory issues
  const maxLength = 200;
  if (closeArray.length > maxLength) {
    closeArray.shift();  // Remove oldest element
    highArray.shift();
    lowArray.shift();
  }
};

// Access array elements
const current = closeArray[closeArray.length - 1];  // Latest
const previous = closeArray[closeArray.length - 2]; // Previous
const oldest = closeArray[0];                       // Oldest

// Using .at() (modern JS)
const current = closeArray.at(-1);   // Latest
const previous = closeArray.at(-2);  // Previous
```

## Conditional Logic

```javascript
// If statements
if (condition) {
  // code
}

if (condition) {
  // code
} else {
  // code
}

if (condition1) {
  // code
} else if (condition2) {
  // code
} else {
  // code
}

// Ternary operator
const value = condition ? trueValue : falseValue;

// Logical operators
const and = condition1 && condition2;
const or = condition1 || condition2;
const not = !condition;

// Comparison operators
const equal = a === b;        // Strict equality
const notEqual = a !== b;     // Strict inequality
const greater = a > b;
const greaterOrEqual = a >= b;
const less = a < b;
const lessOrEqual = a <= b;
```

## Math Functions

```javascript
// Basic math
const sum = a + b;
const difference = a - b;
const product = a * b;
const quotient = a / b;
const remainder = a % b;
const power = Math.pow(a, b);

// Common functions
const absolute = Math.abs(value);
const sqrt = Math.sqrt(value);
const max = Math.max(a, b, c);
const min = Math.min(a, b, c);
const round = Math.round(value);
const floor = Math.floor(value);
const ceil = Math.ceil(value);

// Trigonometry
const sine = Math.sin(angle);
const cosine = Math.cos(angle);
const tangent = Math.tan(angle);
```

## Date/Time Functions

```javascript
// Get current timestamp
const current_time = time(0);  // milliseconds since epoch

// Create date object
const date = new Date(current_time);

// Extract components
const year = date.getUTCFullYear();
const month = date.getUTCMonth();      // 0-11
const day = date.getUTCDate();         // 1-31
const hour = date.getUTCHours();       // 0-23
const minute = date.getUTCMinutes();   // 0-59
const second = date.getUTCSeconds();   // 0-59

// Time calculations
const oneHour = 3600000;      // 1 hour in milliseconds
const oneDay = 86400000;      // 1 day in milliseconds
const fourHours = 14400000;   // 4 hours in milliseconds

const futureTime = current_time + fourHours;
```

## Common Patterns

### Calculate Custom Indicator

```javascript
const calculateCustomIndicator = (values, period) => {
  if (values.length < period) return null;
  
  // Your calculation logic
  const slice = values.slice(-period);
  const sum = slice.reduce((a, b) => a + b, 0);
  return sum / period;
};

onTick = (length, _moment, _, ta, inputs) => {
  closeArray.push(closeC(0));
  
  const result = calculateCustomIndicator(closeArray, inputs.period);
  if (result !== null) {
    plot.line('My Indicator', result, '#00FF00', 0);
  }
};
```

### Detect Crossover

```javascript
// Fast line crosses above slow line
const fastArray = ta.ema(closeArray, 12);
const slowArray = ta.ema(closeArray, 26);

const fastNow = fastArray.at(-1);
const fastPrev = fastArray.at(-2);
const slowNow = slowArray.at(-1);
const slowPrev = slowArray.at(-2);

const bullishCross = fastPrev < slowPrev && fastNow > slowNow;
const bearishCross = fastPrev > slowPrev && fastNow < slowNow;

if (bullishCross) {
  arrowup(time(0), low(0), {color: '#00FF00'});
}
```

### Multi-Timeframe Approximation

```javascript
// Approximate daily values from 4H chart
// 1 day = 6 4H bars
const approximateDailyClose = closeArray.length >= 6 ? 
  closeArray[closeArray.length - 6] : closeArray[0];

// Scale volatility
const atr4H = ta.atr(highArray, lowArray, closeArray, 14).at(-1);
const atrDaily = atr4H * Math.sqrt(6);
```

### Performance Optimization

```javascript
// Check if enough data before processing
if (closeArray.length < inputs.period) {
  return; // Exit early
}

// Limit calculations to necessary bars
const maxLookback = 200;
if (closeArray.length > maxLookback) {
  closeArray.shift();
  // ... other arrays
}

// Cache calculations that don't change
let cachedSMA = null;
let lastCalculatedBar = -1;

onTick = (length, _moment, _, ta, inputs) => {
  if (length !== lastCalculatedBar) {
    cachedSMA = ta.sma(closeArray, inputs.period).at(-1);
    lastCalculatedBar = length;
  }
  // Use cachedSMA
};
```

## Debugging Tips

```javascript
// Log values (if console is available)
console.log('Current close:', closeC(0));
console.log('Array length:', closeArray.length);

// Draw text to show values on chart
text(
  time(0),
  high(0),
  `Close: ${closeC(0).toFixed(2)}`,
  {fontSize: 10}
);

// Use rectangles to mark conditions
if (someCondition) {
  rectangle(
    time(0), high(0) * 1.01,
    time(0) + 3600000, high(0) * 1.005,
    {backgroundColor: 'rgba(255, 0, 0, 0.3)'}
  );
}
```

## Best Practices

1. **Initialize arrays outside onTick**
   ```javascript
   const closeArray = [];  // Global scope
   
   onTick = () => {
     closeArray.push(closeC(0));
   };
   ```

2. **Limit array sizes**
   ```javascript
   if (closeArray.length > 200) {
     closeArray.shift();
   }
   ```

3. **Check for sufficient data**
   ```javascript
   if (closeArray.length < inputs.period) return;
   ```

4. **Use descriptive names**
   ```javascript
   const fastEMA = ta.ema(closeArray, 12).at(-1);  // Good
   const e1 = ta.ema(closeArray, 12).at(-1);       // Bad
   ```

5. **Group related inputs**
   ```javascript
   init = () => {
     indicator({ onMainPanel: true, format: 'inherit' });
     // MA parameters
     input.int('Fast Period', 12, 'fastPeriod');
     input.int('Slow Period', 26, 'slowPeriod');
     // Visual parameters
     input.color('Line Color', '#00FF00', 'lineColor');
   };
   ```

6. **Handle edge cases**
   ```javascript
   const candleRange = high(0) - low(0);
   const closePosition = candleRange > 0 ? 
     (closeC(0) - low(0)) / candleRange : 0.5;
   ```

## Resources

- Official FXR Documentation: https://custom-indicators.gitbook.io/custom-indicators-docs
- Examples in documentation
- This repository's conversion notes
