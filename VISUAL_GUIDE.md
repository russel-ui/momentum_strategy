# Visual Step-by-Step Guide: Adding Indicators to FxReplay

A picture-guided walkthrough for adding custom indicators to FxReplay.

---

## 🎨 Visual Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FxReplay Indicator Integration            │
│                                                              │
│  Your Pine Script  →  Indicators Folder  →  FxReplay Chart  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Visual Process

### Step 1: Locate FxReplay Directory

```
Windows Path Structure:
═══════════════════════════════════════════════
C:\
└── Program Files\
    └── FxReplay\
        ├── FxReplay.exe
        ├── config\
        └── custom_indicators\  ← Your indicators go here!


Mac Path Structure:
═══════════════════════════════════════════════
/Applications/
└── FxReplay.app/
    └── Contents/
        └── Resources/
            ├── FxReplay (executable)
            └── custom_indicators\  ← Your indicators go here!


Linux Path Structure:
═══════════════════════════════════════════════
~/.local/share/
└── FxReplay/
    ├── fxreplay (executable)
    └── custom_indicators/  ← Your indicators go here!
```

---

### Step 2: Indicator File Structure

```
Your Indicator File Anatomy:
═══════════════════════════════════════════════

┌──────────────────────────────────────────┐
│ //@version=5                             │ ← Version (Required)
│                                          │
│ indicator("Name", overlay=true)          │ ← Declaration (Required)
│                                          │
│ // Inputs                                │
│ length = input.int(20, "Length")         │ ← User Parameters
│                                          │
│ // Calculations                          │
│ value = ta.sma(close, length)            │ ← Your Logic
│                                          │
│ // Plotting                              │
│ plot(value, "SMA", color=color.blue)     │ ← Visual Output (Required)
│                                          │
└──────────────────────────────────────────┘

File saved as: my_indicator.pine
```

---

### Step 3: File Placement

```
Before Adding Indicator:
═══════════════════════════════════════════════
FxReplay/
├── FxReplay.exe
├── config/
│   └── settings.json
└── (no indicators folder)


After Adding Indicator:
═══════════════════════════════════════════════
FxReplay/
├── FxReplay.exe
├── config/
│   └── settings.json
└── custom_indicators/          ← Created folder
    ├── my_ema_cross.pine       ← Your indicator
    ├── my_rsi.pine             ← Another indicator
    └── my_support.pine         ← More indicators
```

---

### Step 4: FxReplay Integration Flow

```
Integration Workflow:
═══════════════════════════════════════════════

1. Write Indicator
   ┌─────────────────┐
   │  Pine Script    │
   │     Editor      │
   └────────┬────────┘
            │
            ↓
2. Test (Optional but Recommended)
   ┌─────────────────┐
   │   TradingView   │
   │   Pine Editor   │
   └────────┬────────┘
            │
            ↓
3. Save to FxReplay
   ┌─────────────────┐
   │  custom_        │
   │  indicators/    │
   └────────┬────────┘
            │
            ↓
4. Restart FxReplay
   ┌─────────────────┐
   │  Close & Open   │
   │    FxReplay     │
   └────────┬────────┘
            │
            ↓
5. Add to Chart
   ┌─────────────────┐
   │  Indicators     │
   │     Menu        │
   └────────┬────────┘
            │
            ↓
6. Configure & Use
   ┌─────────────────┐
   │   Settings &    │
   │   Parameters    │
   └─────────────────┘
```

---

### Step 5: Indicator Types Visual Reference

```
Overlay Indicators (overlay=true)
═══════════════════════════════════════════════
Displayed ON the price chart

Chart:
  ─────┬─────────────────────────────────
  130 │         ╱╲    EMA (Blue)
      │        ╱  ╲╱╲
  120 │   ╱╲  ╱      ╲  ╱  Price
      │  ╱  ╲╱        ╲╱
  110 │ ╱     SMA (Red)
      │╱
  ─────┴─────────────────────────────────
       Mon  Tue  Wed  Thu  Fri

Examples: EMAs, SMAs, Bollinger Bands, Support/Resistance


Oscillator Indicators (overlay=false)
═══════════════════════════════════════════════
Displayed BELOW the price chart in separate pane

Price Chart:
  ─────┬─────────────────────────────────
  120 │   ╱╲  ╱╲
  110 │  ╱  ╲╱  ╲╱╲
  ─────┴─────────────────────────────────

RSI Oscillator:
  ─────┬─────────────────────────────────
   70 │- - - - - - - Overbought
      │     ╱╲╱╲
   50 │────╱────╲────────────
      │          ╲╱╲
   30 │- - - - - - - Oversold
  ─────┴─────────────────────────────────
       Mon  Tue  Wed  Thu  Fri

Examples: RSI, MACD, Stochastic, CCI
```

---

### Step 6: Adding Indicator to Chart (Visual Steps)

