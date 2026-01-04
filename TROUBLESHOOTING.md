# FxReplay Custom Indicator Troubleshooting Guide

Complete troubleshooting reference for common issues when adding custom indicators to FxReplay.

---

## Quick Diagnostic Checklist

Before diving into specific issues, run through this checklist:

- [ ] FxReplay is completely closed (check system tray/taskbar)
- [ ] Indicator file is in the correct directory
- [ ] File has correct extension (`.pine` or `.txt`)
- [ ] Script starts with `//@version=5` (or appropriate version)
- [ ] Script has been tested in TradingView Pine Editor
- [ ] No syntax errors in the script
- [ ] FxReplay has been restarted after adding the indicator

---

## Issue Category Index

1. [Indicator Not Appearing in List](#issue-1-indicator-not-appearing-in-list)
2. [Indicator Loads But Nothing Displays](#issue-2-indicator-loads-but-nothing-displays)
3. [Script Errors on Chart](#issue-3-script-errors-on-chart)
4. [Incorrect Values or Calculations](#issue-4-incorrect-values-or-calculations)
5. [Performance Issues](#issue-5-performance-issues)
6. [Visual Display Problems](#issue-6-visual-display-problems)
7. [FxReplay Crashes](#issue-7-fxreplay-crashes)
8. [Updates Not Reflecting](#issue-8-updates-not-reflecting)

---

## Issue 1: Indicator Not Appearing in List

### Symptoms
- Added indicator file but it doesn't show up in FxReplay's indicator menu
- Indicator list is empty or incomplete

### Possible Causes & Solutions

#### Cause A: Wrong Directory
**Check:** Is the file in the correct folder?

**Solution:**
```bash
# Verify file location
# Windows: C:\Program Files\FxReplay\custom_indicators\
# Mac: /Applications/FxReplay.app/Contents/Resources/custom_indicators/
# Linux: ~/.local/share/FxReplay/custom_indicators/

# List files to confirm
ls -la /path/to/FxReplay/custom_indicators/
```

#### Cause B: Incorrect File Extension
**Check:** File must be `.pine`, `.txt`, or whatever extension FxReplay expects

**Solution:**
```bash
# Rename file if needed
mv my_indicator.script my_indicator.pine
```

#### Cause C: Missing Version Declaration
**Check:** Script must start with version declaration

**Solution:** Add to the very first line:
```pine
//@version=5
indicator("My Indicator", overlay=true)
```

#### Cause D: Syntax Errors
**Check:** Script has compilation errors

**Solution:**
1. Copy your script to TradingView Pine Editor
2. Look for red error indicators
3. Fix all syntax errors
4. Test until it compiles successfully
5. Copy back to FxReplay

#### Cause E: FxReplay Not Restarted
**Check:** Did you restart FxReplay after adding the file?

**Solution:**
1. Close FxReplay completely
2. Check Task Manager/Activity Monitor to ensure it's fully closed
3. Reopen FxReplay
4. Check indicator list again

#### Cause F: Configuration File Issue
**Check:** Some FxReplay versions require indicator registration

**Solution:** Look for `indicators.json` or `config.json` and add:
```json
{
  "custom_indicators": [
    {
      "name": "My Indicator",
      "file": "my_indicator.pine",
      "enabled": true
    }
  ]
}
```

---

## Issue 2: Indicator Loads But Nothing Displays

### Symptoms
- Indicator appears in list and can be added to chart
- No visual elements appear on the chart
- No error messages

### Possible Causes & Solutions

#### Cause A: Wrong Overlay Setting
**Check:** Indicator placement setting

**Solution:** Adjust the `overlay` parameter:
```pine
// For indicators that should appear ON the price chart (EMAs, Bollinger Bands)
indicator("My Indicator", overlay=true)

// For indicators that should appear BELOW the chart (RSI, MACD)
indicator("My Indicator", overlay=false)
```

#### Cause B: No Plot Statements
**Check:** Script must have plot statements to display anything

**Solution:** Add plot statements:
```pine
// Calculate your value
value = ta.sma(close, 20)

// Then PLOT it
plot(value, "SMA", color=color.blue, linewidth=2)
```

#### Cause C: Values Outside Chart Range
**Check:** Calculated values might be too large/small to display

**Solution:** Add debug plots to see values:
```pine
// Temporary debugging
plot(myValue, "Debug Value")  // Check what values are being calculated

// Or use a label
if barstate.islast
    label.new(bar_index, high, "Value: " + str.tostring(myValue))
```

#### Cause D: Conditional Display Logic
**Check:** Plot might be conditional and conditions not met

**Solution:** Review your conditions:
```pine
// This only plots when condition is true
plot(condition ? value : na, "Conditional Plot")

// Try removing condition temporarily for testing
plot(value, "Always Visible Plot")
```

#### Cause E: Color Transparency
**Check:** Plot color might be too transparent

**Solution:** Check color settings:
```pine
// Bad - might be invisible
plot(value, color=color.new(color.blue, 100))  // 100 = fully transparent

// Good - visible
plot(value, color=color.new(color.blue, 0))    // 0 = fully opaque
```

---

## Issue 3: Script Errors on Chart

### Symptoms
- Error messages appear when adding indicator
- Red error text on chart
- Indicator fails to load completely

### Common Errors & Solutions

#### Error: "Undeclared identifier"
**Meaning:** Variable used before being defined or typo

**Solution:**
```pine
// Bad - using before defining
plot(myValue, "Value")
myValue = ta.sma(close, 20)  // Defined AFTER use

// Good - define before use
myValue = ta.sma(close, 20)
plot(myValue, "Value")
```

#### Error: "Cannot call 'plot' in local scope"
**Meaning:** Plot statement is inside an if/for block

**Solution:**
```pine
// Bad - plot inside if statement
if close > open
    plot(close, "Price")  // ERROR

// Good - use ternary operator
plotColor = close > open ? color.green : na
plot(close, "Price", color=plotColor)
```

#### Error: "Incorrect argument type"
**Meaning:** Wrong data type passed to function

**Solution:**
```pine
// Bad - passing string where int expected
length = "20"  // String
sma = ta.sma(close, length)  // ERROR

// Good - use correct type
length = 20  // Integer
sma = ta.sma(close, length)  // OK
```

#### Error: "Loop is too long"
**Meaning:** Custom loop taking too long

**Solution:**
```pine
// Bad - inefficient loop
sum = 0.0
for i = 0 to 1000
    for j = 0 to 1000  // Nested loops are dangerous
        sum := sum + close[i]

// Good - use built-in functions
sum = ta.cum(close)  // Much more efficient
```

#### Error: "Pine cannot determine referencing length"
**Meaning:** Using variable lookback period incorrectly

**Solution:**
```pine
// Bad - variable lookback
len = close > open ? 10 : 20
sma = ta.sma(close, len)  // ERROR

// Good - fixed lookback
len = input.int(20, "Length")  // Input is fixed
sma = ta.sma(close, len)  // OK
```

---

## Issue 4: Incorrect Values or Calculations

### Symptoms
- Indicator displays but shows wrong values
- Calculations don't match expected results
- Signals triggering at wrong times

### Debugging Steps

#### Step 1: Add Debug Plots
```pine
// Add temporary plots to see intermediate values
plot(close, "Close Price", color=color.white)  // Verify price data
plot(myCalculation, "My Calc", color=color.yellow)  // Check calculation
```

#### Step 2: Use Labels for Values
```pine
// Show exact values on chart
if barstate.islast
    label.new(bar_index, high, 
              "Close: " + str.tostring(close) + 
              "\nCalc: " + str.tostring(myCalculation))
```

#### Step 3: Check Historical Reference
```pine
// Bad - might cause issues
value = close[bar_index]  // Wrong way to reference

// Good
value = close  // Current bar
previousValue = close[1]  // Previous bar
```

#### Step 4: Verify Data Types
```pine
// Ensure proper type conversions
intValue = int(floatValue)  // Float to int
floatValue = float(intValue)  // Int to float
stringValue = str.tostring(floatValue)  // Any to string
```

---

## Issue 5: Performance Issues

### Symptoms
- Chart loads slowly
- FxReplay lags when indicator is active
- Replay stutters or freezes

### Solutions

#### Solution A: Reduce Lookback Period
```pine
// Bad - too much history
longCalc = ta.sma(close, 1000)  // Very slow

// Good - reasonable period
shortCalc = ta.sma(close, 50)  // Much faster
```

#### Solution B: Minimize Plot Statements
```pine
// Bad - too many plots
for i = 1 to 100
    plot(close[i], "Plot " + str.tostring(i))  // 100 plots!

// Good - only essential plots
plot(ta.sma(close, 20), "SMA 20")  // 1 plot
plot(ta.sma(close, 50), "SMA 50")  // 2 plots total
```

#### Solution C: Optimize Calculations
```pine
// Bad - recalculating same thing
value1 = ta.sma(close, 20)
value2 = ta.sma(close, 20)  // Duplicate calculation
plot(value1 + value2)

// Good - calculate once
value = ta.sma(close, 20)
plot(value * 2)  // Reuse calculation
```

#### Solution D: Remove Heavy Visual Elements
```pine
// Bad - creates many labels/boxes
if close > close[1]
    label.new(bar_index, high, "Up")  // Label on EVERY up bar

// Good - only significant events
if ta.crossover(fastMA, slowMA)
    label.new(bar_index, high, "Cross")  // Rare events only
```

---

## Issue 6: Visual Display Problems

### Symptoms
- Colors not showing correctly
- Lines too thin/thick
- Elements overlapping

### Solutions

#### Problem: Can't See Lines
```pine
// Make lines more visible
plot(value, "Value", color=color.blue, linewidth=3)  // Thicker line
plot(value, "Value", color=color.new(color.blue, 0))  // Fully opaque
```

#### Problem: Too Much Clutter
```pine
// Add toggle options
showMA = input.bool(true, "Show MA")
showBB = input.bool(false, "Show BB")

plot(showMA ? ma : na, "MA")  // Only show if enabled
plot(showBB ? bb : na, "BB")
```

#### Problem: Colors Not Distinguishable
```pine
// Use contrasting colors
plot(fast, "Fast", color=color.new(color.aqua, 0), linewidth=2)
plot(slow, "Slow", color=color.new(color.orange, 0), linewidth=2)
```

#### Problem: Shapes Not Visible
```pine
// Increase shape size and use solid colors
plotshape(signal, "Signal", 
          shape.triangleup, 
          location.belowbar, 
          color=color.new(color.lime, 0),  // Bright, opaque color
          size=size.normal)  // Larger size
```

---

## Issue 7: FxReplay Crashes

### Symptoms
- FxReplay closes unexpectedly when adding indicator
- Application freezes
- System becomes unresponsive

### Emergency Solutions

#### Step 1: Remove Problematic Indicator
```bash
# Navigate to indicators folder
cd /path/to/FxReplay/custom_indicators/

# Remove recently added indicator
rm problematic_indicator.pine

# Or rename to disable
mv problematic_indicator.pine problematic_indicator.pine.disabled
```

#### Step 2: Check for Infinite Loops
```pine
// Bad - can cause crash
for i = 0 to 999999
    // Heavy calculation

// Good - use reasonable limits
for i = 0 to 100  // Much safer
    // Calculation
```

#### Step 3: Simplify Script
Create a minimal version to isolate the problem:
```pine
//@version=5
indicator("Minimal Test", overlay=true)

// Start with just this
plot(close, "Price")

// Add features back one at a time until crash occurs
```

#### Step 4: Check System Resources
```bash
# Check if running out of memory
# Windows: Task Manager
# Mac: Activity Monitor
# Linux: htop or top

# Close other applications
# Restart FxReplay
```

---

## Issue 8: Updates Not Reflecting

### Symptoms
- Modified indicator but changes don't appear
- Old version still running
- Edits seem ignored

### Solutions

#### Solution A: Full Restart Sequence
```bash
# 1. Close FxReplay completely
# 2. Verify process is terminated
# 3. Save your script changes
# 4. Restart FxReplay
# 5. Remove and re-add indicator to chart
```

#### Solution B: Clear Cache (If Applicable)
```bash
# Some versions cache compiled indicators
# Look for cache folder:
# - FxReplay/cache/
# - FxReplay/compiled/
# Delete cached versions
```

#### Solution C: Rename File
```bash
# Force FxReplay to recognize it as new
mv my_indicator.pine my_indicator_v2.pine
```

#### Solution D: Check File Timestamps
```bash
# Verify file was actually saved
ls -lt /path/to/FxReplay/custom_indicators/

# Should show recent modification time
```

---

## Advanced Debugging Techniques

### Technique 1: Binary Search Debugging
Comment out half your code to find the problematic section:

```pine
//@version=5
indicator("Debug", overlay=true)

// Part 1 - Working
value1 = ta.sma(close, 20)
plot(value1)

// Part 2 - Comment out to test
// value2 = myComplexCalculation()
// plot(value2)
```

### Technique 2: Use Tables for Debugging
Display variable values in a table:

```pine
var table debug = table.new(position.bottom_right, 2, 5)

if barstate.islast
    table.cell(debug, 0, 0, "Close:", bgcolor=color.gray)
    table.cell(debug, 1, 0, str.tostring(close))
    
    table.cell(debug, 0, 1, "Calc:", bgcolor=color.gray)
    table.cell(debug, 1, 1, str.tostring(myCalculation))
```

### Technique 3: Test in Isolation
Create a separate test indicator with just the problematic section:

```pine
//@version=5
indicator("Test Problem Section", overlay=false)

// Only the calculation that's causing issues
problematicValue = ...
plot(problematicValue)
```

---

## Getting Additional Help

### Before Asking for Help, Gather:
1. **FxReplay version number**
2. **Complete error message** (screenshot if possible)
3. **Your indicator script** (or at least the relevant sections)
4. **Steps to reproduce the problem**
5. **What you've already tried**

### Where to Get Help:
1. **This Repository's Documentation**: Check README.md and other guides
2. **FxReplay Official Support**: Official documentation and support channels
3. **TradingView Pine Script Documentation**: https://www.tradingview.com/pine-script-docs/
4. **Trading Forums**: Community help from other FxReplay users
5. **Pine Script Community**: Discord/Reddit for Pine Script specific questions

---

## Prevention Checklist

Avoid issues by following these practices:

- [ ] Always test scripts in TradingView first
- [ ] Start simple, add complexity gradually
- [ ] Use version control (backup working versions)
- [ ] Comment your code thoroughly
- [ ] Test on multiple timeframes
- [ ] Test with different currency pairs
- [ ] Keep indicators modular and focused
- [ ] Use meaningful variable names
- [ ] Validate all input parameters
- [ ] Handle edge cases (division by zero, etc.)

---

## Quick Reference: Error Message Meanings

| Error Message | Meaning | Quick Fix |
|--------------|---------|-----------|
| "Undeclared identifier 'x'" | Variable 'x' not defined | Define variable before use |
| "Cannot call 'plot' in local scope" | Plot inside if/loop | Move plot to global scope |
| "Loop is too long" | Calculation taking too long | Simplify loop or use built-in functions |
| "Incorrect argument type" | Wrong data type | Check function signature |
| "Cannot use 'security' in this context" | Security function restricted | Simplify timeframe logic |
| "Script could not be translated" | Syntax error | Check all brackets, parentheses |
| "Memory limit exceeded" | Too much data/calculation | Reduce lookback periods |

---

**Last Updated**: January 4, 2026

**Remember**: Most issues are solved by testing in TradingView first and restarting FxReplay after changes!
