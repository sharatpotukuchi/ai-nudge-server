# AI Nudge Server for Qualtrics Trading Simulator

## Overview
This AI-powered nudge server provides **realistic, market-contextual trading nudges** for the Qualtrics Trading Simulator experiment. The server uses OpenAI's GPT models to generate **professional trading platform-style advice** based on participant risk profiles, trading behavior, and market conditions.

**Key Features:**
- **Market-Realistic Language**: Professional trading platform advisor context
- **Time-Pressure Optimized**: Ultra-concise nudges (max 80 words)
- **Visual Enhancement**: Formatted display with colors and symbols
- **Academic Neutrality**: Maintains research integrity while using realistic language

## Features

### Enhanced Risk Profiling Integration
- **CCT Risk Assessment**: Comprehensive Columbia Card Task risk profiling
- **Behavioral Pattern Analysis**: Hot vs cold decision-making preferences
- **Risk Consistency Analysis**: Identifies consistent vs inconsistent risk-taking patterns
- **Gain/Loss Sensitivity**: Analyzes participant sensitivity to gains and losses

### CCT-Based Personalization Strategy
- **Risk Profile Analysis**: Uses CCT risk level, score, and consistency to tailor nudges
- **Hot/Cold Pattern Analysis**: Leverages pressure vs. calm decision-making differences
- **Gain/Loss Sensitivity Mapping**: Maps sensitivity patterns to specific bias awareness
- **Intelligent Bias Selection**: CCT patterns automatically mapped to relevant bias nudges:
  - High Risk + High Loss Aversion → Loss Aversion Awareness, Risk Awareness
  - Low Risk + High Gain Sensitivity → FOMO Awareness, Present Bias Awareness
  - Inconsistent Risk → Decision Fatigue Awareness, Confirmation Bias Awareness
  - High Risk + High Hot Score → Overtrading Awareness, Status Quo Bias Awareness
  - Low Risk + High Cold Score → Disposition Effect Awareness, Base Rate Neglect Awareness

### Treatment Group Support
- **Control Group**: No nudges provided
- **Generic Nudge Group**: Basic nudges without CCT data
- **Enhanced Nudge Group**: Advanced nudges with full CCT risk profiling

### Recent Enhancements
- **Realistic Trading Context**: Server acts as professional trading platform advisor
- **Ultra-Concise Format**: Optimized for time pressure (max 80 words)
- **Visual Formatting**: Enhanced display with colors, bolding, and symbols
- **Market-Realistic Language**: Professional trading advice instead of academic language
- **Time-Pressure Optimization**: Nudges designed for quick reading under time constraints
- **Comprehensive Bias Coverage**: All 9 behavioral biases now have awareness nudges
- **CCT-Based Personalization**: Sophisticated bias selection based on risk profiles
- **Intelligent Bias Mapping**: CCT patterns mapped to specific bias awareness nudges

### Comprehensive Nudge Categories
- **Execution Cost Awareness**: Focus on transaction costs and spreads
- **Fair Value Anchoring**: Compare entry prices to fair value estimates
- **Herding Bias Awareness**: Address high investor buying activity
- **Disposition Effect Awareness**: Consider position performance vs. market conditions
- **Loss Aversion Awareness**: Consider risk tolerance vs. potential losses
- **Confirmation Bias Awareness**: Consider multiple market perspectives
- **FOMO Awareness**: Consider investment timeline vs. market timing
- **Overtrading Awareness**: Consider trading frequency vs. opportunities
- **Present Bias Awareness**: Consider long-term vs. short-term outlook
- **Status Quo Bias Awareness**: Consider whether market conditions warrant change
- **Base Rate Neglect Awareness**: Consider overall trends vs. specific signals
- **Decision Fatigue Awareness**: Consider taking time to reassess conditions
- **Risk Awareness**: Tailored advice based on CCT risk profiles
- **Portfolio Risk Management**: Address drawdown and position sizing

## API Endpoints

