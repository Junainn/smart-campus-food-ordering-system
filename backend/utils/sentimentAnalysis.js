import { HfInference } from '@huggingface/inference';

/**
 * Analyze sentiment of text using Hugging Face model
 * Supports both Bangla and English text
 * @param {string} text - The text to analyze
 * @returns {Promise<string>} - Sentiment label: 'positive', 'negative', or 'neutral'
 */
export const analyzeSentiment = async (text) => {
  try {
    console.log('🔍 [Sentiment Analysis] Starting analysis for text:', text.substring(0, 50) + '...');
    console.log('🔑 [Sentiment Analysis] API Key present:', !!process.env.HUGGINGFACE_API_KEY);
    console.log('🔑 [Sentiment Analysis] API Key (first 10 chars):', process.env.HUGGINGFACE_API_KEY?.substring(0, 10));
    
    // Use the Inference API directly (not the deprecated api-inference endpoint)
    const response = await fetch(
      'https://api-inference.huggingface.co/models/cardiffnlp/twitter-xlm-roberta-base-sentiment',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
          'x-use-cache': 'false', // Don't use cache, get fresh results
        },
        body: JSON.stringify({ 
          inputs: text,
          options: {
            wait_for_model: true, // Wait for model to load if needed
          }
        }),
      }
    );

    console.log('📡 [Sentiment Analysis] Response status:', response.status);
    console.log('📡 [Sentiment Analysis] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [Sentiment Analysis] API error response:', errorText);
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ [Sentiment Analysis] Raw API response:', JSON.stringify(result, null, 2));

    // The model returns labels like 'positive', 'negative', 'neutral'
    // Response format: [[{label: "positive", score: 0.99}, {label: "negative", score: 0.01}]]
    if (result && Array.isArray(result) && result[0] && Array.isArray(result[0])) {
      const topResult = result[0][0];
      const label = topResult.label.toLowerCase();
      console.log('🏷️  [Sentiment Analysis] Detected label:', label, 'Score:', topResult.score);

      // Map model labels to our sentiment enum
      let sentiment;
      if (label.includes('positive') || label.includes('pos')) {
        sentiment = 'positive';
      } else if (label.includes('negative') || label.includes('neg')) {
        sentiment = 'negative';
      } else {
        sentiment = 'neutral';
      }
      
      console.log('✨ [Sentiment Analysis] Final sentiment:', sentiment);
      return sentiment;
    }

    console.log('⚠️  [Sentiment Analysis] No result from API, defaulting to neutral');
    return 'neutral';
  } catch (error) {
    console.error('❌ [Sentiment Analysis ERROR] Full error details:');
    console.error('   - Error name:', error.name);
    console.error('   - Error message:', error.message);
    console.error('   - Error stack:', error.stack);
    // Return neutral as fallback if API fails
    console.log('🔄 [Sentiment Analysis] Returning neutral as fallback');
    return 'neutral';
  }
};

/**
 * Retry sentiment analysis with exponential backoff
 * @param {string} text - The text to analyze
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise<string>} - Sentiment label
 */
export const analyzeSentimentWithRetry = async (text, maxRetries = 3) => {
  let lastError;

  console.log(`🔄 [Sentiment Retry] Starting sentiment analysis with ${maxRetries} max retries`);
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`🔄 [Sentiment Retry] Attempt ${i + 1}/${maxRetries}`);
      const sentiment = await analyzeSentiment(text);
      if (sentiment && sentiment !== 'pending') {
        console.log(`✅ [Sentiment Retry] Success on attempt ${i + 1}: ${sentiment}`);
        return sentiment;
      }
      console.log(`⚠️  [Sentiment Retry] Got 'pending' or empty result on attempt ${i + 1}`);
    } catch (error) {
      lastError = error;
      console.error(`❌ [Sentiment Retry] Attempt ${i + 1} failed:`, error.message);
      // Exponential backoff: wait 1s, 2s, 4s
      const waitTime = Math.pow(2, i) * 1000;
      if (i < maxRetries - 1) {
        console.log(`⏳ [Sentiment Retry] Waiting ${waitTime}ms before retry ${i + 2}...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  console.error(`❌ [Sentiment Retry] Failed to analyze sentiment after ${maxRetries} retries`);
  console.error(`❌ [Sentiment Retry] Last error:`, lastError);
  console.log('🔄 [Sentiment Retry] Returning neutral as final fallback');
  return 'neutral';
};
