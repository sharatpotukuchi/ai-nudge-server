// AI Nudge Server with GPT Integration for Academic Research
// Usage: node dev/mock-nudge-server.js
// Requires: OPENAI_API_KEY environment variable
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(express.json({ limit: '200kb' }));
app.use(cors({ origin: true, credentials: false }));

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Pre-defined nudge categories for academic rigor
const NUDGE_CATEGORIES = {
  'execution_cost': {
    title: 'Execution Cost Consideration',
    templates: [
      'Consider the execution cost vs. expected price movement.',
      'The spread and fees may impact your expected returns.',
      'Factor in transaction costs when evaluating this trade.'
    ]
  },
  'fair_value_anchor': {
    title: 'Fair Value vs. Entry Price',
    templates: [
      'Your entry price is {distance} from the fair value estimate.',
      'Consider whether the current price reflects fundamental value.',
      'The gap between entry and fair value suggests {interpretation}.'
    ]
  },
  'herding_bias': {
    title: 'Herding Bias Awareness',
    templates: [
      'High investor buying activity ({pct}%) may indicate herding behavior.',
      'Consider whether others\' actions reflect your own analysis.',
      'Avoid following the crowd without independent evaluation.'
    ]
  },
  'hot_decisions': {
    title: 'Time Pressure Impact',
    templates: [
      'Timer pressure can lead to rushed decisions.',
      'Take a moment to consider all factors carefully.',
      'Hot decisions often lead to suboptimal outcomes.'
    ]
  },
  'cct_risk_awareness': {
    title: 'Risk Assessment',
    templates: [
      'Given your risk profile, consider position sizing carefully.',
      'Your risk tolerance suggests {advice} for this trade.',
      'Evaluate whether this trade aligns with your risk preferences.'
    ]
  }
};

// CCT score interpretation
function interpretCCTScore(cctScore) {
  if (cctScore == null) return { level: 'unknown', advice: 'standard risk assessment' };
  if (cctScore >= 0.8) return { level: 'high', advice: 'conservative approach recommended' };
  if (cctScore >= 0.5) return { level: 'medium', advice: 'balanced risk management' };
  return { level: 'low', advice: 'careful position sizing advised' };
}

