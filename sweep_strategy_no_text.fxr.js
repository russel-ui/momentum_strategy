//@version=1
// Sweep Strategy - FXR Script (No Text Labels Version)
// Original: © mrussel
// This version uses only shapes - no text labels

// ══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ══════════════════════════════════════════════════════════════════════════════

init = () => {
  indicator({ onMainPanel: true, format: 'inherit' });
  
  // Indicator Parameters
  input.int('ATR Length (Days)', 5, 'atrLength');
  input.int('SMA Length', 35, 'smaLength');
  input.float('Min ATR Multiplier', 0.5, 'minAtrMult');
  input.float('Max ATR Multiplier', 2.0, 'maxAtrMult');
  input.float('Close Position Threshold', 0.6, 'closeThreshold');
  input.int('Multi-Sweep Lookback', 5, 'multiSweepLookback');
  input.int('Multi-Sweep Min Count', 2, 'multiSweepMinCount');
  
  // Risk Management
  input.float('Risk Per Trade ($)', 1000, 'riskPerTrade');
  
  // Colors
  input.color('Bullish Color', color.lime, 'bullishColor');
  input.color('Bearish Color', color.red, 'bearishColor');
  input.int('Box Opacity', 80, 'boxOpacity');
  input.color('Multi-Sweep Bullish', color.yellow, 'multiSweepBullColor');
  input.color('Multi-Sweep Bearish', color.fuchsia, 'multiSweepBearColor');
  
  // SMA Colors
  input.color('35 SMA Bullish', color.lime, 'sma35LightGreen');
  input.color('35 SMA Bearish', color.red, 'sma35LightRed');
  input.color('150 SMA Bullish', color.green, 'sma150DarkGreen');
  input.color('150 SMA Bearish', color.maroon, 'sma150DarkRed');
  
  // Time Filter
  input.bool('Use Time Filter', true, 'useTimeFilter');
  input.int('Exclude Start Hour', 13, 'excludeStartHour');
  input.int('Exclude End Hour', 21, 'excludeEndHour');
};

// ══════════════════════════════════════════════════════════════════════════════
// GLOBAL ARRAYS FOR STORING HISTORICAL DATA
// ══════════════════════════════════════════════════════════════════════════════

const highArray = [];
const lowArray = [];
const closeArray = [];
const timeArray = [];
const openArray = [];

// ══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

// Calculate ATR manually
const calculateATR = (highs, lows, closes, period) => {
  if (highs.length < period + 1) return null;
  
  const trueRanges = [];
  for (let i = 1; i < highs.length; i++) {
    const high_low = highs[i] - lows[i];
    const high_prevClose = Math.abs(highs[i] - closes[i - 1]);
    const low_prevClose = Math.abs(lows[i] - closes[i - 1]);
    const tr = Math.max(high_low, high_prevClose, low_prevClose);
    trueRanges.push(tr);
  }
  
  if (trueRanges.length < period) return null;
  
  const sum = trueRanges.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
};

// Get pip value based on instrument type
const getPipValue = (ticker, close) => {
  if (ticker.includes('JPY')) return 0.01;
  if (ticker.includes('BTC') || ticker.includes('ETH') || ticker.includes('USD')) {
    return close * 0.001;
  }
  return 0.0001;
};

// Count distinct lows swept
const countDistinctLowsSwept = (lowArr, lookback) => {
  if (lowArr.length < lookback + 1) return 0;
  
  const currentLow = lowArr[lowArr.length - 1];
  let count = 0;
  let minLowSoFar = Infinity;
  
  for (let i = 1; i <= lookback; i++) {
    const idx = lowArr.length - 1 - i;
    if (idx < 0) break;
    const prevLow = lowArr[idx];
    
    if (prevLow < minLowSoFar && currentLow < prevLow) {
      count++;
      minLowSoFar = prevLow;
    }
  }
  
  return count;
};

// Count distinct highs swept
const countDistinctHighsSwept = (highArr, lookback) => {
  if (highArr.length < lookback + 1) return 0;
  
  const currentHigh = highArr[highArr.length - 1];
  let count = 0;
  let maxHighSoFar = -Infinity;
  
  for (let i = 1; i <= lookback; i++) {
    const idx = highArr.length - 1 - i;
    if (idx < 0) break;
    const prevHigh = highArr[idx];
    
    if (prevHigh > maxHighSoFar && currentHigh > prevHigh) {
      count++;
      maxHighSoFar = prevHigh;
    }
  }
  
  return count;
};

