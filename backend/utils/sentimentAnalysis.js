import { HfInference } from '@huggingface/inference';

/**
 * Analyze sentiment using HuggingFace AI model
 * @param {string} text - The text to analyze
 * @returns {Promise<string>} - Sentiment label: 'positive', 'negative', or 'neutral'
 */
const analyzeWithHuggingFace = async (text) => {
  const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  
  console.log('🤖 [HuggingFace] Analyzing with AI model...');
  
  // Use multilingual model - better for Bangla/English mix
  const result = await hf.textClassification({
    model: 'cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual',
    inputs: text,
  });
  
  console.log('🤖 [HuggingFace] API Response:', JSON.stringify(result));
  
  // Result format: [{ label: 'positive', score: 0.98 }, ...]
  const topResult = result[0];
  const label = topResult.label.toLowerCase();
  
  // Map label to our format
  let sentiment;
  if (label.includes('positive') || label.includes('pos')) {
    sentiment = 'positive';
  } else if (label.includes('negative') || label.includes('neg')) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }
  
  console.log(`✅ [HuggingFace] Result: ${sentiment} (confidence: ${(topResult.score * 100).toFixed(1)}%)`);
  return sentiment;
};

/**
 * Analyze sentiment using keyword-based analysis (fallback method)
 * @param {string} text - The text to analyze
 * @returns {string} - Sentiment label: 'positive', 'negative', or 'neutral'
 */
const analyzeWithKeywords = (text) => {
  console.log('🔍 [Keywords] Using keyword-based fallback analysis...');
  
  const lowerText = text.toLowerCase();
  
  // Positive keywords (English + Bangla romanized)
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'awesome', 'best', 'love', 'loved',
    'wonderful', 'fantastic', 'perfect', 'delicious', 'tasty', 'yummy', 'fresh',
    'nice', 'super', 'outstanding', 'brilliant', 'incredible', 'fabulous',
    'bhalo', 'darun', 'sundor', 'mishti', 'valo', 'khub bhalo', 'moja', 'shundor'
  ];
  
  // Negative keywords (English + Bangla romanized)
  const negativeWords = [
    'bad', 'terrible', 'horrible', 'awful', 'worst', 'hate', 'hated', 'disgusting',
    'poor', 'nasty', 'gross', 'disappointing', 'pathetic', 'rubbish', 'useless',
    'cold', 'stale', 'burnt', 'undercooked', 'overcooked', 'bland', 'tasteless',
    'kharap', 'baje', 'bekar', 'gandu', 'nongra', 'bekar'
  ];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  // Count positive words
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) {
      positiveCount++;
    }
  });
  
  // Count negative words
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) {
      negativeCount++;
    }
  });
  
  // Also check rating emojis
  if (lowerText.includes('👍') || lowerText.includes('😊') || lowerText.includes('❤️')) {
    positiveCount += 2;
  }
  if (lowerText.includes('👎') || lowerText.includes('😞') || lowerText.includes('😠')) {
    negativeCount += 2;
  }
  
  let sentiment;
  if (positiveCount > negativeCount) {
    sentiment = 'positive';
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }
  
  console.log('🏷️  [Keywords] Positive words found:', positiveCount);
  console.log('🏷️  [Keywords] Negative words found:', negativeCount);
  console.log('✨ [Keywords] Result:', sentiment);
  
  return sentiment;
};

/**
 * Main sentiment analysis function with HuggingFace + fallback
 * Tries HuggingFace AI first, falls back to keywords if it fails
 * @param {string} text - The text to analyze
 * @returns {Promise<string>} - Sentiment label: 'positive', 'negative', or 'neutral'
 */
export const analyzeSentiment = async (text) => {
  try {
    console.log('🔍 [Sentiment Analysis] Starting analysis for text:', text.substring(0, 50) + '...');
    
    // Try HuggingFace AI first
    try {
      const sentiment = await analyzeWithHuggingFace(text);
      return sentiment;
    } catch (hfError) {
      console.warn('⚠️  [Sentiment Analysis] HuggingFace failed:', hfError.message);
      console.log('🔄 [Sentiment Analysis] Switching to keyword-based fallback...');
      
      // Fallback to keyword analysis
      const sentiment = analyzeWithKeywords(text);
      return sentiment;
    }
  } catch (error) {
    console.error('❌ [Sentiment Analysis ERROR]:', error.message);
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
