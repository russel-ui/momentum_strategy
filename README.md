# Liquidity Sweep Detection - Pine Script Library & Strategy

This repository contains a complete implementation of a **Liquidity Sweep Detection System** for TradingView, designed for the **4H timeframe**. The system is built using Pine Script v5 and demonstrates how to create a reusable library and use it in a backtesting strategy.

## 📁 Files Overview

1. **`liquidity_sweep_library.pine`** - The core library containing reusable liquidity sweep detection functions
2. **`liquidity_sweep_strategy.pine`** - A complete strategy that imports the library for backtesting
3. **`liquidity_sweep_indicator.pine`** - A standalone indicator version (no library dependency)

## 🎯 What is a Liquidity Sweep?

A **liquidity sweep** occurs when price briefly moves beyond a significant level (like a swing high/low) to trigger stop losses and grab liquidity, then quickly reverses in the opposite direction. This creates a false breakout and often marks the beginning of a strong move in the reversal direction.

### Types of Liquidity Sweeps:

- **Bullish Sweep**: Price sweeps below a recent low, triggers sell stops, then reverses upward
- **Bearish Sweep**: Price sweeps above a recent high, triggers buy stops, then reverses downward

## 🔧 How to Convert Your Indicator to a Library

### Step 1: Create the Library File

Your library file must:
- Start with `//@version=5`
- Use the `library()` function declaration
- Export functions using the `export` keyword
- Have a unique library name

```pine
//@version=5
library("YourLibraryName", overlay=true)

export yourFunction(param1, param2) =>
    // Your logic here
    result
```

### Step 2: Publish the Library

1. Open TradingView Pine Editor
2. Paste your library code
3. Click **"Publish Script"** (not "Add to Chart")
4. Select **"Public Library"** or **"Invite-only Library"**
5. Fill in the description and details
6. Click **"Publish Public Library"**
7. Note the version number (usually starts at 1)

### Step 3: Import the Library in Your Strategy

```pine
//@version=5
strategy("Your Strategy Name", overlay=true)

// Import format: import Username/LibraryName/Version as Alias
import YourUsername/LiquiditySweepDetector/1 as lsd

// Now you can use the library functions
[bullSweep, bearSweep, sweepLevel] = lsd.detectPivotBasedSweep(10, 5, 0.001)
```

## 📚 Library Functions Documentation

### `detectBullishSweep(lookback, atrMultiplier, atrLength)`

Detects bullish liquidity sweeps using a simple lookback method.

**Parameters:**
- `lookback` (int): Number of bars to look back for swing lows (default: 20)
- `atrMultiplier` (float): ATR multiplier for sweep threshold (default: 0.5)
- `atrLength` (int): ATR period length (default: 14)

**Returns:** `[isBullishSweep, sweepPrice]`
- `isBullishSweep` (bool): True if bullish sweep detected
- `sweepPrice` (float): The price level that was swept

### `detectBearishSweep(lookback, atrMultiplier, atrLength)`

Detects bearish liquidity sweeps using a simple lookback method.

**Parameters:** Same as `detectBullishSweep`

**Returns:** `[isBearishSweep, sweepPrice]`

### `detectPivotBasedSweep(leftBars, rightBars, sweepThreshold)`

Advanced detection using pivot points (recommended method).

**Parameters:**
- `leftBars` (int): Number of bars to the left for pivot (default: 10)
- `rightBars` (int): Number of bars to the right for pivot (default: 5)
- `sweepThreshold` (float): Percentage threshold for sweep detection (default: 0.001 = 0.1%)

**Returns:** `[bullishSweep, bearishSweep, sweepLevel]`
- `bullishSweep` (bool): True if bullish sweep detected
- `bearishSweep` (bool): True if bearish sweep detected
- `sweepLevel` (float): The price level that was swept

### `getStopLoss(sweepPrice, isBullish, atrMultiplier, atrLength)`

Calculates recommended stop loss based on the sweep level and ATR.

**Parameters:**
- `sweepPrice` (float): The price level where sweep occurred
- `isBullish` (bool): True for bullish sweep, false for bearish
- `atrMultiplier` (float): ATR multiplier for stop distance (default: 1.5)
- `atrLength` (int): ATR period (default: 14)

**Returns:** `stopLoss` (float): Recommended stop loss price

### `getTakeProfit(entryPrice, stopLoss, riskRewardRatio)`

Calculates take profit based on risk-reward ratio.

**Parameters:**
- `entryPrice` (float): Entry price for the trade
- `stopLoss` (float): Stop loss price
- `riskRewardRatio` (float): Desired risk-reward ratio (default: 2.0 for 1:2 R:R)

**Returns:** `takeProfit` (float): Recommended take profit price

## 🚀 How to Use

### Option A: Using the Library in a Strategy (Recommended for Backtesting)

1. **First, publish the library:**
   - Copy `liquidity_sweep_library.pine` code
   - Open TradingView Pine Editor
   - Paste and publish as a library
   - Note your username and version number

2. **Then, use it in your strategy:**
   - Copy `liquidity_sweep_strategy.pine` code
   - Replace `YourUsername` on line 10 with your actual TradingView username
   - Replace version `/1` with your published version if different
   - Add to chart and start backtesting!

### Option B: Using the Standalone Indicator

1. Copy `liquidity_sweep_indicator.pine` code
2. Open TradingView Pine Editor
3. Paste and "Add to Chart"
4. No library dependency required!

## ⚙️ Strategy Settings

