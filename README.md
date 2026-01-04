# FxReplay Custom Indicator Integration Guide

This guide walks you through every step of adding your own indicator scripts to FxReplay.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Understanding FxReplay's Indicator System](#understanding-fxreplays-indicator-system)
3. [Step-by-Step Integration Process](#step-by-step-integration-process)
4. [Indicator Script Format](#indicator-script-format)
5. [Testing Your Indicators](#testing-your-indicators)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:
- [ ] FxReplay installed and working on your system
- [ ] Basic understanding of Pine Script (TradingView's scripting language)
- [ ] Your custom indicator script written and tested
- [ ] Text editor or IDE for editing scripts

---

## Understanding FxReplay's Indicator System

FxReplay uses indicators to provide technical analysis during forex market replay sessions. The system supports:

- **Built-in indicators**: Pre-loaded indicators that come with FxReplay
- **Custom indicators**: User-created indicators that you can add
- **Pine Script compatibility**: Scripts written in Pine Script format

---

## Step-by-Step Integration Process

### Step 1: Locate the FxReplay Indicators Folder

1. Open FxReplay on your computer
2. Navigate to the FxReplay installation directory:
   - **Windows**: `C:\Program Files\FxReplay\` or `C:\Program Files (x86)\FxReplay\`
   - **Mac**: `/Applications/FxReplay.app/Contents/`
   - **Linux**: `~/.local/share/FxReplay/` or `/opt/FxReplay/`

3. Find the `indicators` folder (or `custom_indicators` folder)
   - If it doesn't exist, create a folder named `custom_indicators`

### Step 2: Prepare Your Indicator Script

1. **Save your indicator script** with a descriptive name
   - Use `.pine` or `.txt` extension
   - Example: `my_custom_ema.pine`

2. **Verify your script format** (see [Indicator Script Format](#indicator-script-format) section below)

3. **Check for required components**:
   - `//@version=5` (or your Pine Script version)
   - `indicator()` declaration with a title
   - Plot statements for visual output

### Step 3: Copy the Script to FxReplay

1. Copy your indicator script file to the indicators folder:
   ```
   /path/to/FxReplay/custom_indicators/your_indicator.pine
   ```

2. Ensure the file has proper read permissions:
   - **Windows**: Right-click → Properties → Security
   - **Mac/Linux**: `chmod 644 your_indicator.pine`

### Step 4: Register the Indicator (If Required)

Some FxReplay versions require indicator registration:

1. Open the `indicators.json` or `config.json` file in the FxReplay directory

2. Add your indicator entry:
   ```json
   {
     "custom_indicators": [
       {
         "name": "My Custom EMA",
         "file": "my_custom_ema.pine",
         "enabled": true,
         "category": "Moving Averages"
       }
     ]
   }
   ```

3. Save the configuration file

### Step 5: Restart FxReplay

1. Close FxReplay completely (check system tray/menu bar)
2. Reopen FxReplay
3. The application will scan and load custom indicators

### Step 6: Enable Your Indicator

1. Open FxReplay and start a replay session
2. Right-click on the chart or go to **Indicators** menu
3. Look for your custom indicator in the list
4. Click to add it to the chart
5. Configure any parameters if prompted

### Step 7: Configure Indicator Settings (Optional)

1. Right-click on the indicator name in the chart legend
2. Select **Settings** or **Format**
3. Adjust:
   - Input parameters (periods, lengths, etc.)
   - Colors and line styles
   - Visibility settings

---

## Indicator Script Format

Your indicator script should follow this basic structure:

```pine
//@version=5
indicator("My Custom Indicator", overlay=true)

// Input parameters
length = input.int(14, "Length", minval=1)
source = input.source(close, "Source")

// Calculation logic
value = ta.sma(source, length)

// Plot output
plot(value, "SMA", color=color.blue, linewidth=2)
```

### Key Components:

1. **Version Declaration**: `//@version=5`
2. **Indicator Declaration**: `indicator(title, short_title, overlay, format, precision)`
3. **Inputs**: `input.int()`, `input.float()`, `input.string()`, etc.
4. **Calculations**: Your indicator logic
5. **Outputs**: `plot()`, `plotshape()`, `bgcolor()`, etc.

### Example: Simple Moving Average Crossover

```pine
//@version=5
indicator("SMA Crossover", overlay=true)

// Inputs
fastLength = input.int(9, "Fast SMA Length", minval=1)
slowLength = input.int(21, "Slow SMA Length", minval=1)

// Calculate SMAs
fastSMA = ta.sma(close, fastLength)
slowSMA = ta.sma(close, slowLength)

// Plot
plot(fastSMA, "Fast SMA", color=color.blue, linewidth=2)
plot(slowSMA, "Slow SMA", color=color.red, linewidth=2)

// Crossover signals
bullishCross = ta.crossover(fastSMA, slowSMA)
bearishCross = ta.crossunder(fastSMA, slowSMA)

plotshape(bullishCross, "Buy Signal", shape.triangleup, location.belowbar, color.green, size=size.small)
plotshape(bearishCross, "Sell Signal", shape.triangledown, location.abovebar, color.red, size=size.small)
```

---

## Testing Your Indicators

### Basic Testing Checklist:

1. **Visual Verification**
   - [ ] Indicator displays on the chart
   - [ ] Colors and styles are correct
   - [ ] Lines/shapes appear where expected

2. **Functionality Testing**
   - [ ] Change input parameters and verify recalculation
   - [ ] Test on different timeframes
   - [ ] Test on different currency pairs
   - [ ] Verify signals on historical data

3. **Performance Testing**
   - [ ] Chart loads without lag
   - [ ] No error messages in console
   - [ ] Indicator updates in real-time during replay

### Testing Different Scenarios:

```
Test Case 1: Basic Display
- Add indicator to chart
- Verify it appears correctly

Test Case 2: Parameter Changes
- Adjust input values
- Confirm indicator recalculates

Test Case 3: Multiple Timeframes
- Switch from M5 to H1 to D1
- Ensure indicator adapts properly

Test Case 4: Multiple Instances
- Add the same indicator twice with different settings
- Verify both work independently
```

---

## Troubleshooting

### Common Issues and Solutions:

#### Issue 1: Indicator Not Appearing in List
**Possible Causes:**
- File in wrong directory
- Incorrect file format/extension
- Syntax errors in script

**Solutions:**
- Verify file location matches FxReplay's indicators folder
- Check file extension (.pine or .txt)
- Validate Pine Script syntax in TradingView Pine Editor first

#### Issue 2: Indicator Loads but Doesn't Display
**Possible Causes:**
- Wrong overlay setting
- Scale/precision issues
- No data to plot

**Solutions:**
- Check `overlay=true` for price overlay, `overlay=false` for separate pane
- Verify calculations produce valid numbers
- Use `plot()` statements to output values

#### Issue 3: Errors on Chart
**Possible Causes:**
- Incompatible Pine Script version
- Missing required functions
- Data type mismatches

**Solutions:**
- Match Pine Script version with FxReplay compatibility
- Simplify script to identify problematic functions
- Check variable types and conversions

#### Issue 4: Indicator Slows Down Chart
**Possible Causes:**
- Complex calculations
- Too many plot statements
- Inefficient loops

**Solutions:**
- Optimize calculation logic
- Reduce number of visual elements
- Use built-in functions instead of custom loops

### Getting Help:

1. **Check FxReplay Documentation**: Official docs may have version-specific instructions
2. **Community Forums**: FxReplay user forums for custom indicator support
3. **Pine Script Reference**: [TradingView Pine Script documentation](https://www.tradingview.com/pine-script-docs/en/v5/)
4. **Test in TradingView First**: Validate script in TradingView before adding to FxReplay

---

## Quick Reference: File Locations

### Windows
```
FxReplay Directory: C:\Program Files\FxReplay\
Indicators Folder: C:\Program Files\FxReplay\custom_indicators\
Config File: C:\Program Files\FxReplay\config\indicators.json
```

### macOS
```
FxReplay Directory: /Applications/FxReplay.app/Contents/
Indicators Folder: /Applications/FxReplay.app/Contents/Resources/custom_indicators/
Config File: /Applications/FxReplay.app/Contents/Resources/config/indicators.json
```

### Linux
```
FxReplay Directory: ~/.local/share/FxReplay/
Indicators Folder: ~/.local/share/FxReplay/custom_indicators/
Config File: ~/.local/share/FxReplay/config/indicators.json
```

---

## Best Practices

1. **Naming Conventions**
   - Use descriptive names: `rsi_divergence.pine` not `ind1.pine`
   - Avoid spaces: `my_indicator.pine` not `my indicator.pine`

2. **Version Control**
   - Keep backups of working indicators
   - Document changes with comments in the script
   - Use version numbers in filenames if iterating

3. **Performance**
   - Keep calculations efficient
   - Limit the number of plot statements
   - Test with various data ranges

4. **Documentation**
   - Add comments explaining your logic
   - Include usage instructions in script header
   - Document input parameter meanings

---

## Example: Complete Custom Indicator

Here's a complete example you can use as a template:

```pine
//@version=5
indicator("Custom Bollinger Bands RSI", shorttitle="BB-RSI", overlay=true)

// ============================================
// INPUTS
// ============================================
bbLength = input.int(20, "BB Length", minval=1)
bbMult = input.float(2.0, "BB StdDev", minval=0.1, step=0.1)
rsiLength = input.int(14, "RSI Length", minval=1)
rsiOverbought = input.int(70, "RSI Overbought", minval=50, maxval=100)
rsiOversold = input.int(30, "RSI Oversold", minval=0, maxval=50)

// ============================================
// CALCULATIONS
// ============================================
// Bollinger Bands
basis = ta.sma(close, bbLength)
dev = bbMult * ta.stdev(close, bbLength)
upperBand = basis + dev
lowerBand = basis - dev

// RSI
rsi = ta.rsi(close, rsiLength)

// Signals
buySignal = close <= lowerBand and rsi <= rsiOversold
sellSignal = close >= upperBand and rsi >= rsiOverbought

// ============================================
// PLOTS
// ============================================
plot(basis, "Basis", color=color.blue, linewidth=2)
plot(upperBand, "Upper Band", color=color.red, linewidth=1)
plot(lowerBand, "Lower Band", color=color.green, linewidth=1)

// Background fill
fill(plot(upperBand), plot(lowerBand), color=color.new(color.blue, 95))

// Signals
plotshape(buySignal, "Buy", shape.labelup, location.belowbar, color.new(color.green, 0), text="BUY", textcolor=color.white)
plotshape(sellSignal, "Sell", shape.labeldown, location.abovebar, color.new(color.red, 0), text="SELL", textcolor=color.white)

// Alerts
alertcondition(buySignal, "Buy Alert", "Buy Signal Triggered!")
alertcondition(sellSignal, "Sell Alert", "Sell Signal Triggered!")
```

---

## Summary Checklist

When adding a custom indicator to FxReplay, follow this checklist:

- [ ] **Step 1**: Locate FxReplay indicators folder
- [ ] **Step 2**: Prepare and validate your Pine Script
- [ ] **Step 3**: Copy script to indicators folder
- [ ] **Step 4**: Register indicator (if config file exists)
- [ ] **Step 5**: Restart FxReplay
- [ ] **Step 6**: Add indicator to chart
- [ ] **Step 7**: Configure settings as needed
- [ ] **Step 8**: Test thoroughly on different scenarios

---

## Additional Resources

- **Pine Script v5 Documentation**: https://www.tradingview.com/pine-script-docs/
- **FxReplay Official Website**: Check for latest documentation
- **TradingView Public Library**: Browse community indicators for inspiration

---

**Last Updated**: January 4, 2026
**Version**: 1.0
