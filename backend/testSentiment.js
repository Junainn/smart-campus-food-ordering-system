import dotenv from 'dotenv';
import { analyzeSentiment } from './utils/sentimentAnalysis.js';

dotenv.config();

const testReviews = [
  "This food is absolutely amazing and delicious!",
  "Terrible experience, food was cold and tasteless",
  "It's okay, nothing special",
  "best one so far",
  "খুব ভালো খাবার!", // Very good food in Bangla
  "kharap quality" // Bad quality in Bangla
];

console.log('🧪 Testing Sentiment Analysis\n');
console.log('='.repeat(60));

(async () => {
  for (const review of testReviews) {
    console.log('\n📝 Review:', review);
    const sentiment = await analyzeSentiment(review);
    console.log('🎯 Final Sentiment:', sentiment.toUpperCase());
    console.log('-'.repeat(60));
  }
  
  console.log('\n✅ Testing completed!');
  process.exit(0);
})();