// Generate personalized nudge using GPT
async function generatePersonalizedNudge(scenario) {
  try {
    const { exec, sym, last, bid, ask, fair_value, anchor_target, sentiment_pct, hot_condition, profile, portfolio, scenario: scenarioInfo, trading_context } = scenario;
    const cctInfo = interpretCCTScore(profile?.cct_score);
    
    // Detect if this is enhanced payload
    const isEnhancedPayload = !!(portfolio || scenarioInfo || trading_context);
    
    // Build context for GPT
    const context = {
      trade: {
        side: exec?.side || 'Buy',
        quantity: exec?.qty || 0,
        orderType: exec?.ordType || 'Market',
        price: exec?.ordPx || 'Market'
      },
      market: {
        symbol: sym || 'TICKER',
        lastPrice: last,
        bid: bid,
        ask: ask,
        spread: (ask && bid) ? (ask - bid).toFixed(2) : null
      },
      analysis: {
        fairValue: fair_value,
        anchorTarget: anchor_target,
        sentimentPercent: sentiment_pct,
        isHotCondition: hot_condition === '1' || hot_condition === true
      },
      participant: {
        // Demographics
        age: profile?.demographics?.age,
        gender: profile?.demographics?.gender,
        education: profile?.demographics?.education,
        householdIncome: profile?.demographics?.household_income,
        employment: profile?.demographics?.employment,
        
        // Trading Experience & Knowledge
        tradingExperience: profile?.experience?.trading_years,
        confidence: profile?.experience?.confidence,
        financialEducation: profile?.experience?.financial_education,
        investmentTypes: profile?.experience?.investment_types,
        marketKnowledge: profile?.experience?.market_knowledge,
        
        // Psychological Traits & State
        regretAvoidance: profile?.psychological_traits?.regret_avoidance,
        preMood: profile?.psychological_traits?.pre_mood,
        preDecisionFatigue: profile?.psychological_traits?.pre_decision_fatigue,
        
        // CCT Risk Profile
        cctScore: profile?.cct_score,
        cctHotScore: profile?.cct_hot_score,
        cctColdScore: profile?.cct_cold_score,
        cctHotColdDiff: profile?.cct_hot_cold_diff,
        cctLevel: cctInfo.level,
        
        // Legacy fields for backward compatibility
        screenerData: profile?.screener || {}
      },
      // Enhanced context (only if available)
      portfolio: isEnhancedPayload ? {
        balance: portfolio?.balance,
        position: portfolio?.posQty,
        avgPrice: portfolio?.posPx,
        unrealizedPL: portfolio?.unrealizedPL,
        realizedPL: portfolio?.realizedPL,
        maxDrawdown: portfolio?.maxDrawdown,
        maxDrawdownPct: portfolio?.maxDrawdownPct,
        totalReturn: portfolio?.totalReturn,
        tradeCount: portfolio?.tradeCount,
        currentDrawdown: portfolio?.currentDrawdown,
        currentDrawdownPct: portfolio?.currentDrawdownPct
      } : null,
      scenario: isEnhancedPayload ? {
        name: scenarioInfo?.name,
        sessionTag: scenarioInfo?.session_tag,
        newsHead: scenarioInfo?.news_head,
        biasFocus: scenarioInfo?.bias_focus,
        timerSec: scenarioInfo?.timer_sec
      } : null,
      tradingContext: isEnhancedPayload ? {
        startBalance: trading_context?.scenario_start_balance,
        startPosition: trading_context?.scenario_start_position,
        startPrice: trading_context?.scenario_start_price,
        previousTrades: trading_context?.previous_trades_count,
        previousRealizedPL: trading_context?.previous_realized_pl
      } : null
    };

    // Create GPT prompt for academic research context
    const prompt = `You are an AI assistant providing trading nudges for academic research on behavioral finance. Generate a helpful, personalized nudge based on the trading scenario.

SCENARIO:
- Trade: ${context.trade.side} ${context.trade.quantity} shares of ${context.market.symbol} (${context.trade.orderType} order)
- Market: Last=${context.market.lastPrice}, Bid=${context.market.bid}, Ask=${context.market.ask}${context.market.spread ? `, Spread=$${context.market.spread}` : ''}
- Analysis: Fair Value=${context.analysis.fairValue}, Anchor=${context.analysis.anchorTarget}, Investors Buying=${context.analysis.sentimentPercent}%
- Participant: CCT Score=${context.participant.cctScore} (${context.participant.cctLevel} risk tolerance)${context.participant.cctHotScore ? `, Hot/Cold: ${context.participant.cctHotScore}/${context.participant.cctColdScore} (diff: ${context.participant.cctHotColdDiff})` : ''}
- Demographics: ${context.participant.age || 'Unknown'} ${context.participant.gender || 'Unknown'}, ${context.participant.education || 'Unknown'} education, ${context.participant.householdIncome || 'Unknown'} income
- Experience: ${context.participant.tradingExperience || 'Unknown'} trading experience, ${context.participant.confidence || 'Unknown'}/10 confidence, ${context.participant.marketKnowledge || 'Unknown'} market knowledge
- State: ${context.participant.preMood || 'Unknown'} mood, ${context.participant.preDecisionFatigue || 'Unknown'} decision fatigue, ${context.participant.regretAvoidance || 'Unknown'}/7 regret avoidance
- Time Pressure: ${context.analysis.isHotCondition ? 'Yes' : 'No'}${context.scenario?.timerSec ? ` (${context.scenario.timerSec}s timer)` : ''}

${isEnhancedPayload ? `ENHANCED CONTEXT:
- Portfolio: Balance=$${context.portfolio.balance}, Position=${context.portfolio.position}@$${context.portfolio.avgPrice}, Unrealized P&L=$${context.portfolio.unrealizedPL}, Realized P&L=$${context.portfolio.realizedPL}
- Performance: Total Return=${(context.portfolio.totalReturn * 100).toFixed(2)}%, Max Drawdown=${context.portfolio.maxDrawdownPct}%, Current Drawdown=${context.portfolio.currentDrawdownPct}%
- Trading History: ${context.portfolio.tradeCount} trades completed, Previous P&L=$${context.tradingContext.previousRealizedPL}
- Scenario: ${context.scenario.name} (${context.scenario.sessionTag}), News: ${context.scenario.newsHead}
- Bias Focus: ${context.scenario.biasFocus}

` : ''}ACADEMIC RESEARCH GUIDELINES:
1. Choose 1-2 most relevant behavioral biases to address
2. Use academic, neutral language appropriate for research
3. Be helpful but NOT prescriptive - never tell them what to do
4. Keep response under 150 words
5. Focus on decision-making process, NOT specific trade advice
6. Consider the participant's risk profile (CCT score and hot/cold patterns)
7. NEVER give financial advice or recommend specific actions
8. Focus on awareness of biases, not solutions
9. Use phrases like "consider", "be aware", "reflect on" - never "should", "must", "recommend"
10. Maintain research neutrality - don't advantage treatment group unfairly
${isEnhancedPayload ? '11. Use portfolio context to provide more relevant bias awareness\n12. Consider trading history and performance patterns' : ''}

AVAILABLE NUDGE CATEGORIES:
- Execution Cost: Focus on spread, fees, transaction costs
- Fair Value Anchor: Compare entry price to fair value estimates
- Herding Bias: Address high investor buying activity
- Hot Decisions: Warn about time pressure effects
- Risk Awareness: Tailor advice based on CCT score
${isEnhancedPayload ? '- Portfolio Risk: Address drawdown, position sizing, performance patterns\n- Behavioral Patterns: Use hot/cold CCT differences and trading history' : ''}

Generate a personalized nudge that addresses the most relevant behavioral bias for this specific scenario.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant providing behavioral finance nudges for academic research. Your role is to raise awareness of potential biases in decision-making. You must NEVER give financial advice, recommend specific actions, or tell participants what to do. Focus only on making them aware of behavioral biases that might influence their decision-making process. Use neutral, academic language. Never use prescriptive words like 'should', 'must', 'recommend', or 'advise'."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    const nudgeText = completion.choices[0]?.message?.content?.trim() || 'Consider all factors carefully before making your trading decision.';
    
    return {
      model: 'gpt-4o-mini',
      suggestion_html: `<div><b>AI Trade Feedback:</b> ${nudgeText}</div>`,
      suggestion_text: nudgeText,
      meta: {
        received_at: Date.now(),
        cct_score: context.participant.cctScore,
        cct_level: context.participant.cctLevel,
        sentiment_pct: context.analysis.sentimentPercent,
        is_hot: context.analysis.isHotCondition,
        tokens_used: completion.usage?.total_tokens || 0
      }
    };

  } catch (error) {
    console.error('GPT API Error:', error.message);
    
    // Fallback to rule-based nudge if GPT fails
    const side = scenario.exec?.side || 'Buy';
    const qty = scenario.exec?.qty || 0;
    const sym = scenario.sym || 'TICKER';
    const fv = scenario.fair_value;
    const last = scenario.last;
    const cctInfo = interpretCCTScore(scenario.profile?.cct_score);
    const isEnhancedPayload = !!(scenario.portfolio || scenario.scenario || scenario.trading_context);
    
    const fallbackAdvice = [
      `You are placing ${qty} ${side} on ${sym}.`,
      fv && last ? `Entry vs. fair value: ${(last - fv).toFixed(2)}.` : null,
      `Risk note (CCT ${cctInfo.level}): ${cctInfo.advice}.`,
      scenario.sentiment_pct >= 70 ? 'High investor buying activity may indicate herding behavior.' : null,
      scenario.hot_condition === '1' ? 'Timer pressure can affect decision quality.' : null,
      // Participant context
      scenario.profile?.demographics?.trading_experience ? `Your ${scenario.profile.demographics.trading_experience} experience suggests ${scenario.profile.demographics.trading_experience.includes('None') || scenario.profile.demographics.trading_experience.includes('Less than') ? 'caution' : 'consideration'} of all factors.` : null,
      scenario.profile?.psychological_traits?.pre_mood ? `Your current mood (${scenario.profile.psychological_traits.pre_mood}) may influence decision-making.` : null,
      scenario.profile?.psychological_traits?.pre_decision_fatigue ? `Decision fatigue level (${scenario.profile.psychological_traits.pre_decision_fatigue}) may affect judgment.` : null,
      // Enhanced fallback advice
      isEnhancedPayload && scenario.portfolio ? `Portfolio: $${scenario.portfolio.balance} balance, ${scenario.portfolio.posQty} position, ${scenario.portfolio.unrealizedPL >= 0 ? '+' : ''}$${scenario.portfolio.unrealizedPL} unrealized P&L.` : null,
      isEnhancedPayload && scenario.portfolio?.maxDrawdownPct > 2 ? `You're currently ${scenario.portfolio.currentDrawdownPct}% below peak. Consider risk management.` : null,
      isEnhancedPayload && scenario.profile?.cct_hot_cold_diff ? `Your risk-taking shows ${scenario.profile.cct_hot_cold_diff > 0 ? 'more caution under pressure' : 'consistent risk-taking across conditions'}.` : null
    ].filter(Boolean).join(' ');

    return {
      model: 'fallback-rule-based',
      suggestion_html: `<div><b>AI Trade Feedback:</b> ${fallbackAdvice}</div>`,
      suggestion_text: fallbackAdvice,
      meta: {
        received_at: Date.now(),
        error: error.message,
        fallback: true,
        enhanced_payload: isEnhancedPayload
      }
    };
  }
}