```
In FxReplay:
═══════════════════════════════════════════════

1. Open Chart
   ┌─────────────────────────────────────────┐
   │ FxReplay - EURUSD               [_][□][X]│
   ├─────────────────────────────────────────┤
   │ File  Edit  View  Chart  Tools  Help    │
   ├─────────────────────────────────────────┤
   │ [▶ Play] [⏸ Pause] [Speed: 1x]          │
   ├─────────────────────────────────────────┤
   │                                         │
   │         (Price Chart Here)              │
   │                                         │
   └─────────────────────────────────────────┘


2. Right-Click on Chart
   ┌─────────────────────────────────────────┐
   │                                         │
   │         ┌───────────────────┐           │
   │         │  Add Indicator    │←──────────│ Click this
   │         │  Chart Settings   │           │
   │         │  Timeframe        │           │
   │         └───────────────────┘           │
   │                                         │
   └─────────────────────────────────────────┘


3. Select Your Indicator
   ┌──────────────────────────────────┐
   │  Available Indicators            │
   ├──────────────────────────────────┤
   │  📊 Built-in Indicators          │
   │    • Moving Averages             │
   │    • Bollinger Bands             │
   │    • RSI                         │
   │                                  │
   │  ⭐ Custom Indicators             │
   │    • My EMA Cross      ←─────────│ Your indicator!
   │    • My RSI                      │
   │    • My Support                  │
   │                                  │
   │         [Add]  [Cancel]          │
   └──────────────────────────────────┘


4. Indicator Added
   ┌─────────────────────────────────────────┐
   │ EURUSD                          [_][□][X]│
   ├─────────────────────────────────────────┤
   │ ⚙ My EMA Cross  👁 ❌            ←───────│ Indicator controls
   ├─────────────────────────────────────────┤
   │              1.2000  ╱╲                 │
   │                     ╱  ╲   Fast EMA     │
   │              1.1950╱    ╲╱╲             │
   │                           ╲  Slow EMA   │
   │              1.1900        ╲            │
   └─────────────────────────────────────────┘
```

---

### Step 7: Indicator Settings Visual

```
Indicator Settings Dialog:
═══════════════════════════════════════════════

┌────────────────────────────────────────────┐
│  My EMA Cross Settings              [X]    │
├────────────────────────────────────────────┤
│                                            │
│  Inputs:                                   │
│  ┌──────────────────────────────────────┐ │
│  │ Fast EMA Length:  [  9  ]           │ │
│  │ Slow EMA Length:  [ 21  ]           │ │
│  │ Show Signals:     [✓]               │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Style:                                    │
│  ┌──────────────────────────────────────┐ │
│  │ Fast EMA Color:   [🔵 Blue  ▼]      │ │
│  │ Slow EMA Color:   [🔴 Red   ▼]      │ │
│  │ Line Width:       [  2  ]            │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Visibility:                               │
│  ┌──────────────────────────────────────┐ │
│  │ [✓] M1  [✓] M5  [✓] M15  [✓] M30    │ │
│  │ [✓] H1  [✓] H4  [✓] D1   [✓] W1     │ │
│  └──────────────────────────────────────┘ │
│                                            │
│         [Apply]  [OK]  [Cancel]            │
└────────────────────────────────────────────┘
```

---

## 🎨 Color-Coding System

Visual legend for understanding indicator output:

```
Common Color Conventions:
═══════════════════════════════════════════════

Trends:
  🟢 Green  = Bullish / Up / Buy / Support
  🔴 Red    = Bearish / Down / Sell / Resistance
  🟡 Yellow = Warning / Neutral / Caution

Moving Averages:
  🔵 Blue   = Fast / Short Period
  🟠 Orange = Slow / Long Period

Signals:
  🔼 Triangle Up    = Buy Signal
  🔽 Triangle Down  = Sell Signal

Zones:
  Overbought Zone = Red background (light)
  Oversold Zone   = Green background (light)
```

---

## 📊 Complete Example: EMA Crossover

```
Indicator in Action:
═══════════════════════════════════════════════

Price Chart with EMA Crossover Indicator:

  1.2050 ┬─────────────────────────────────────
         │                    🔽 SELL
  1.2000 ┤           ╱╲      ╱
         │          ╱  ╲    ╱
  1.1950 ┤     ╱╲  ╱    ╲  ╱   Fast EMA (Blue)
         │    ╱  ╲╱      ╲╱
  1.1900 ┤   ╱    ╲       ╲
         │  ╱  🔼  ╲       ╲   Slow EMA (Red)
  1.1850 ┤ ╱  BUY   ╲       ╲
         │╱           ╲       ╲
  1.1800 ┴─────────────────────────────────────
         Mon  Tue  Wed  Thu  Fri  Mon  Tue

Signal Explanation:
• BUY 🔼: Fast EMA crosses ABOVE Slow EMA
• SELL 🔽: Fast EMA crosses BELOW Slow EMA
```

