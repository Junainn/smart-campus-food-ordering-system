import dotenv from 'dotenv';
import { analyzeSentiment } from './utils/sentimentAnalysis.js';

dotenv.config();

console.log('⏱️  Testing HuggingFace Response Time\n');

const testReview = "This food is absolutely amazing and delicious!";

const testWithTiming = async () => {
  console.log('Testing:', testReview);
  console.log('Starting timer...\n');
  
  const startTime = Date.now();
  
  const sentiment = await analyzeSentiment(testReview);
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  console.log('\n' + '='.repeat(60));
  console.log(`⏱️  Total Time: ${duration}ms (${(duration / 1000).toFixed(2)}s)`);
  console.log(`🎯 Result: ${sentiment.toUpperCase()}`);
  console.log('='.repeat(60));
  
  if (duration > 3000) {
    console.log('\n⚠️  WARNING: Response time > 3 seconds');
    console.log('💡 This will make users wait too long!');
  } else if (duration > 1000) {
    console.log('\n⚠️  NOTICE: Response time > 1 second');
    console.log('💡 Consider async processing for better UX');
  } else {
    console.log('\n✅ Response time is acceptable!');
  }
  
  process.exit(0);
};

testWithTiming();