app.post('/nudge', async (req, res) => {
  try {
    const body = req.body || {};
    const isEnhancedPayload = !!(body.portfolio || body.scenario || body.trading_context);
    
    console.log('Received nudge request:', {
      symbol: body.sym,
      side: body.exec?.side,
      qty: body.exec?.qty,
      cct_score: body.profile?.cct_score,
      sentiment: body.sentiment_pct,
      payload_type: isEnhancedPayload ? 'enhanced' : 'basic',
      has_portfolio: !!body.portfolio,
      has_scenario: !!body.scenario,
      has_trading_context: !!body.trading_context,
      // Participant demographics
      age: body.profile?.demographics?.age,
      gender: body.profile?.demographics?.gender,
      education: body.profile?.demographics?.education,
      trading_experience: body.profile?.experience?.trading_years,
      confidence: body.profile?.experience?.confidence,
      pre_mood: body.profile?.psychological_traits?.pre_mood,
      pre_decision_fatigue: body.profile?.psychological_traits?.pre_decision_fatigue
    });
    console.log('Request headers:', req.headers);
    console.log('Request timestamp:', new Date().toISOString());

    const result = await generatePersonalizedNudge(body);
    res.json(result);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      model: 'error',
      suggestion_html: '<div>Unable to generate nudge at this time.</div>',
      suggestion_text: 'Unable to generate nudge at this time.',
      meta: { error: error.message, received_at: Date.now() }
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: Date.now(),
    hasOpenAI: !!process.env.OPENAI_API_KEY
  });
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`AI Nudge server listening on http://localhost:${port}/nudge`);
  console.log(`Health check: http://localhost:${port}/health`);
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY not set - will use fallback rule-based nudges');
  } else {
    console.log('✅ OpenAI API key found - GPT-powered nudges enabled');
  }
});
