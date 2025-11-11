/**
 * Bank Customer Support Prompt Chain Implementation
 * Using Together AI API
 * 
 * This script implements a 5-stage prompt chain for processing customer queries:
 * 1. Intent Interpretation
 * 2. Category Mapping
 * 3. Category Selection
 * 4. Detail Extraction
 * 5. Response Generation
 * 
 * @author Customer Support System
 * @date 2025
 */
// Load environment variables from .env file
require('dotenv').config();

// CONFIGURATION
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY || 'YOUR_TOGETHER_API_KEY_HERE';
const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';
const MODEL = 'meta-llama/Llama-3-70b-chat-hf'; // You can also use: 'mistralai/Mixtral-8x7B-Instruct-v0.1'

/**
 * Call Together AI API with a prompt
 * @param {string} prompt - The prompt to send
 * @param {number} temperature - Temperature for response generation
 * @param {number} maxTokens - Maximum tokens in response
 * @returns {Promise<string>} - The AI's response
 */
async function callTogetherAI(prompt, temperature = 0.3, maxTokens = 500) {
    try {
        const response = await fetch(TOGETHER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOGETHER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: temperature,
                max_tokens: maxTokens,
                top_p: 0.9,
                stop: ['<|eot_id|>', '<|end_of_text|>']
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Together AI API Error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error calling Together AI:', error.message);
        throw error;
    }
}

/**
 * Execute the 5-stage prompt chain for customer query processing.
 * 
 * @param {string} query - The customer's free-text query
 * @returns {Promise<Array<string>>} A list of 5 intermediate outputs, one for each stage
 */
async function runPromptChain(query) {
    console.log('\n' + '='.repeat(80));
    console.log('PROCESSING QUERY:', query);
    console.log('='.repeat(80));

    const results = [];

    // Stage 1: Intent Interpretation
    console.log('\n[Stage 1] Intent Interpretation...');
    const prompt1 = `Analyze the following customer query and identify the primary intent. What is the customer trying to accomplish or what problem are they reporting?

Customer Query: ${query}

Provide a clear, one-sentence summary of the customer's intent. Focus on the underlying need or goal, not just the literal words used.`;
    
    const intent = await callTogetherAI(prompt1, 0.3, 150);
    results.push(intent);
    console.log('Intent:', intent);

    // Stage 2: Category Mapping
    console.log('\n[Stage 2] Category Mapping...');
    const prompt2 = `Based on the customer's intent, suggest 1-3 possible categories that could apply from this list:
- Account Opening
- Billing Issue
- Account Access
- Transaction Inquiry
- Card Services
- Account Statement
- Loan Inquiry
- General Information

Customer Intent: ${intent}

List the categories in order of relevance (most relevant first). For each category, provide a brief reason why it might apply.`;
    
    const categories = await callTogetherAI(prompt2, 0.3, 250);
    results.push(categories);
    console.log('Categories:', categories);

    // Stage 3: Category Selection
    console.log('\n[Stage 3] Category Selection...');
    const prompt3 = `Review the suggested categories and select the single most appropriate category for this customer query.

Customer Intent: ${intent}
Original Query: ${query}
Suggested Categories: ${categories}

Choose exactly ONE category from the suggestions and explain your choice in 1-2 sentences. Consider which category would lead to the most effective resolution of the customer's issue.

Selected Category:`;
    
    const selectedCategory = await callTogetherAI(prompt3, 0.3, 150);
    results.push(selectedCategory);
    console.log('Selected Category:', selectedCategory);

    // Stage 4: Detail Extraction
    console.log('\n[Stage 4] Detail Extraction...');
    const categoryName = selectedCategory.split(':')[0].trim();
    const prompt4 = `Identify any additional details from the customer's query that would be relevant for addressing their request in the "${categoryName}" category.

Original Query: ${query}

Extract the following types of information if present:
- Specific amounts (transaction amounts, fees, etc.)
- Dates or time periods
- Account types or numbers (last 4 digits only)
- Card types (credit/debit)
- Transaction descriptions or merchant names
- Any error messages or specific symptoms

List each detail found with its type. If no additional details are present, state "No additional details provided."`;
    
    const details = await callTogetherAI(prompt4, 0.3, 200);
    results.push(details);
    console.log('Details:', details);

    // Stage 5: Response Generation
    console.log('\n[Stage 5] Response Generation...');
    const prompt5 = `Generate a professional, helpful response to the customer based on all the information gathered.

Category: ${selectedCategory}
Customer Intent: ${intent}
Additional Details: ${details}
Original Query: ${query}

Your response should:
- Acknowledge the customer's concern
- Provide relevant next steps or information
- Be concise (2-4 sentences)
- Use a friendly, professional tone
- Include any relevant details extracted from their query

Response:`;
    
    const response = await callTogetherAI(prompt5, 0.5, 300);
    results.push(response);
    console.log('Final Response:', response);

    console.log('\n' + '='.repeat(80));
    return results;
}

/**
 * Main function to run test cases
 */
async function main() {
    // Check if API key is set
    if (TOGETHER_API_KEY === 'YOUR_TOGETHER_API_KEY_HERE') {
        console.error('\n❌ ERROR: Please set your Together AI API key!');
        console.error('\nOptions:');
        console.error('1. Set environment variable: export TOGETHER_API_KEY="your-key-here"');
        console.error('2. Replace YOUR_TOGETHER_API_KEY_HERE in the code with your actual key');
        console.error('\nGet your API key from: https://api.together.xyz/settings/api-keys\n');
        return;
    }

    // Test cases
    const testQueries = [
        "I was charged $50 fee yesterday and I don't know why",
        "I want to open a savings account",
        "I can't log into my online banking",
        "Where is my pending transaction from Amazon?",
        "My debit card is not working at ATMs"
    ];

    console.log('\n' + '='.repeat(80));
    console.log('BANK CUSTOMER SUPPORT PROMPT CHAIN - TOGETHER AI');
    console.log('Model:', MODEL);
    console.log('='.repeat(80));

    try {
        // Process each query
        for (let i = 0; i < testQueries.length; i++) {
            const query = testQueries[i];
            console.log(`\n\n${'#'.repeat(80)}`);
            console.log(`TEST CASE ${i + 1} of ${testQueries.length}`);
            console.log(`${'#'.repeat(80)}`);
            
            const results = await runPromptChain(query);
            
            // Summary
            console.log('\n' + '-'.repeat(80));
            console.log('SUMMARY OF ALL STAGES:');
            console.log('-'.repeat(80));
            const stages = [
                'Stage 1 - Intent',
                'Stage 2 - Categories',
                'Stage 3 - Selected Category',
                'Stage 4 - Details',
                'Stage 5 - Response'
            ];
            stages.forEach((stage, idx) => {
                console.log(`\n${stage}:`);
                console.log(results[idx]);
            });
            
            // Add delay between queries to respect rate limits
            if (i < testQueries.length - 1) {
                console.log('\n⏳ Waiting 2 seconds before next query...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        console.log('\n\n' + '='.repeat(80));
        console.log('✅ ALL TEST CASES COMPLETED SUCCESSFULLY!');
        console.log('='.repeat(80) + '\n');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error('\nTroubleshooting:');
        console.error('- Check your API key is valid');
        console.error('- Verify you have credits in your Together AI account');
        console.error('- Check your internet connection');
        console.error('- Visit: https://api.together.xyz/settings/api-keys\n');
    }
}

// Export for use as a module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runPromptChain, callTogetherAI };
}

// Run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
    main();
}