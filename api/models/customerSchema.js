import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  createDate: {
    type: Date,
    required: true,
  },
  branch: {
    type: String,
    trim: true,
  },
  area: {
    type: String,
    trim: true,
  },
  zone: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  creditLimit: {
    type: Number,
    default: 0,
  },
  customerCode: {
    type: String,
    trim: true,
  },
  phone1: {
    type: String,
    required: true,
    trim: true,
  },
  phone2: {
    type: String,
    trim: true,
  },
  birthDate: {
    type: Date,
  },
  website: {
    type: String,
    trim: true,
  },
  billingAddress: {
    type: String,
    trim: true,
  },
  deliveryAddress: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  zipCode: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  salesPerson: {
    type: String,
    trim: true,
  },
  customerType: {
    type: String,
    enum: ['Wholesale', 'Retail'],
    default: 'Wholesale',
  },
  remarks: {
    type: String,
    trim: true,
  },
  openBalanceData: [
    {
      company: {
        type: String,
        trim: true,
      },
      balanceType: {
        type: String,
        enum: ['DR', 'CR'],
      },
      amount: {
        type: Number,
        default: 0,
      },
    },
  ],
  contactname: {
    type: String,
    trim: true,
  },
  contactphone: {
    type: String,
    trim: true,
  },
  contactmobile: {
    type: String,
    trim: true,
  },
  contactemail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  parentAccHead: {
    type: String,
    enum: ['accountReceiveable', 'accountPayable', ''],
    default: '',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Add pre-save middleware to handle date conversions
customerSchema.pre('save', function(next) {
  if (this.createDate && typeof this.createDate === 'string') {
    this.createDate = new Date(this.createDate);
  }
  if (this.birthDate && typeof this.birthDate === 'string') {
    this.birthDate = new Date(this.birthDate);
  }
  next();
});

export const Customer = mongoose.model('Customer', customerSchema);