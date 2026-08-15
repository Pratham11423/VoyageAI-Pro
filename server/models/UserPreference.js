const mongoose = require("mongoose");

const UserPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    defaultCurrency: {
      type: String,
      default: "USD",
    },
    preferredInterests: {
      type: [String],
      default: [],
    },
    pacePreference: {
      type: String,
      default: "moderate",
      enum: ["relaxed", "moderate", "fast-paced"],
    },
    dietaryRestrictions: {
      type: [String],
      default: [],
    },
    accommodationStyle: {
      type: String,
      default: "Moderate Hotel",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserPreference", UserPreferenceSchema);
