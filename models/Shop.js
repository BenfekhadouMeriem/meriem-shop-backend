import mongoose from "mongoose";
import validator from "validator";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a shop name"],
      unique: true,
      trim: true,
      maxlength: [100, "Shop name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
    },
    logo: {
      public_id: { type: String },
      url: { type: String, required: [true, "Please provide a logo URL"] },
    },
    banner: {
      public_id: { type: String },
      url: { type: String },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please specify an owner"],
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true, required: [true, "Please provide a city"] },
      state: { type: String, trim: true, required: [true, "Please provide a state"] },
      postalCode: { type: String, trim: true },
      country: { type: String, default: "Algeria", trim: true },
    },
    contact: {
      email: {
        type: String,
        trim: true,
        validate: [validator.isEmail, "Please provide a valid email address"],
      },
      phone: { type: String, trim: true },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for product count
shopSchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "shop",
  count: true,
});

// Indexes
shopSchema.index({ name: "text", description: "text" });
shopSchema.index({ owner: 1 });

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;
