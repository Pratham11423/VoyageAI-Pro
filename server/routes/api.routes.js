const express = require("express");
const { generateAITrip } = require("../services/ai.service");
const { geocodeDestination, searchPlaces } = require("../services/maps.service");
const { protect } = require("../middleware/auth");

const router = express.Router();

// AI generation route
router.post("/ai/generate-trip", async (req, res) => {
  try {
    const { destination, budgetTier, durationDays, travelersCount, travelersType, startDate, endDate, interests, accommodationPref, transportPref } = req.body;

    if (!destination) {
      return res.status(400).json({ error: "Destination is required." });
    }

    const tripData = await generateAITrip({
      destination,
      budgetTier: budgetTier || "Moderate",
      durationDays: parseInt(durationDays, 10) || 3,
      travelersCount: parseInt(travelersCount, 10) || 1,
      travelersType: travelersType || "Solo",
      startDate,
      endDate,
      interests: interests || [],
      accommodationPref: accommodationPref || "Boutique Hotel",
      transportPref: transportPref || "Public Transport",
    });

    return res.status(200).json({ tripData });
  } catch (error) {
    console.error("AI Generation Endpoint Error:", error);
    return res.status(500).json({ error: "Failed to generate AI travel plan." });
  }
});

// Maps Search Endpoint
router.get("/maps/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(200).json({ results: [] });
    }

    const suggestions = await searchPlaces(query);
    if (suggestions.length > 0) {
      return res.status(200).json({ results: suggestions });
    }

    const geo = await geocodeDestination(query);
    return res.status(200).json({
      results: [
        {
          description: `${geo.name}, ${geo.country}`,
          placeId: "custom-geo",
          lat: geo.lat,
          lng: geo.lng,
        },
      ],
    });
  } catch (error) {
    console.error("Maps Search Endpoint Error:", error);
    return res.status(200).json({ results: [] });
  }
});

// Maps Hotels Endpoint
router.get("/maps/hotels", async (req, res) => {
  try {
    const destination = req.query.destination || "Paris";
    const budgetTier = req.query.budgetTier || "Moderate";
    const geo = await geocodeDestination(destination);

    const hotels = [
      {
        name: `Grand Palace ${geo.name}`,
        rating: 4.8,
        priceRange: budgetTier === "Luxury" ? "$350 - $600" : "$120 - $220",
        address: `100 Central Boulevard, ${geo.name}`,
        coordinates: { lat: geo.lat + 0.003, lng: geo.lng - 0.002 },
        amenities: ["Spa", "Pool", "Free Wi-Fi", "Breakfast Included"],
        googleMapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Grand Palace Hotel ${geo.name}`)}`,
      },
      {
        name: `${geo.name} Boutique Suites`,
        rating: 4.6,
        priceRange: "$90 - $160",
        address: `22 Artisan Alley, ${geo.name}`,
        coordinates: { lat: geo.lat - 0.004, lng: geo.lng + 0.003 },
        amenities: ["Boutique Bar", "Central Location", "Free High-Speed Wi-Fi"],
        googleMapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Boutique Suites ${geo.name}`)}`,
      },
    ];

    return res.status(200).json({ destination: geo.name, hotels });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

// Maps Restaurants Endpoint
router.get("/maps/restaurants", async (req, res) => {
  try {
    const destination = req.query.destination || "Paris";
    const geo = await geocodeDestination(destination);

    const restaurants = [
      {
        name: `La Table de ${geo.name}`,
        cuisine: "French Bistro",
        rating: 4.7,
        priceLevel: "$$$",
        address: `10 Bistro Lane, ${geo.name}`,
        coordinates: { lat: geo.lat + 0.002, lng: geo.lng + 0.002 },
        googleMapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`La Table de ${geo.name}`)}`,
      },
    ];

    return res.status(200).json({ destination: geo.name, restaurants });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch restaurants." });
  }
});

// Maps Places Endpoint
router.get("/maps/places", async (req, res) => {
  try {
    const destination = req.query.destination || "Paris";
    const geo = await geocodeDestination(destination);

    const places = [
      {
        name: `Historic Landmark of ${geo.name}`,
        category: "Historical Site",
        rating: 4.8,
        reviewsCount: 2340,
        address: `1 Main Square, ${geo.name}`,
        coordinates: { lat: geo.lat + 0.005, lng: geo.lng + 0.005 },
        googleMapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${geo.name} Landmark`)}`,
        openingHours: "09:00 AM - 06:00 PM",
      },
    ];

    return res.status(200).json({
      destination: geo.name,
      country: geo.country,
      coordinates: { lat: geo.lat, lng: geo.lng },
      places,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch places." });
  }
});

module.exports = router;
