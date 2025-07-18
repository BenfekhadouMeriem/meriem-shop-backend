import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  logo: {
    url: { type: String, required: true },
  },
  banner: {
    url: { type: String },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    street: { type: String },
    postalCode: { type: String },
    country: { type: String, required: true },
  },
  contact: {
    email: { type: String },
    phone: { type: String },
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
}, {
  timestamps: true,
});

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;