// Get value at offset
const getAtOffset = (array, offset) => {
  const idx = array.length - 1 - offset;
  return idx >= 0 ? array[idx] : null;
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN TICK FUNCTION
// ══════════════════════════════════════════════════════════════════════════════

onTick = (length, _moment, _, ta, inputs) => {
  // Get current candle data
  const close = closeC(0);
  const high_val = high(0);
  const low_val = low(0);
  const open_val = openC(0);
  const current_time = time(0);
  
  // Store in arrays
  closeArray.push(close);
  highArray.push(high_val);
  lowArray.push(low_val);
  openArray.push(open_val);
  timeArray.push(current_time);
  
  // Maintain reasonable array size
  const maxLength = 200;
  if (closeArray.length > maxLength) {
    closeArray.shift();
    highArray.shift();
    lowArray.shift();
    openArray.shift();
    timeArray.shift();
  }
  
  // Need enough data
  if (closeArray.length < inputs.smaLength + 10) {
    return;
  }
  
  // Calculate indicators
  const atr5 = calculateATR(highArray, lowArray, closeArray, inputs.atrLength);
  if (!atr5) return;
  
  const atr5Daily = atr5 * Math.sqrt(6);
  
  const sma35Array = ta.sma(closeArray, inputs.smaLength);
  const sma150Array = ta.sma(closeArray, 150);
  
  const sma35 = sma35Array.at(-1);
  const sma150 = sma150Array.at(-1);
  
  if (!sma35 || !sma150) return;
  
  // Candle analysis
  const candleRange = high_val - low_val;
  const closePosition = candleRange > 0 ? (close - low_val) / candleRange : 0.5;
  
  const ticker = "FOREX";
  const pipValue = getPipValue(ticker, close);
  const minPipRange = 10 * pipValue;
  const meetsMinPips = candleRange >= minPipRange;
  const twoPips = 2 * pipValue;
  
  const validSize = candleRange >= (inputs.minAtrMult * atr5Daily) && 
                    candleRange <= (inputs.maxAtrMult * atr5Daily) && 
                    meetsMinPips;
  
  const sma35Color = close > sma35 ? inputs.sma35LightGreen : inputs.sma35LightRed;
  const sma150Color = close > sma150 ? inputs.sma150DarkGreen : inputs.sma150DarkRed;
  
  // Time filter
  const msPerHour = 3600000;
  const msPerDay = 86400000;
  const hourOfDay = Math.floor((current_time % msPerDay) / msPerHour);
  const isInExcludedTime = inputs.useTimeFilter ? 
    (hourOfDay >= inputs.excludeStartHour && hourOfDay < inputs.excludeEndHour) : false;
  
  // Multi-sweep detection
  const lowsSwept = countDistinctLowsSwept(lowArray, inputs.multiSweepLookback);
  const highsSwept = countDistinctHighsSwept(highArray, inputs.multiSweepLookback);
  const isMultiSweepLow = lowsSwept >= inputs.multiSweepMinCount;
  const isMultiSweepHigh = highsSwept >= inputs.multiSweepMinCount;
  
  // Setup conditions
  const prevLow = getAtOffset(lowArray, 1);
  const sweepsLow = prevLow !== null && low_val < prevLow;
  
  const bullishClose = closePosition >= inputs.closeThreshold;
  const aboveSMA = close > sma35;
  const lowNearSMA = Math.abs(low_val - sma35) <= atr5Daily;
  const validLowSweep = lowsSwept <= 2;
  
  const bullishSetup = sweepsLow && validSize && bullishClose && aboveSMA && 
                       lowNearSMA && validLowSweep && !isInExcludedTime;
  const bullishMultiSweep = bullishSetup && isMultiSweepLow;
  
  const prevHigh = getAtOffset(highArray, 1);
  const sweepsHigh = prevHigh !== null && high_val > prevHigh;
  
  const bearishClose = closePosition <= (1 - inputs.closeThreshold);
  const belowSMA = close < sma35;
  const highNearSMA = Math.abs(high_val - sma35) <= atr5Daily;
  const validHighSweep = highsSwept <= 2;
  
  const bearishSetup = sweepsHigh && validSize && bearishClose && belowSMA && 
                       highNearSMA && validHighSweep && !isInExcludedTime;
  const bearishMultiSweep = bearishSetup && isMultiSweepHigh;
  
  // ══════════════════════════════════════════════════════════════════════════════
  // VISUAL MARKERS - BULLISH (NO TEXT LABELS)
  // ══════════════════════════════════════════════════════════════════════════════
  
  if (bullishSetup) {
    const bullBoxTop = low_val;
    const bullBoxBot = low_val - atr5Daily;
    const boxColor = bullishMultiSweep ? inputs.multiSweepBullColor : inputs.bullishColor;
    const opacity = inputs.boxOpacity / 100;
    const borderWidth = bullishMultiSweep ? 3 : 1;
    
    // Draw rectangle
    rectangle(
      current_time, 
      bullBoxTop, 
      current_time + 14400000,
      bullBoxBot,
      {
        backgroundColor: color.rgba(0, 255, 0, opacity),
        color: boxColor,
        linewidth: borderWidth
      }
    );
    
    // Calculate levels
    const entryPrice = close;
    const stopLoss = low_val - twoPips;
    const riskAmount = entryPrice - stopLoss;
    const targetMultiplier = sma35 > sma150 ? 2.5 : 1.2;
    const targetPrice = entryPrice + (riskAmount * targetMultiplier);
    
    // Draw lines
    trendLine(
      newPoint(current_time, entryPrice),
      newPoint(current_time + 57600000, entryPrice),
      { linecolor: color.lime, linewidth: 1, linestyle: 1 }
    );
    
    trendLine(
      newPoint(current_time, stopLoss),
      newPoint(current_time + 57600000, stopLoss),
      { linecolor: color.red, linewidth: 1, linestyle: 1 }
    );
    
    trendLine(
      newPoint(current_time, targetPrice),
      newPoint(current_time + 57600000, targetPrice),
      { linecolor: color.yellow, linewidth: 1, linestyle: 1 }
    );
  }
  
  // ══════════════════════════════════════════════════════════════════════════════
  // VISUAL MARKERS - BEARISH (NO TEXT LABELS)
  // ══════════════════════════════════════════════════════════════════════════════
  
  if (bearishSetup) {
    const bearBoxTop = high_val + atr5Daily;
    const bearBoxBot = high_val;
    const boxColor = bearishMultiSweep ? inputs.multiSweepBearColor : inputs.bearishColor;
    const opacity = inputs.boxOpacity / 100;
    const borderWidth = bearishMultiSweep ? 3 : 1;
    
    // Draw rectangle
    rectangle(
      current_time,
      bearBoxTop,
      current_time + 14400000,
      bearBoxBot,
      {
        backgroundColor: color.rgba(255, 0, 0, opacity),
        color: boxColor,
        linewidth: borderWidth
      }
    );
    
    // Calculate levels
    const entryPrice = close;
    const stopLoss = high_val + twoPips;
    const riskAmount = stopLoss - entryPrice;
    const targetMultiplier = sma35 < sma150 ? 2.5 : 1.2;
    const targetPrice = entryPrice - (riskAmount * targetMultiplier);
    
    // Draw lines
    trendLine(
      newPoint(current_time, entryPrice),
      newPoint(current_time + 57600000, entryPrice),
      { linecolor: color.red, linewidth: 1, linestyle: 1 }
    );
    
    trendLine(
      newPoint(current_time, stopLoss),
      newPoint(current_time + 57600000, stopLoss),
      { linecolor: color.lime, linewidth: 1, linestyle: 1 }
    );
    
    trendLine(
      newPoint(current_time, targetPrice),
      newPoint(current_time + 57600000, targetPrice),
      { linecolor: color.yellow, linewidth: 1, linestyle: 1 }
    );
  }
  
  // ══════════════════════════════════════════════════════════════════════════════
  // PLOT SMAs
  // ══════════════════════════════════════════════════════════════════════════════
  
  plot.line('35 SMA', sma35, sma35Color, 0);
  plot.line('150 SMA', sma150, sma150Color, 0);
};
