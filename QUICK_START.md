# Quick Start Guide: Adding Indicators to FxReplay

This is a simplified, step-by-step guide to get your first custom indicator running in FxReplay in under 5 minutes.

---

## ⚡ 5-Minute Setup

### Step 1: Find Your FxReplay Folder (30 seconds)

**Windows:**
1. Press `Win + R`
2. Type: `%PROGRAMFILES%\FxReplay` or check `%PROGRAMFILES(X86)%\FxReplay`
3. Press Enter

**Mac:**
1. Open Finder
2. Press `Cmd + Shift + G`
3. Type: `/Applications/FxReplay.app/Contents/Resources/`
4. Press Enter

**Linux:**
```bash
cd ~/.local/share/FxReplay
# or
cd /opt/FxReplay
```

### Step 2: Create Indicators Folder (10 seconds)

Look for a folder called `indicators`, `custom_indicators`, or `scripts`.

**If it doesn't exist**, create a new folder called `custom_indicators`:

```bash
# In FxReplay directory
mkdir custom_indicators
```

### Step 3: Copy Your Indicator (20 seconds)

1. Take any `.pine` file (use `/workspace/pine_script` as a starter)
2. Copy it into the `custom_indicators` folder
3. Rename it to something descriptive like `my_ema_cross.pine`

### Step 4: Restart FxReplay (10 seconds)

1. Completely close FxReplay (check system tray!)
2. Open FxReplay again
3. Wait for it to fully load

### Step 5: Add Indicator to Chart (30 seconds)

1. Open a replay session
2. Right-click on the chart
3. Select **Indicators** or **Add Indicator**
4. Find your indicator name in the list
5. Click to add it

### Step 6: Customize (Optional)

1. Right-click on the indicator name in the chart
2. Select **Settings** or **Format**
3. Adjust colors, periods, etc.
4. Click **OK**

---

## 🎯 Your First Custom Indicator

Copy this simple indicator to get started:

**File: `simple_sma.pine`**

```pine
//@version=5
indicator("My First SMA", overlay=true)

length = input.int(20, "Period")
sma = ta.sma(close, length)

plot(sma, "SMA", color=color.blue, linewidth=2)
```

**What it does:**
- Calculates a Simple Moving Average
- Displays it as a blue line on your chart
- Period is adjustable (default: 20)

---

## ✅ Verification Checklist

After adding your indicator, verify:

- [ ] Indicator appears in FxReplay's indicator list
- [ ] Indicator displays on the chart when added
- [ ] Colors and lines are visible
- [ ] Settings can be adjusted
- [ ] Works on different timeframes

---

## 🚨 Common Issues - Quick Fixes

### "Indicator not showing in list"
**Fix:** Check these in order:
1. Is the file in the correct folder?
2. Does the file have `.pine` or `.txt` extension?
3. Did you restart FxReplay?
4. Does your script start with `//@version=5`?

### "Indicator adds but nothing displays"
**Fix:**
1. Check `overlay=true` for price overlay indicators
2. Use `overlay=false` for separate pane indicators
3. Verify your script has `plot()` statements

### "Error message when loading"
**Fix:**
1. Test script in TradingView first
2. Check for syntax errors
3. Ensure Pine Script version matches FxReplay compatibility
4. Simplify script to find problematic line

### "FxReplay crashes when adding indicator"
**Fix:**
1. Script may have infinite loops or heavy calculations
2. Test with a simpler version first
3. Remove complex loops or reduce lookback periods
4. Check FxReplay logs for error details

---

## 📁 Recommended Folder Structure

```
FxReplay/
├── custom_indicators/
│   ├── my_ema_cross.pine
│   ├── my_rsi.pine
│   ├── my_support_resistance.pine
│   └── my_volume.pine
├── config/
│   └── indicators.json (may exist in some versions)
└── ... (other FxReplay files)
```

---

## 🔄 Testing Workflow

1. **Write indicator** in text editor or TradingView
2. **Validate** in TradingView Pine Editor (optional but recommended)
3. **Save** to FxReplay's indicators folder
4. **Restart** FxReplay
5. **Test** on a chart with known data
6. **Adjust** settings as needed
7. **Repeat** until perfect!

---

## 📚 What to Do Next

1. **Read the full guide**: `/workspace/README.md`
2. **Try example indicators**: Check `/workspace/example_indicators/`
3. **Customize for your strategy**: Modify examples to fit your trading style
4. **Test thoroughly**: Always backtest indicators before live use
5. **Share your work**: Consider sharing useful indicators with the community

---

## 💡 Pro Tips

1. **Name your indicators clearly**: `RSI_14_OverboughtOversold.pine` not `ind1.pine`
2. **Add comments**: Explain what your indicator does
3. **Use input parameters**: Make indicators flexible and reusable
4. **Test on multiple timeframes**: Ensure it works on M5, H1, D1, etc.
5. **Keep it simple**: Start simple, add complexity gradually
6. **Version control**: Keep backups of working versions
7. **Document settings**: Note which parameters work best for each pair

---

## 🎓 Learning Resources

- **Pine Script Basics**: https://www.tradingview.com/pine-script-docs/
- **TradingView Public Library**: Browse community indicators for inspiration
- **FxReplay Community**: Check forums for indicator-specific discussions
- **This Repository**: Contains 4+ ready-to-use example indicators

---

## 📞 Getting Help

**If you're stuck:**

1. Check the full README: `/workspace/README.md`
2. Test your script in TradingView first
3. Simplify your indicator to isolate issues
4. Check FxReplay documentation for version-specific info
5. Ask in FxReplay community forums

---

**Remember:** Start simple, test thoroughly, and iterate! 🚀

**Last Updated**: January 4, 2026
