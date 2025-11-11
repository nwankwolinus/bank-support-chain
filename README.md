# Bank Customer Support Prompt Chain

An intelligent 5-stage prompt chain for processing customer banking queries using Together AI.

## 📋 Overview

This project implements a sequential prompt chain that processes customer support queries through five stages:

1. **Intent Interpretation** - Understand what the customer wants
2. **Category Mapping** - Suggest possible categories (1-3 options)
3. **Category Selection** - Choose the best matching category
4. **Detail Extraction** - Extract relevant information (amounts, dates, etc.)
5. **Response Generation** - Generate a professional customer response

## 🎯 Available Categories

- Account Opening
- Billing Issue
- Account Access
- Transaction Inquiry
- Card Services
- Account Statement
- Loan Inquiry
- General Information

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Together AI API key ([Get one here](https://api.together.xyz/signup) - $25 free credits!)

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/bank-support-chain.git
cd bank-support-chain
```

2. Install dependencies:
```bash
npm install dotenv
```

3. Create a `.env` file in the project root:
```bash
TOGETHER_API_KEY=your_together_ai_api_key_here
```

4. Run the script:
```bash
node prompt-chain.js
```

## 📂 Project Structure

```
bank-support-chain/
│
├── prompt-chain.js     # Main implementation file
├── .env               # API key configuration (not tracked in git)
├── .env.example       # Example environment file
├── .gitignore         # Git ignore file
└── README.md          # This file
```

## 💻 Usage

### Basic Usage

```javascript
const { runPromptChain } = require('./prompt-chain.js');

// Process a customer query
const query = "I was charged $50 fee yesterday and I don't know why";
const results = await runPromptChain(query);

// results is an array of 5 outputs:
// [intent, categories, selectedCategory, details, finalResponse]

console.log('Intent:', results[0]);
console.log('Categories:', results[1]);
console.log('Selected Category:', results[2]);
console.log('Details:', results[3]);
console.log('Final Response:', results[4]);
```

### Running Built-in Tests

The script includes 5 built-in test cases. Simply run:

```bash
node prompt-chain.js
```

This will process the following sample queries:
- "I was charged $50 fee yesterday and I don't know why"
- "I want to open a savings account"
- "I can't log into my online banking"
- "Where is my pending transaction from Amazon?"
- "My debit card is not working at ATMs"

## 🔧 Configuration

### Change AI Model

Edit line 20 in `prompt-chain.js`:

```javascript
const MODEL = 'meta-llama/Llama-3-70b-chat-hf'; // Default (recommended)

// Alternative models:
// const MODEL = 'mistralai/Mixtral-8x7B-Instruct-v0.1'; // More affordable
// const MODEL = 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'; // Latest Llama
// const MODEL = 'Qwen/Qwen2.5-72B-Instruct-Turbo'; // Great multilingual
```

### Adjust Temperature

For different use cases, modify the temperature parameter in `callTogetherAI()`:

```javascript
// For more consistent classification (Stages 1-4)
temperature: 0.2-0.4

// For more creative responses (Stage 5)
temperature: 0.4-0.7
```

### Add Custom Test Queries

Edit the `testQueries` array in the `main()` function (around line 137):

```javascript
const testQueries = [
    "I was charged $50 fee yesterday",
    "I want to open a savings account",
    "Your custom query here",
    // Add more queries
];
```

## 📊 Example Output

```
================================================================================
PROCESSING QUERY: I was charged $50 fee yesterday and I don't know why
================================================================================

[Stage 1] Intent Interpretation...
Intent: The customer is reporting an unexpected charge or billing issue.

[Stage 2] Category Mapping...
Categories: 1. Billing Issue - The query directly relates to charges or fees.
           2. Transaction Inquiry - The unexpected charge may be a specific transaction.

[Stage 3] Category Selection...
Selected Category: Billing Issue: This is the most specific and direct match.

[Stage 4] Detail Extraction...
Details: - Amount: $50
         - Time period: yesterday

[Stage 5] Response Generation...
Final Response: I understand your concern about the $50 charge from yesterday. 
I'm here to help resolve this for you. I'll need to investigate this transaction 
further. Please provide your account number (last 4 digits only) and I'll escalate 
this to our billing department for immediate review. We typically resolve billing 
inquiries within 2-3 business days.

================================================================================
```

## 💰 Cost Estimate

Using Llama 3 70B model ($0.88 per 1M tokens):

| Usage | Tokens | Cost |
|-------|--------|------|
| Per query | ~2,000 | $0.0018 (~0.2¢) |
| 100 queries | ~200,000 | $0.18 |
| 1,000 queries | ~2M | $1.76 |

**Your $25 free credits cover approximately 13,800+ queries!**

## 🔐 Security Notes

- ⚠️ **Never commit your `.env` file to Git** - it contains your API key
- The `.gitignore` file is configured to exclude `.env`
- Detail extraction stage only captures last 4 digits of account numbers
- API keys are loaded securely from environment variables

## 🐛 Troubleshooting

### "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

### "Please set your Together AI API key!"

**Solution 1:** Check your `.env` file format
```bash
# Correct format (no quotes):
TOGETHER_API_KEY=together_abc123xyz

# Incorrect formats:
TOGETHER_API_KEY="together_abc123xyz"  # Don't use quotes
TOGETHER_API_KEY = together_abc123xyz  # Don't use spaces
```

**Solution 2:** Make sure `.env` is in the same folder as `prompt-chain.js`

**Solution 3:** Verify your API key at https://api.together.xyz/settings/api-keys

### "401 Unauthorized"
- Your API key is invalid or expired
- Get a new key from [Together AI Dashboard](https://api.together.xyz/settings/api-keys)
- Check that you have credits remaining in your account

### "fetch is not defined" (Node.js < v18)
Install node-fetch:
```bash
npm install node-fetch
```

Then add to top of `prompt-chain.js`:
```javascript
const fetch = require('node-fetch');
```

## 📝 Assignment Requirements

This project fulfills all assignment requirements:

✅ **Function Requirements:**
- Function named `runPromptChain()` that accepts a string query
- Returns an array of 5 intermediate outputs (one per stage)
- Sequential execution through all 5 stages

✅ **Prompt Chain Requirements:**
- Stage 1: Interprets customer intent
- Stage 2: Maps query to 1-3 possible categories
- Stage 3: Selects the most appropriate category
- Stage 4: Extracts additional details (amounts, dates, etc.)
- Stage 5: Generates professional customer response

✅ **Category Requirements:**
- All 8 categories implemented and accessible
- Proper categorization logic

✅ **File Requirements:**
- File named `prompt-chain.js`
- Complete implementation with test cases

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime
- **Together AI API** - AI model inference
- **dotenv** - Environment variable management
- **Llama 3 70B** - Language model (default)

## 📚 Additional Resources

- [Together AI Documentation](https://docs.together.ai/)
- [Together AI Pricing](https://www.together.ai/pricing)
- [Available Models](https://docs.together.ai/docs/inference-models)
- [Node.js Fetch API](https://nodejs.org/dist/latest-v18.x/docs/api/globals.html#fetch)

## 🤝 Contributing

This is an educational project. Feel free to fork and modify for your learning purposes.

## 📄 License

This project is for educational purposes as part of a coding bootcamp assignment.

## 👤 Author

**Your Name**
- GitHub: [@nwankwolinus](https://github.com/nwankwolinus)
- Email: nwankwolinus9@gmail.com

## 🙏 Acknowledgments

- KodeCamp for the project requirements
- Together AI for providing accessible AI infrastructure
- Meta for the Llama 3 model

---

**Last Updated:** November 2025