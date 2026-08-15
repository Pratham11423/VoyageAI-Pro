const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    country: {
      type: String,
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    travelersCount: {
      type: Number,
      default: 1,
    },
    travelersType: {
      type: String,
      default: "Solo",
    },
    budgetTier: {
      type: String,
      required: true,
    },
    totalBudgetUSD: {
      type: Number,
    },
    interests: {
      type: [String],
      default: [],
    },
    accommodationPref: {
      type: String,
    },
    transportPref: {
      type: String,
    },
    itinerary: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    hotels: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    restaurants: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    attractions: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    costBreakdown: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    travelTips: {
      type: mongoose.Schema.Types.Mixed,
    },
    summary: {
      type: String,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "planned",
      enum: ["planned", "completed", "cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual property for virtual id (compatibility with frontend expecting `id` instead of `_id`)
TripSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

TripSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Trip", TripSchema);
