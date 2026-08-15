const Trip = require("../models/Trip");
const FavoriteTrip = require("../models/FavoriteTrip");

// @desc    Get all trips for logged-in user
// @route   GET /api/trips
const getAllTrips = async (req, res) => {
  try {
    const { search, favorite, status } = req.query;

    const conditions = { userId: req.user._id };

    if (search) {
      conditions.destination = { $regex: search, $options: "i" };
    }

    if (favorite === "true") {
      conditions.isFavorite = true;
    }

    if (status) {
      conditions.status = status;
    }

    const trips = await Trip.find(conditions).sort({ createdAt: -1 });
    return res.status(200).json({ trips });
  } catch (error) {
    console.error("GET Trips Error:", error);
    return res.status(500).json({ error: "Failed to fetch trips." });
  }
};

// @desc    Save a new trip
// @route   POST /api/trips
const createTrip = async (req, res) => {
  try {
    const {
      title,
      destination,
      country,
      coordinates,
      startDate,
      endDate,
      durationDays,
      travelersCount,
      travelersType,
      budgetTier,
      totalBudgetUSD,
      interests,
      accommodationPref,
      transportPref,
      itinerary,
      hotels,
      restaurants,
      attractions,
      costBreakdown,
      travelTips,
      summary,
    } = req.body;

    if (!destination || !itinerary || !costBreakdown) {
      return res.status(400).json({
        error: "Destination, itinerary, and cost breakdown are required to save a trip.",
      });
    }

    const tripTitle = title || `${durationDays || 3}-Day Trip to ${destination}`;

    const newTrip = await Trip.create({
      userId: req.user._id,
      title: tripTitle,
      destination,
      country: country || "Global",
      coordinates: coordinates || { lat: 48.8566, lng: 2.3522 },
      startDate: startDate || null,
      endDate: endDate || null,
      durationDays: durationDays || 3,
      travelersCount: travelersCount || 1,
      travelersType: travelersType || "Solo",
      budgetTier: budgetTier || "Moderate",
      totalBudgetUSD: totalBudgetUSD || costBreakdown.grandTotalUSD || 0,
      interests: Array.isArray(interests) ? interests : [],
      accommodationPref: accommodationPref || "Moderate Hotel",
      transportPref: transportPref || "Public Transport",
      itinerary,
      hotels: hotels || [],
      restaurants: restaurants || [],
      attractions: attractions || [],
      costBreakdown,
      travelTips: travelTips || null,
      summary: summary || "",
      isFavorite: false,
      status: "planned",
    });

    return res.status(201).json({
      message: "Trip saved successfully!",
      trip: newTrip,
    });
  } catch (error) {
    console.error("POST Trip Error:", error);
    return res.status(500).json({ error: "Failed to save trip." });
  }
};

// @desc    Get single trip details
// @route   GET /api/trips/:id
const getSingleTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({ error: "Trip not found." });
    }

    return res.status(200).json({ trip });
  } catch (error) {
    console.error("GET Single Trip Error:", error);
    return res.status(500).json({ error: "Failed to fetch trip." });
  }
};

// @desc    Update single trip
// @route   PUT /api/trips/:id
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({ error: "Trip not found." });
    }

    const fieldsToUpdate = [
      "title",
      "startDate",
      "endDate",
      "isFavorite",
      "status",
      "itinerary",
      "hotels",
      "restaurants",
      "attractions",
      "costBreakdown",
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        trip[field] = req.body[field];
      }
    });

    await trip.save();

    // Sync FavoriteTrip collection if isFavorite changes
    if (req.body.isFavorite !== undefined) {
      if (req.body.isFavorite) {
        await FavoriteTrip.findOneAndUpdate(
          { userId: req.user._id, tripId: trip._id },
          { userId: req.user._id, tripId: trip._id },
          { upsert: true }
        );
      } else {
        await FavoriteTrip.findOneAndDelete({
          userId: req.user._id,
          tripId: trip._id,
        });
      }
    }

    return res.status(200).json({
      message: "Trip updated successfully!",
      trip,
    });
  } catch (error) {
    console.error("PUT Trip Error:", error);
    return res.status(500).json({ error: "Failed to update trip." });
  }
};

// @desc    Delete single trip
// @route   DELETE /api/trips/:id
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({ error: "Trip not found or unauthorized." });
    }

    // Remove from FavoriteTrip collection too if exists
    await FavoriteTrip.findOneAndDelete({
      userId: req.user._id,
      tripId: req.params.id,
    });

    return res.status(200).json({ message: "Trip deleted successfully!" });
  } catch (error) {
    console.error("DELETE Trip Error:", error);
    return res.status(500).json({ error: "Failed to delete trip." });
  }
};

// @desc    Duplicate a trip
// @route   POST /api/trips/:id/duplicate
const duplicateTrip = async (req, res) => {
  try {
    const existing = await Trip.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!existing) {
      return res.status(404).json({ error: "Original trip not found." });
    }

    const duplicatedTrip = await Trip.create({
      userId: req.user._id,
      title: `${existing.title} (Copy)`,
      destination: existing.destination,
      country: existing.country,
      coordinates: existing.coordinates,
      startDate: existing.startDate,
      endDate: existing.endDate,
      durationDays: existing.durationDays,
      travelersCount: existing.travelersCount,
      travelersType: existing.travelersType,
      budgetTier: existing.budgetTier,
      totalBudgetUSD: existing.totalBudgetUSD,
      interests: existing.interests,
      accommodationPref: existing.accommodationPref,
      transportPref: existing.transportPref,
      itinerary: existing.itinerary,
      hotels: existing.hotels,
      restaurants: existing.restaurants,
      attractions: existing.attractions,
      costBreakdown: existing.costBreakdown,
      travelTips: existing.travelTips,
      summary: existing.summary,
      isFavorite: false,
      status: "planned",
    });

    return res.status(201).json({
      message: "Trip duplicated successfully!",
      trip: duplicatedTrip,
    });
  } catch (error) {
    console.error("Duplicate Trip Error:", error);
    return res.status(500).json({ error: "Failed to duplicate trip." });
  }
};

module.exports = {
  getAllTrips,
  createTrip,
  getSingleTrip,
  updateTrip,
  deleteTrip,
  duplicateTrip,
};
