import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const vendorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    stallName: {
      type: String,
      required: [true, 'Stall name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    openingHours: {
      type: String,
      default: '09:00',
    },
    closingHours: {
      type: String,
      default: '17:00',
    },
    reviewSummary: {
      positive: {
        type: Number,
        default: 0,
      },
      neutral: {
        type: Number,
        default: 0,
      },
      negative: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
vendorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
vendorSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;