### Detection Parameters:
- **Lookback Period**: Number of bars to scan for highs/lows (default: 20)
- **Pivot Left/Right Bars**: Pivot detection sensitivity (default: 10/5)
- **Sweep Threshold**: Minimum price breach percentage (default: 0.1%)

### Risk Management:
- **ATR Length**: Period for ATR calculation (default: 14)
- **ATR Multiplier**: Stop loss distance in ATR units (default: 1.5)
- **Risk:Reward Ratio**: Target profit vs risk (default: 2:1)

### Entry Conditions:
- **Use Pivot-Based Detection**: More precise, waits for confirmed pivots
- **Use Simple Lookback Detection**: Faster signals, may be less accurate
- **Require Next Candle Confirmation**: Reduces false signals

### Trade Management:
- **Use Trailing Stop**: Dynamic stop loss that follows price
- **Trailing Stop ATR Multiplier**: Distance for trailing stop (default: 2.0)

## 📊 Backtesting Tips

1. **Use on 4H timeframe** - The strategy is optimized for 4-hour charts
2. **Test on multiple assets** - Different markets behave differently
3. **Adjust lookback periods** - Higher for trending markets, lower for ranging
4. **Monitor win rate and profit factor** - Aim for >40% win rate with 2:1 R:R
5. **Consider spread and commissions** - Add realistic trading costs in strategy settings

## 🎨 Indicator Features

### Visual Signals:
- 🟢 Green triangle below bar = Bullish sweep detected
- 🔴 Red triangle above bar = Bearish sweep detected
- Yellow circles = Swept price levels
- Dashed lines = Support/Resistance from sweeps
- Background tint = Confirmation waiting period

### Alerts:
- Set custom alerts when sweeps are detected
- Get notified on any timeframe
- Customize alert messages for your needs

## 🔄 Converting Your Existing Indicator

If you already have a liquidity sweep indicator, here's how to convert it to a library:

1. **Identify your core logic** - Find the functions that detect sweeps
2. **Create library file** - Use `library()` instead of `indicator()`
3. **Export functions** - Add `export` keyword before function definitions
4. **Remove visual elements** - Libraries can't plot or create shapes
5. **Return values instead of plotting** - Functions should return data, not visualize
6. **Test before publishing** - Create a test strategy to verify it works

### Example Conversion:

**Before (Indicator):**
```pine
//@version=5
indicator("My Sweep Detector", overlay=true)

// Detection logic
bullSweep = low < ta.lowest(low, 20)[1] and close > ta.lowest(low, 20)[1]

// Visual output
plotshape(bullSweep, style=shape.triangleup, location=location.belowbar, color=color.green)
```

**After (Library):**
```pine
//@version=5
library("MySweepDetector", overlay=true)

export detectSweep(int lookback = 20) =>
    // Detection logic
    bullSweep = low < ta.lowest(low, lookback)[1] and close > ta.lowest(low, lookback)[1]
    
    // Return value instead of plotting
    [bullSweep, ta.lowest(low, lookback)[1]]
```

## 🤝 Benefits of Using a Library

1. **Reusability** - Write once, use in multiple strategies
2. **Maintainability** - Update logic in one place
3. **Organization** - Keep code clean and modular
4. **Sharing** - Easily share with the community
5. **Testing** - Test indicator logic separately from strategy logic

## 📈 Example Use Cases

### 1. Swing Trading Strategy
- Timeframe: 4H
- Enter on sweep detection
- Hold for 2:1 R:R target
- Use trailing stop after 1:1

### 2. Scalping Strategy
- Timeframe: 15m or 1H
- Quick entries on sweep
- Tight stops (1 ATR)
- Target: 1.5:1 R:R

### 3. Confluence Trading
- Combine with:
  - Volume profile
  - Order blocks
  - Fair value gaps
  - Fibonacci levels

## ⚠️ Important Notes

1. **Timeframe Dependency** - This is designed for 4H but can be adapted
2. **Market Conditions** - Works best in ranging and sideways markets
3. **False Signals** - Use confirmation and filters to reduce noise
4. **Risk Management** - Always use proper position sizing
5. **Library Publishing** - Must publish library before importing in strategy

## 🐛 Troubleshooting

### "Cannot import script" error
- Make sure library is published first
- Check username spelling
- Verify version number
- Ensure library is public or you have access

### Strategy not taking trades
- Verify you're on 4H timeframe
- Check if parameters are too strict
- Look at strategy tester logs
- Ensure sufficient capital for position sizing

### Indicator not showing signals
- Adjust pivot bar settings
- Lower sweep threshold
- Check if price action has actual sweeps
- Try different detection method

## 📞 Support

For questions or issues:
1. Check the Pine Script documentation: https://www.tradingview.com/pine-script-docs/
2. Review TradingView's library guide: https://www.tradingview.com/pine-script-docs/concepts/libraries
3. Test with different parameters to optimize for your trading style

## 📄 License

This code is subject to the Mozilla Public License 2.0.

## 🎓 Learning Resources

- [Pine Script v5 User Manual](https://www.tradingview.com/pine-script-docs/en/v5/Introduction.html)
- [Libraries in Pine Script](https://www.tradingview.com/pine-script-docs/en/v5/concepts/Libraries.html)
- [Strategy Testing](https://www.tradingview.com/pine-script-docs/en/v5/concepts/Strategies.html)

---

**Happy Trading! 📊**

Remember: This is a tool to assist your trading, not a guarantee of profits. Always practice proper risk management and test thoroughly before using with real capital.