### Enhanced Nudge Endpoint
```
POST /enhanced-nudge
```
**Payload Structure:**
```json
{
  "exec": {
    "side": "Buy",
    "qty": 100,
    "ordType": "Market",
    "ordPx": "Market"
  },
  "sym": "TICKER",
  "last": 100.50,
  "bid": 100.45,
  "ask": 100.55,
  "fair_value": 100.60,
  "anchor_target": 100.00,
  "sentiment_pct": 75,
  "hot_condition": "1",
  "profile": {
    "cct": {
      "total_score": 150,
      "hot_score": 80,
      "cold_score": 70,
      "hot_cold_diff": 10,
      "bucket": "moderate",
      "risk_profile": {
        "risk_level": "moderate",
        "risk_score": 65,
        "risk_type": "balanced",
        "risk_consistency": "consistent",
        "risk_preference": "hot_preference",
        "gain_sensitivity": "high",
        "loss_aversion": "low"
      },
      "risk_level": "moderate",
      "risk_score": 65,
      "risk_type": "balanced",
      "risk_consistency": "consistent",
      "risk_preference": "hot_preference",
      "gain_sensitivity": "high",
      "loss_aversion": "low"
    }
  }
}
```

### Generic Nudge Endpoint
```
POST /generic-nudge
```
**Payload Structure:**
```json
{
  "exec": {
    "side": "Buy",
    "qty": 100,
    "ordType": "Market"
  },
  "sym": "TICKER",
  "last": 100.50,
  "bid": 100.45,
  "ask": 100.55,
  "fair_value": 100.60,
  "anchor_target": 100.00,
  "sentiment_pct": 75,
  "hot_condition": "1"
}
```

## Risk Profiling Integration

### CCT Risk Levels
- **very_low**: Total score < 50 (very_conservative)
- **low**: Total score 50-100 (conservative)
- **moderate**: Total score 100-200 (balanced)
- **high**: Total score 200-300 (moderate_aggressive)
- **very_high**: Total score > 300 (aggressive)

### Risk Consistency Patterns
- **consistent**: Hot-cold difference < 50 points
- **inconsistent**: Hot-cold difference 50-100 points
- **highly_inconsistent**: Hot-cold difference > 100 points

### Risk Preferences
- **hot_preference**: Higher scores in hot condition
- **cold_preference**: Higher scores in cold condition
- **strong_hot_preference**: Hot score > cold score + 50
- **strong_cold_preference**: Cold score > hot score + 50

## Setup and Installation

### Prerequisites
- Node.js 16+ 
- OpenAI API key

### Installation
```bash
npm install
```

### Environment Variables
```bash
export OPENAI_API_KEY="your-openai-api-key-here"
```

### Running the Server
```bash
# Development
npm run dev

# Production
npm start

# Testing
npm test
```

## Deployment

### Railway Deployment
See `RAILWAY_DEPLOYMENT.md` for detailed deployment instructions.

### Environment Variables (Railway)
- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Server port (default: 3000)

## Academic Research Guidelines

The server follows strict academic research guidelines while maintaining market realism:

1. **Market-Realistic Language**: Uses professional trading platform language
2. **Bias Awareness**: Focuses on awareness rather than solutions
3. **Research Neutrality**: Maintains fairness across treatment groups
4. **No Financial Advice**: Never provides specific trade recommendations
5. **Decision Process Focus**: Emphasizes decision-making awareness
6. **Academic Neutrality**: Maintains research integrity while using realistic language
7. **Time-Pressure Optimization**: Ultra-concise format for quick reading

## Response Format

### Success Response
```json
{
  "success": true,
  "nudge": "Consider the execution cost vs. expected price movement. The spread and fees may impact your expected returns.",
  "category": "execution_cost",
  "timestamp": "2025-01-01T12:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-01-01T12:00:00Z"
}
```

## Testing

### Local Testing
```bash
# Test enhanced nudge endpoint
curl -X POST http://localhost:3000/enhanced-nudge \
  -H "Content-Type: application/json" \
  -d @test-payload.json

# Test generic nudge endpoint  
curl -X POST http://localhost:3000/generic-nudge \
  -H "Content-Type: application/json" \
  -d @test-payload-basic.json
```

### Test Payloads
See `test-server.js` for example test payloads and validation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See LICENSE file for details.

## Support

For questions or issues, please contact the research team or create an issue in the repository.
