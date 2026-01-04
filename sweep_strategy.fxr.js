//@version=1
// Sweep Strategy - Converted from Pine Script
// Original: © mrussel
// Converted to FXR Script

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
  input.color('Bullish Color', '#00FF00', 'bullishColor');
  input.color('Bearish Color', '#FF0000', 'bearishColor');
  input.int('Box Opacity', 80, 'boxOpacity');
  input.color('Multi-Sweep Bullish', '#FFD700', 'multiSweepBullColor');
  input.color('Multi-Sweep Bearish', '#FF00FF', 'multiSweepBearColor');
  
  // SMA Colors
  input.color('35 SMA Bullish', '#90EE90', 'sma35LightGreen');
  input.color('35 SMA Bearish', '#FF6B6B', 'sma35LightRed');
  input.color('150 SMA Bullish', '#006400', 'sma150DarkGreen');
  input.color('150 SMA Bearish', '#8B0000', 'sma150DarkRed');
  
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

// Arrays for daily ATR calculation
const dailyHighArray = [];
const dailyLowArray = [];
const dailyCloseArray = [];
let lastDailyTime = 0;

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
  
  // Simple average of last 'period' TRs
  const sum = trueRanges.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
};

// Get pip value based on instrument type
const getPipValue = (ticker, close) => {
  // JPY pairs: 1 pip = 0.01
  if (ticker.includes('JPY')) return 0.01;
  // Crypto: 0.1% of price
  if (ticker.includes('BTC') || ticker.includes('ETH') || ticker.includes('USD')) {
    return close * 0.001;
  }
  // Standard forex: 1 pip = 0.0001
  return 0.0001;
};

// Count distinct lows swept
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

// Count distinct highs swept
const countDistinctHighsSwept = (highArray, lookback) => {
  if (highArray.length < lookback + 1) return 0;
  
  const currentHigh = highArray[highArray.length - 1];
  let count = 0;
  let maxHighSoFar = -Infinity;
  
  for (let i = 1; i <= lookback; i++) {
    const idx = highArray.length - 1 - i;
    if (idx < 0) break;
    const prevHigh = highArray[idx];
    
    if (prevHigh > maxHighSoFar && currentHigh > prevHigh) {
      count++;
      maxHighSoFar = prevHigh;
    }
  }
  
  return count;
};

