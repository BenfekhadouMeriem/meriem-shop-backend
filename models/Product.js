import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    purchasePrice: {
        type: Number, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    offerPrice: { 
        type: Number,
         default: 0 
        },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    variants: {
    type: [
      {
        color: { type: String },
        size: { type: String },
        stock: { type: Number, required: true },
      }
    ],
        default: [], 
    },
    images: [
    {
      public_id: String,
      url: String,
      _id: false 
    },
  ],
    featured: { 
        type: Boolean,
        default: false
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    createdAt: {
        type: Date, 
        default: Date.now 
    }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
