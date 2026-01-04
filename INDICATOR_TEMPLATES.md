# Pine Script Indicator Templates for FxReplay

Ready-to-use templates for common indicator types. Copy, customize, and deploy!

---

## Table of Contents

1. [Basic Overlay Indicator Template](#basic-overlay-indicator-template)
2. [Basic Oscillator Template](#basic-oscillator-template)
3. [Multi-Indicator Template](#multi-indicator-template)
4. [Advanced Template with All Features](#advanced-template-with-all-features)

---

## Basic Overlay Indicator Template

Use this for indicators that display directly on the price chart (EMAs, Bollinger Bands, etc.)

```pine
//@version=5
indicator("My Overlay Indicator", shorttitle="MOI", overlay=true)

// ============================================
// INPUTS
// ============================================
length = input.int(20, "Length", minval=1, maxval=500)
source = input.source(close, "Source")
color1 = input.color(color.blue, "Line Color")

// ============================================
// CALCULATIONS
// ============================================
value = ta.sma(source, length)

// ============================================
// PLOTTING
// ============================================
plot(value, "Value", color=color1, linewidth=2)
```

---

## Basic Oscillator Template

Use this for indicators that display in a separate pane below the chart (RSI, MACD, Stochastic, etc.)

```pine
//@version=5
indicator("My Oscillator", shorttitle="MO", overlay=false)

// ============================================
// INPUTS
// ============================================
length = input.int(14, "Length", minval=1)
upperLevel = input.int(70, "Upper Level", minval=50, maxval=100)
lowerLevel = input.int(30, "Lower Level", minval=0, maxval=50)

// ============================================
// CALCULATIONS
// ============================================
oscillator = ta.rsi(close, length)

// ============================================
// PLOTTING
// ============================================
plot(oscillator, "Oscillator", color=color.blue, linewidth=2)
hline(upperLevel, "Upper", color=color.red, linestyle=hline.style_dashed)
hline(lowerLevel, "Lower", color=color.green, linestyle=hline.style_dashed)
hline(50, "Middle", color=color.gray, linestyle=hline.style_dotted)

// Background coloring
bgcolor(oscillator >= upperLevel ? color.new(color.red, 90) : na)
bgcolor(oscillator <= lowerLevel ? color.new(color.green, 90) : na)
```

---

## Multi-Indicator Template

Combine multiple calculations in one indicator

```pine
//@version=5
indicator("Multi-Indicator Combo", shorttitle="MIC", overlay=true)

// ============================================
// INPUTS
// ============================================
// Moving Averages
showMAs = input.bool(true, "Show Moving Averages")
emaLength = input.int(20, "EMA Length")
smaLength = input.int(50, "SMA Length")

// Bollinger Bands
showBB = input.bool(true, "Show Bollinger Bands")
bbLength = input.int(20, "BB Length")
bbMult = input.float(2.0, "BB Multiplier")

// Signals
showSignals = input.bool(true, "Show Buy/Sell Signals")

// ============================================
// CALCULATIONS
// ============================================
// Moving Averages
ema = ta.ema(close, emaLength)
sma = ta.sma(close, smaLength)

// Bollinger Bands
bbBasis = ta.sma(close, bbLength)
bbDev = bbMult * ta.stdev(close, bbLength)
bbUpper = bbBasis + bbDev
bbLower = bbBasis - bbDev

// Signals
buySignal = ta.crossover(ema, sma) and close > bbBasis
sellSignal = ta.crossunder(ema, sma) and close < bbBasis

// ============================================
// PLOTTING
// ============================================
// Moving Averages
plot(showMAs ? ema : na, "EMA", color=color.blue, linewidth=2)
plot(showMAs ? sma : na, "SMA", color=color.red, linewidth=2)

// Bollinger Bands
plot(showBB ? bbUpper : na, "BB Upper", color=color.gray, linewidth=1)
plot(showBB ? bbLower : na, "BB Lower", color=color.gray, linewidth=1)
plot(showBB ? bbBasis : na, "BB Basis", color=color.orange, linewidth=1, style=plot.style_line)

// Fill between bands
bbPlotUpper = plot(showBB ? bbUpper : na, display=display.none)
bbPlotLower = plot(showBB ? bbLower : na, display=display.none)
fill(bbPlotUpper, bbPlotLower, color=color.new(color.blue, 95))

// Signals
plotshape(showSignals and buySignal, "Buy", shape.triangleup, location.belowbar, color.green, size=size.small)
plotshape(showSignals and sellSignal, "Sell", shape.triangledown, location.abovebar, color.red, size=size.small)

// ============================================
// ALERTS
// ============================================
alertcondition(buySignal, "Buy Alert", "Buy signal triggered!")
alertcondition(sellSignal, "Sell Alert", "Sell signal triggered!")
```

---

## Advanced Template with All Features

Complete template with inputs, calculations, plots, labels, table, and alerts

```pine
//@version=5
indicator("Advanced Indicator Template", shorttitle="AIT", overlay=true)

// ============================================
// DESCRIPTION & CREDITS
// ============================================
// This is a comprehensive template showing all major Pine Script features
// Author: Your Name
// Version: 1.0
// Date: 2026-01-04
// ============================================

// ============================================
// INPUTS - All Input Types
// ============================================
// Boolean inputs
enableIndicator = input.bool(true, "Enable Indicator", group="General")
showLabels = input.bool(false, "Show Labels", group="Display")
showTable = input.bool(true, "Show Statistics Table", group="Display")

// Integer inputs
length1 = input.int(20, "Primary Length", minval=1, maxval=500, group="Calculations")
length2 = input.int(50, "Secondary Length", minval=1, maxval=500, group="Calculations")

// Float inputs
multiplier = input.float(2.0, "Multiplier", minval=0.1, maxval=10.0, step=0.1, group="Calculations")

// Source inputs
source = input.source(close, "Source", group="Calculations")

// String inputs
mode = input.string("SMA", "Mode", options=["SMA", "EMA", "WMA", "VWMA"], group="Calculations")

// Color inputs
color1 = input.color(color.new(color.blue, 0), "Primary Color", group="Colors")
color2 = input.color(color.new(color.red, 0), "Secondary Color", group="Colors")
bullColor = input.color(color.new(color.green, 80), "Bullish Fill", group="Colors")
bearColor = input.color(color.new(color.red, 80), "Bearish Fill", group="Colors")

// Timeframe input
htfTimeframe = input.timeframe("D", "Higher Timeframe", group="Advanced")

// ============================================
// FUNCTIONS - Custom Functions
// ============================================
// Custom function example
customMA(src, len, maType) =>
    switch maType
        "SMA" => ta.sma(src, len)
        "EMA" => ta.ema(src, len)
        "WMA" => ta.wma(src, len)
        "VWMA" => ta.vwma(src, len)
        => ta.sma(src, len)

// ============================================
// CALCULATIONS
// ============================================
// Calculate moving averages
ma1 = customMA(source, length1, mode)
ma2 = customMA(source, length2, mode)

// Higher timeframe calculation
htfMA = request.security(syminfo.tickerid, htfTimeframe, customMA(source, length1, mode))

// Trend detection
isBullish = ma1 > ma2
isBearish = ma1 < ma2
trendChanged = ta.change(isBullish)

// Crossover detection
bullCross = ta.crossover(ma1, ma2)
bearCross = ta.crossunder(ma1, ma2)

// Distance from MA (for overbought/oversold)
distanceFromMA = (close - ma1) / ma1 * 100

// Volatility calculation
volatility = ta.stdev(close, length1)
bollingerUpper = ma1 + (volatility * multiplier)
bollingerLower = ma1 - (volatility * multiplier)

// ============================================
// PLOTTING
// ============================================
// Plot moving averages
p1 = plot(enableIndicator ? ma1 : na, "MA1", color=color1, linewidth=2)
p2 = plot(enableIndicator ? ma2 : na, "MA2", color=color2, linewidth=2)

// Fill between MAs
fillColor = isBullish ? bullColor : bearColor
fill(p1, p2, color=enableIndicator ? fillColor : na, title="Trend Fill")

// Plot Bollinger Bands style envelope
plot(enableIndicator ? bollingerUpper : na, "Upper Band", color=color.gray, linewidth=1, style=plot.style_line)
plot(enableIndicator ? bollingerLower : na, "Lower Band", color=color.gray, linewidth=1, style=plot.style_line)

// Plot HTF MA
plot(enableIndicator ? htfMA : na, "HTF MA", color=color.purple, linewidth=3, style=plot.style_circles)

// Plot signals
plotshape(enableIndicator and bullCross, "Buy Signal", shape.triangleup, location.belowbar, 
          color=color.new(color.green, 0), size=size.small, text="BUY")
plotshape(enableIndicator and bearCross, "Sell Signal", shape.triangledown, location.abovebar, 
          color=color.new(color.red, 0), size=size.small, text="SELL")

// Background coloring
bgcolor(enableIndicator and isBullish ? color.new(color.green, 97) : 
        enableIndicator and isBearish ? color.new(color.red, 97) : na, title="Trend Background")

// ============================================
// LABELS
// ============================================
if showLabels and enableIndicator
    if bullCross
        label.new(bar_index, low, "BUY\n" + str.tostring(close, "#.####"), 
                  color=color.green, textcolor=color.white, style=label.style_label_up, size=size.normal)
    if bearCross
        label.new(bar_index, high, "SELL\n" + str.tostring(close, "#.####"), 
                  color=color.red, textcolor=color.white, style=label.style_label_down, size=size.normal)

// ============================================
// TABLE - Statistics Display
// ============================================
if showTable and enableIndicator
    var table statsTable = table.new(position.top_right, 2, 6, border_width=1)
    
    if barstate.islast
        // Header
        table.cell(statsTable, 0, 0, "Indicator Stats", bgcolor=color.new(color.gray, 30), 
                   text_color=color.white, text_size=size.normal)
        table.cell(statsTable, 1, 0, "", bgcolor=color.new(color.gray, 30))
        
        // Current price
        table.cell(statsTable, 0, 1, "Price:", bgcolor=color.new(color.gray, 70), text_color=color.white)
        table.cell(statsTable, 1, 1, str.tostring(close, "#.####"), bgcolor=color.new(color.gray, 70), 
                   text_color=color.white)
        
        // MA1 value
        table.cell(statsTable, 0, 2, "MA1:", bgcolor=color.new(color.gray, 70), text_color=color.white)
        table.cell(statsTable, 1, 2, str.tostring(ma1, "#.####"), bgcolor=color.new(color1, 70), 
                   text_color=color.white)
        
        // MA2 value
        table.cell(statsTable, 0, 3, "MA2:", bgcolor=color.new(color.gray, 70), text_color=color.white)
        table.cell(statsTable, 1, 3, str.tostring(ma2, "#.####"), bgcolor=color.new(color2, 70), 
                   text_color=color.white)
        
        // Trend
        table.cell(statsTable, 0, 4, "Trend:", bgcolor=color.new(color.gray, 70), text_color=color.white)
        trendText = isBullish ? "BULLISH ↑" : "BEARISH ↓"
        trendBgColor = isBullish ? color.green : color.red
        table.cell(statsTable, 1, 4, trendText, bgcolor=trendBgColor, text_color=color.white)
        
        // Distance from MA
        table.cell(statsTable, 0, 5, "Distance:", bgcolor=color.new(color.gray, 70), text_color=color.white)
        distanceColor = distanceFromMA > 0 ? color.green : color.red
        table.cell(statsTable, 1, 5, str.tostring(distanceFromMA, "#.##") + "%", 
                   bgcolor=color.new(distanceColor, 70), text_color=color.white)

// ============================================
// ALERTS
// ============================================
alertcondition(bullCross, "Bullish Crossover", "MA1 crossed above MA2 - Buy Signal!")
alertcondition(bearCross, "Bearish Crossover", "MA1 crossed below MA2 - Sell Signal!")
alertcondition(trendChanged, "Trend Change", "Trend direction has changed!")
alertcondition(close > bollingerUpper, "Price Above Upper Band", "Price exceeded upper Bollinger Band!")
alertcondition(close < bollingerLower, "Price Below Lower Band", "Price fell below lower Bollinger Band!")

// ============================================
// NOTES FOR CUSTOMIZATION
// ============================================
// 1. Replace calculations with your own logic
// 2. Adjust input parameters for your strategy
// 3. Customize colors and display options
// 4. Add/remove features as needed
// 5. Test thoroughly before deploying to FxReplay
// ============================================
```

---

## Common Pine Script Functions Quick Reference

### Moving Averages
```pine
sma = ta.sma(close, 20)           // Simple Moving Average
ema = ta.ema(close, 20)           // Exponential Moving Average
wma = ta.wma(close, 20)           // Weighted Moving Average
vwma = ta.vwma(close, 20)         // Volume Weighted Moving Average
```

### Oscillators & Indicators
```pine
rsi = ta.rsi(close, 14)           // Relative Strength Index
macd = ta.macd(close, 12, 26, 9)  // MACD
stoch = ta.stoch(close, high, low, 14)  // Stochastic
```

### Price Action
```pine
highest = ta.highest(high, 20)    // Highest value in period
lowest = ta.lowest(low, 20)       // Lowest value in period
range = ta.range(high, low, 20)   // True Range
atr = ta.atr(14)                  // Average True Range
```

### Crossovers & Conditions
```pine
crossOver = ta.crossover(fast, slow)    // Fast crosses above slow
crossUnder = ta.crossunder(fast, slow)  // Fast crosses below slow
change = ta.change(close)               // Change from previous bar
```

### Volatility
```pine
stdev = ta.stdev(close, 20)       // Standard Deviation
variance = ta.variance(close, 20)  // Variance
```

---

## Template Selection Guide

| Indicator Type | Use This Template | Example Indicators |
|---------------|-------------------|-------------------|
| Price Overlay | Basic Overlay | EMAs, SMAs, Bollinger Bands, SAR |
| Momentum/Strength | Basic Oscillator | RSI, Stochastic, CCI |
| Trend Following | Multi-Indicator | MACD, ADX, Ichimoku |
| Volume Analysis | Basic Oscillator | Volume Profile, OBV, MFI |
| Complex Strategy | Advanced | Combined strategies, multi-timeframe |

---

## Usage Tips

1. **Start with the appropriate template** based on your indicator type
2. **Customize the inputs** to match your strategy parameters
3. **Modify calculations** to implement your specific logic
4. **Adjust plots** for visual clarity
5. **Test in TradingView** before deploying to FxReplay
6. **Add comments** to document your changes

---

## Next Steps

1. Choose a template from above
2. Copy it to a new `.pine` file
3. Customize it for your needs
4. Test it in TradingView Pine Editor
5. Deploy to FxReplay following the Quick Start Guide
6. Iterate and improve!

---

**Ready-to-use examples**: Check `/workspace/example_indicators/` for complete, working indicators!

**Last Updated**: January 4, 2026