// Get value at offset (0 = current, 1 = previous, etc.)
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
  
  // Maintain reasonable array size (keep last 200 bars)
  const maxLength = 200;
  if (closeArray.length > maxLength) {
    closeArray.shift();
    highArray.shift();
    lowArray.shift();
    openArray.shift();
    timeArray.shift();
  }
  
  // Need enough data to calculate
  if (closeArray.length < inputs.smaLength + 10) {
    return;
  }
  
  // ══════════════════════════════════════════════════════════════════════════════
  // CALCULATE INDICATORS
  // ══════════════════════════════════════════════════════════════════════════════
  
  // Daily ATR - simulate by sampling every N bars (approximate)
  // In real implementation, you'd need actual daily data
  // For now, we'll use 4H ATR as proxy (multiply by factor for daily)
  const atr5 = calculateATR(highArray, lowArray, closeArray, inputs.atrLength);
  if (!atr5) return;
  
  // Approximate daily ATR (4H bars -> 6 bars per day, so adjust)
  const atr5Daily = atr5 * Math.sqrt(6); // Scale to daily volatility
  
  // Calculate SMAs using ta library
  const sma35Array = ta.sma(closeArray, inputs.smaLength);
  const sma150Array = ta.sma(closeArray, 150);
  
  const sma35 = sma35Array.at(-1);
  const sma150 = sma150Array.at(-1);
  
  if (!sma35 || !sma150) return;
  
  // ══════════════════════════════════════════════════════════════════════════════
  // CANDLE ANALYSIS
  // ══════════════════════════════════════════════════════════════════════════════
  
  const candleRange = high_val - low_val;
  const closePosition = candleRange > 0 ? (close - low_val) / candleRange : 0.5;
  const bullishPercent = closePosition * 100;
  const bearishPercent = (1 - closePosition) * 100;
  
  // Pip calculation
  const ticker = "FOREX"; // Default, would need actual ticker
  const pipValue = getPipValue(ticker, close);
  const minPipRange = 10 * pipValue;
  const meetsMinPips = candleRange >= minPipRange;
  const twoPips = 2 * pipValue;
  
  // Validate candle size
  const validSize = candleRange >= (inputs.minAtrMult * atr5Daily) && 
                    candleRange <= (inputs.maxAtrMult * atr5Daily) && 
                    meetsMinPips;
  
  // SMA colors
  const sma35Color = close > sma35 ? inputs.sma35LightGreen : inputs.sma35LightRed;
  const sma150Color = close > sma150 ? inputs.sma150DarkGreen : inputs.sma150DarkRed;
  
  // Time filter
  const currentDate = new Date(current_time);
  const currentHour = currentDate.getUTCHours();
  const isInExcludedTime = inputs.useTimeFilter ? 
    (currentHour >= inputs.excludeStartHour && currentHour < inputs.excludeEndHour) : false;
  
  // ══════════════════════════════════════════════════════════════════════════════
  // MULTI-SWEEP DETECTION
  // ══════════════════════════════════════════════════════════════════════════════
  
  const lowsSwept = countDistinctLowsSwept(lowArray, inputs.multiSweepLookback);
  const highsSwept = countDistinctHighsSwept(highArray, inputs.multiSweepLookback);
  const isMultiSweepLow = lowsSwept >= inputs.multiSweepMinCount;
  const isMultiSweepHigh = highsSwept >= inputs.multiSweepMinCount;
  
  // ══════════════════════════════════════════════════════════════════════════════
  // SETUP CONDITIONS
  // ══════════════════════════════════════════════════════════════════════════════
  
  // Check if current low sweeps previous low
  const prevLow = getAtOffset(lowArray, 1);
  const sweepsLow = prevLow !== null && low_val < prevLow;
  
  // Bullish setup conditions
  const bullishClose = closePosition >= inputs.closeThreshold;
  const aboveSMA = close > sma35;
  const lowNearSMA = Math.abs(low_val - sma35) <= atr5Daily;
  const validLowSweep = lowsSwept <= 2;
  
  const bullishSetup = sweepsLow && validSize && bullishClose && aboveSMA && 
                       lowNearSMA && validLowSweep && !isInExcludedTime;
  const bullishMultiSweep = bullishSetup && isMultiSweepLow;
  
  // Check if current high sweeps previous high
  const prevHigh = getAtOffset(highArray, 1);
  const sweepsHigh = prevHigh !== null && high_val > prevHigh;
  
  // Bearish setup conditions
  const bearishClose = closePosition <= (1 - inputs.closeThreshold);
  const belowSMA = close < sma35;
  const highNearSMA = Math.abs(high_val - sma35) <= atr5Daily;
  const validHighSweep = highsSwept <= 2;
  
  const bearishSetup = sweepsHigh && validSize && bearishClose && belowSMA && 
                       highNearSMA && validHighSweep && !isInExcludedTime;
  const bearishMultiSweep = bearishSetup && isMultiSweepHigh;
  
  // ══════════════════════════════════════════════════════════════════════════════
  // VISUAL MARKERS - BULLISH
  // ══════════════════════════════════════════════════════════════════════════════
  
  if (bullishSetup) {
    const bullBoxTop = low_val;
    const bullBoxBot = low_val - atr5Daily;
    const boxColor = bullishMultiSweep ? inputs.multiSweepBullColor : inputs.bullishColor;
    const opacity = inputs.boxOpacity / 100;
    const borderWidth = bullishMultiSweep ? 3 : 1;
    
    // Draw rectangle below the candle
    rectangle(
      current_time, 
      bullBoxTop, 
      current_time + 14400000, // 4 hours in milliseconds
      bullBoxBot,
      {
        backgroundColor: hexToRgba(boxColor, opacity),
        color: boxColor,
        linewidth: borderWidth
      }
    );
    
    // Add label showing percentage
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
    
    // Multi-sweep marker
    if (bullishMultiSweep) {
      const sweepText = '★ ' + lowsSwept + ' lows';
      text(
        current_time,
        bullBoxBot,
        sweepText,
        {
          color: inputs.multiSweepBullColor,
          backgroundColor: inputs.multiSweepBullColor,
          textColor: '#000000',
          fontSize: 12
        }
      );
    }
    
    // Calculate and draw entry/stop/target levels
    const entryPrice = close;
    const stopLoss = low_val - twoPips;
    const riskAmount = entryPrice - stopLoss;
    const targetMultiplier = sma35 > sma150 ? 2.5 : 1.2;
    const targetPrice = entryPrice + (riskAmount * targetMultiplier);
    
    // Draw entry line
    trendline(
      current_time,
      entryPrice,
      current_time + 57600000, // 16 hours ahead
      entryPrice,
      {
        color: '#00FF00',
        linewidth: 1,
        linestyle: 1 // dashed
      }
    );
    
    // Draw stop loss line
    trendline(
      current_time,
      stopLoss,
      current_time + 57600000,
      stopLoss,
      {
        color: '#FF0000',
        linewidth: 1,
        linestyle: 1
      }
    );
    
    // Draw target line
    trendline(
      current_time,
      targetPrice,
      current_time + 57600000,
      targetPrice,
      {
        color: '#FFD700',
        linewidth: 1,
        linestyle: 1
      }
    );
  }
  
  // ══════════════════════════════════════════════════════════════════════════════
  // VISUAL MARKERS - BEARISH
  // ══════════════════════════════════════════════════════════════════════════════
  
  if (bearishSetup) {
    const bearBoxTop = high_val + atr5Daily;
    const bearBoxBot = high_val;
    const boxColor = bearishMultiSweep ? inputs.multiSweepBearColor : inputs.bearishColor;
    const opacity = inputs.boxOpacity / 100;
    const borderWidth = bearishMultiSweep ? 3 : 1;
    
    // Draw rectangle above the candle
    rectangle(
      current_time,
      bearBoxTop,
      current_time + 14400000, // 4 hours
      bearBoxBot,
      {
        backgroundColor: hexToRgba(boxColor, opacity),
        color: boxColor,
        linewidth: borderWidth
      }
    );
    
    // Add label showing percentage
    const pctText = Math.round(bearishPercent) + '%';
    text(
      current_time,
      low_val,
      pctText,
      {
        color: boxColor,
        backgroundColor: boxColor,
        textColor: '#FFFFFF',
        fontSize: 10
      }
    );
    
    // Multi-sweep marker
    if (bearishMultiSweep) {
      const sweepText = '★ ' + highsSwept + ' highs';
      text(
        current_time,
        bearBoxTop,
        sweepText,
        {
          color: inputs.multiSweepBearColor,
          backgroundColor: inputs.multiSweepBearColor,
          textColor: '#000000',
          fontSize: 12
        }
      );
    }
    
    // Calculate and draw entry/stop/target levels
    const entryPrice = close;
    const stopLoss = high_val + twoPips;
    const riskAmount = stopLoss - entryPrice;
    const targetMultiplier = sma35 < sma150 ? 2.5 : 1.2;
    const targetPrice = entryPrice - (riskAmount * targetMultiplier);
    
    // Draw entry line
    trendline(
      current_time,
      entryPrice,
      current_time + 57600000, // 16 hours ahead
      entryPrice,
      {
        color: '#FF0000',
        linewidth: 1,
        linestyle: 1
      }
    );
    
    // Draw stop loss line
    trendline(
      current_time,
      stopLoss,
      current_time + 57600000,
      stopLoss,
      {
        color: '#00FF00',
        linewidth: 1,
        linestyle: 1
      }
    );
    
    // Draw target line
    trendline(
      current_time,
      targetPrice,
      current_time + 57600000,
      targetPrice,
      {
        color: '#FFD700',
        linewidth: 1,
        linestyle: 1
      }
    );
  }
  
  // ══════════════════════════════════════════════════════════════════════════════
  // PLOT SMAs
  // ══════════════════════════════════════════════════════════════════════════════
  
  plot.line('35 SMA', sma35, sma35Color, 0);
  plot.line('150 SMA', sma150, sma150Color, 0);
};

// ══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

// Convert hex color to rgba
const hexToRgba = (hex, alpha) => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
