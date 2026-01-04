//@version=1
// Simplified Sweep Strategy - FXR Script
// Core functionality only - easier to test and debug

init = () => {
  indicator({ onMainPanel: true, format: 'inherit' });
  
  // Basic parameters
  input.int('SMA Period', 35, 'smaPeriod');
  input.float('Close Threshold', 0.6, 'closeThreshold');
  input.color('Bullish Color', '#00FF00', 'bullishColor');
  input.color('Bearish Color', '#FF0000', 'bearishColor');
};

// Store price history
const closeArray = [];
const highArray = [];
const lowArray = [];
const timeArray = [];

onTick = (length, _moment, _, ta, inputs) => {
  // Get current candle data
  const close = closeC(0);
  const high_val = high(0);
  const low_val = low(0);
  const current_time = time(0);
  
  // Store in arrays
  closeArray.push(close);
  highArray.push(high_val);
  lowArray.push(low_val);
  timeArray.push(current_time);
  
  // Limit array size
  const maxLength = 100;
  if (closeArray.length > maxLength) {
    closeArray.shift();
    highArray.shift();
    lowArray.shift();
    timeArray.shift();
  }
  
  // Need enough data
  if (closeArray.length < inputs.smaPeriod + 2) {
    return;
  }
  
  // Calculate SMA
  const smaArray = ta.sma(closeArray, inputs.smaPeriod);
  const sma = smaArray.at(-1);
  
  // Calculate candle metrics
  const candleRange = high_val - low_val;
  const closePosition = candleRange > 0 ? (close - low_val) / candleRange : 0.5;
  
  // Get previous values
  const prevLow = lowArray[lowArray.length - 2];
  const prevHigh = highArray[highArray.length - 2];
  
  // ═══════════════════════════════════════════════════════════════
  // BULLISH SETUP: Sweeps low, closes high, above SMA
  // ═══════════════════════════════════════════════════════════════
  const sweepsLow = low_val < prevLow;
  const closesHigh = closePosition >= inputs.closeThreshold;
  const aboveSMA = close > sma;
  
  const bullishSetup = sweepsLow && closesHigh && aboveSMA;
  
  if (bullishSetup) {
    // Draw green rectangle below candle
    rectangle(
      current_time,
      low_val,
      current_time + 14400000, // 4 hours
      low_val - (candleRange * 0.5),
      {
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        color: inputs.bullishColor,
        linewidth: 2
      }
    );
    
    // Add label
    const pctText = Math.round(closePosition * 100) + '% ▲';
    text(
      current_time,
      high_val,
      pctText,
      {
        color: inputs.bullishColor,
        textColor: '#FFFFFF',
        fontSize: 12
      }
    );
    
    // Draw entry and stop levels
    const entryPrice = close;
    const stopPrice = low_val;
    const targetPrice = entryPrice + (entryPrice - stopPrice) * 2;
    
    // Entry line (green)
    trendline(current_time, entryPrice, current_time + 28800000, entryPrice, {
      color: '#00FF00',
      linewidth: 1,
      linestyle: 1
    });
    
    // Stop line (red)
    trendline(current_time, stopPrice, current_time + 28800000, stopPrice, {
      color: '#FF0000',
      linewidth: 1,
      linestyle: 1
    });
    
    // Target line (gold)
    trendline(current_time, targetPrice, current_time + 28800000, targetPrice, {
      color: '#FFD700',
      linewidth: 1,
      linestyle: 1
    });
  }
  
  // ═══════════════════════════════════════════════════════════════
  // BEARISH SETUP: Sweeps high, closes low, below SMA
  // ═══════════════════════════════════════════════════════════════
  const sweepsHigh = high_val > prevHigh;
  const closesLow = closePosition <= (1 - inputs.closeThreshold);
  const belowSMA = close < sma;
  
  const bearishSetup = sweepsHigh && closesLow && belowSMA;
  
  if (bearishSetup) {
    // Draw red rectangle above candle
    rectangle(
      current_time,
      high_val + (candleRange * 0.5),
      current_time + 14400000,
      high_val,
      {
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        color: inputs.bearishColor,
        linewidth: 2
      }
    );
    
    // Add label
    const pctText = Math.round((1 - closePosition) * 100) + '% ▼';
    text(
      current_time,
      low_val,
      pctText,
      {
        color: inputs.bearishColor,
        textColor: '#FFFFFF',
        fontSize: 12
      }
    );
    
    // Draw entry and stop levels
    const entryPrice = close;
    const stopPrice = high_val;
    const targetPrice = entryPrice - (stopPrice - entryPrice) * 2;
    
    // Entry line (red)
    trendline(current_time, entryPrice, current_time + 28800000, entryPrice, {
      color: '#FF0000',
      linewidth: 1,
      linestyle: 1
    });
    
    // Stop line (green)
    trendline(current_time, stopPrice, current_time + 28800000, stopPrice, {
      color: '#00FF00',
      linewidth: 1,
      linestyle: 1
    });
    
    // Target line (gold)
    trendline(current_time, targetPrice, current_time + 28800000, targetPrice, {
      color: '#FFD700',
      linewidth: 1,
      linestyle: 1
    });
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PLOT SMA
  // ═══════════════════════════════════════════════════════════════
  const smaColor = close > sma ? '#00FF00' : '#FF0000';
  plot.line('SMA', sma, smaColor, 0);
};