---

## 🔄 Update Cycle Visual

```
Making Changes to Your Indicator:
═══════════════════════════════════════════════

Step 1: Identify Issue
┌─────────────────┐
│ Indicator not   │
│ working right?  │
└────────┬────────┘
         │
         ↓
Step 2: Edit File
┌─────────────────┐
│ Open .pine file │
│ Make changes    │
│ Save file       │
└────────┬────────┘
         │
         ↓
Step 3: Close FxReplay Completely
┌─────────────────┐
│ Exit FxReplay   │
│ Check taskbar!  │
└────────┬────────┘
         │
         ↓
Step 4: Reopen FxReplay
┌─────────────────┐
│ Start FxReplay  │
│ Wait for load   │
└────────┬────────┘
         │
         ↓
Step 5: Remove & Re-add Indicator
┌─────────────────┐
│ Delete old from │
│ chart, add new  │
└────────┬────────┘
         │
         ↓
Step 6: Test Changes
┌─────────────────┐
│ Verify fixes    │
│ worked          │
└─────────────────┘
```

---

## 🎯 Quick Visual Troubleshooting

```
Problem: Can't find indicators folder
═══════════════════════════════════════════════
Solution:
  FxReplay/
  ├── (look for these folders)
  ├── indicators/          ← Try this
  ├── custom_indicators/   ← Or this
  ├── scripts/             ← Or this
  └── [CREATE IF NONE EXIST]


Problem: Indicator not in list
═══════════════════════════════════════════════
Checklist:
  [✓] File in correct folder?
  [✓] File has .pine extension?
  [✓] Script starts with //@version=5?
  [✓] FxReplay restarted?


Problem: Indicator loads but invisible
═══════════════════════════════════════════════
Check overlay setting:

  overlay=true  → Shows ON price chart
       ║
       ║    Price + Indicator together
       ╚═══════════════════════════════

  overlay=false → Shows BELOW in own pane
       ║
       ║    Price Chart
       ║    ─────────────
       ║    Indicator Pane
       ╚═══════════════════════════════
```

---

## 📏 Indicator Measurement Guide

```
Understanding Indicator Values:
═══════════════════════════════════════════════

Overlay Indicators (match price scale):
  Price: $1.2000  ←→  Indicator: $1.2000
  ─────────────────────────────────────
   Both use same Y-axis scale


Oscillator Indicators (own scale):
  Common Ranges:
  
  RSI:        0 to 100
  ├────┬────┬────┬────┬────┤
  0   25   50   75   100
  
  Stochastic: 0 to 100
  ├────┬────┬────┬────┬────┤
  0   25   50   75   100
  
  MACD:       Dynamic (negative to positive)
  ├────┬────┬────┬────┬────┤
  -10  -5    0   +5   +10
```

---

## 🎓 Visual Learning Path

```
Your Journey:
═══════════════════════════════════════════════

START
  │
  ├─→ Read QUICK_START.md (5 min)
  │
  ├─→ Copy example indicator
  │
  ├─→ Place in indicators folder
  │
  ├─→ Restart FxReplay
  │
  ├─→ Add to chart
  │
  ├─→ SUCCESS! 🎉
  │
  ├─→ Try customizing
  │
  ├─→ Create your own
  │
  └─→ EXPERT! 🚀
```

---

## 📐 File Format Visual Template

```
Pine Script File Structure:
═══════════════════════════════════════════════

Line 1:   //@version=5
          ↑
          Always start here!

Line 2:   indicator("Name", overlay=true)
          ↑         ↑       ↑
          Keyword   Title   Position

Line 3+:  (Your code here)

Must Have:
  ✓ Version declaration
  ✓ Indicator declaration
  ✓ At least one plot() statement

Optional but Recommended:
  • Input parameters
  • Comments explaining logic
  • Multiple plots for comparison
  • Alert conditions
```

---

## 🎨 Visual Summary

```
Complete Process at a Glance:
═══════════════════════════════════════════════

┌──────────────┐
│ 1. Write     │  Create or copy indicator script
│   Script     │  (.pine file)
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ 2. Test      │  (Optional) Verify in TradingView
│   (Optional) │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ 3. Place in  │  Copy to FxReplay's
│   Folder     │  custom_indicators/
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ 4. Restart   │  Close and reopen
│   FxReplay   │  FxReplay completely
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ 5. Add to    │  Right-click chart →
│   Chart      │  Add Indicator
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ 6. Configure │  Adjust colors, periods,
│   & Trade    │  and parameters
└──────────────┘

Success! You're trading with custom indicators! 🎉
```

---

**Remember**: This visual guide complements the text documentation. Refer to README.md for detailed explanations!

**Last Updated**: January 4, 2026
