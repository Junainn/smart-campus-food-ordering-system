import mongoose from 'mongoose';
import Review from './models/Review.js';

mongoose.connect('mongodb://localhost:27017/food-delivery')
  .then(async () => {
    console.log('Connected to database');
    
    const reviews = await Review.find()
      .populate('studentId', 'name')
      .populate('vendorId', 'stallName')
      .limit(5)
      .sort('-createdAt');
    
    console.log(`\nTotal reviews found: ${reviews.length}\n`);
    
    reviews.forEach((r, idx) => {
      console.log(`${idx + 1}. ${r.vendorId?.stallName || 'Unknown Vendor'}`);
      console.log(`   Student: ${r.studentId?.name || 'Unknown'}`);
      console.log(`   Comment: "${r.comment}"`);
      console.log(`   Sentiment: ${r.sentiment}`);
      console.log(`   Rating: ${r.rating}/5`);
      console.log('');
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
