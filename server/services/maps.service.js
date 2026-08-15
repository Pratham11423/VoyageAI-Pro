// Google Maps Platform API integration with resilient OpenStreetMap fallback

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const POPULAR_DESTINATIONS = {
  "paris": { lat: 48.8566, lng: 2.3522, country: "France", summary: "The City of Light, famous for romance, art, cuisine, and world-renowned fashion." },
  "tokyo": { lat: 35.6762, lng: 139.6503, country: "Japan", summary: "Ultra-modern metropolis blending futuristic skyscrapers with historic temples and exquisite cuisine." },
  "new york": { lat: 40.7128, lng: -74.0060, country: "United States", summary: "The Big Apple, featuring Broadway theaters, Central Park, iconic museums, and skyline views." },
  "rome": { lat: 41.9028, lng: 12.4964, country: "Italy", summary: "The Eternal City filled with ancient Roman monuments, Renaissance art, and irresistible gelato." },
  "bali": { lat: -8.4095, lng: 115.1889, country: "Indonesia", summary: "Tropical paradise with lush rice terraces, sacred temples, volcanic mountains, and vibrant beaches." },
  "london": { lat: 51.5074, lng: -0.1278, country: "United Kingdom", summary: "Historic world capital boasting royal palaces, world-class museums, and diverse neighborhoods." },
  "dubai": { lat: 25.2048, lng: 55.2708, country: "United Arab Emirates", summary: "Futuristic luxury oasis with record-breaking skyscrapers, desert safaris, and high-end shopping." },
  "barcelona": { lat: 41.3851, lng: 2.1734, country: "Spain", summary: "Mediterranean gem renowned for Gaudí architecture, sunny beaches, and tapas bars." },
  "sydney": { lat: -33.8688, lng: 151.2093, country: "Australia", summary: "Vibrant harbor city featuring the Opera House, Bondi Beach, and stunning coastal walks." },
  "kyoto": { lat: 35.0116, lng: 135.7681, country: "Japan", summary: "Cultural heart of Japan with thousands of classical Buddhist temples, gardens, and geisha districts." },
  "cape town": { lat: -33.9249, lng: 18.4241, country: "South Africa", summary: "Coastal paradise with Table Mountain, vineyard valleys, and wild ocean scenery." },
  "bangkok": { lat: 13.7563, lng: 100.5018, country: "Thailand", summary: "Bustling capital known for ornate shrines, energetic street life, and famous night markets." },
  "zurich": { lat: 47.3769, lng: 8.5417, country: "Switzerland", summary: "Picturesque Swiss city on Lake Zurich with alpine panoramas and historic luxury." },
};

async function geocodeDestination(query) {
  const normalizedQuery = query.toLowerCase().trim();

  for (const [key, data] of Object.entries(POPULAR_DESTINATIONS)) {
    if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
      return {
        name: query.charAt(0).toUpperCase() + query.slice(1),
        country: data.country,
        lat: data.lat,
        lng: data.lng,
        description: data.summary,
      };
    }
  }

  if (GOOGLE_MAPS_API_KEY) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "OK" && data.results.length > 0) {
        const first = data.results[0];
        const location = first.geometry.location;
        const countryComp = first.address_components?.find((c) => c.types.includes("country"));
        return {
          name: first.formatted_address,
          country: countryComp ? countryComp.long_name : "Global",
          lat: location.lat,
          lng: location.lng,
          description: `Exploration journey to ${first.formatted_address}`,
        };
      }
    } catch (e) {
      console.warn("Google Geocoding API request failed, falling back to Nominatim", e);
    }
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=en`;
    const res = await fetch(url, { headers: { "User-Agent": "AITravelPlanner/1.0" } });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const item = data[0];
      return {
        name: item.display_name.split(",")[0] || query,
        country: item.display_name.split(",").slice(-1)[0]?.trim() || "Global",
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        description: `Explore the sights, culture, and cuisine of ${query}`,
      };
    }
  } catch (err) {
    console.warn("Nominatim search failed", err);
  }

  // Final hard fallback
  return {
    name: query,
    country: "Global",
    lat: 48.8566,
    lng: 2.3522,
    description: `Trip to ${query}`,
  };
}

// Search autocomplete suggestions
async function searchPlaces(query) {
  // If no Google API key, fall back to OSM Nominatim autocomplete
  if (GOOGLE_MAPS_API_KEY) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=(regions)&key=${GOOGLE_MAPS_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "OK") {
        return data.predictions.map((p) => ({
          description: p.description,
          place_id: p.place_id,
        }));
      }
    } catch (e) {
      console.warn("Places autocomplete failed", e);
    }
  }

  // Fallback to OSM Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=en`;
    const res = await fetch(url, { headers: { "User-Agent": "AITravelPlanner/1.0" } });
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((item) => ({
        description: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }));
    }
  } catch (err) {
    console.warn("OSM autocomplete failed", err);
  }

  return [];
}

module.exports = {
  geocodeDestination,
  searchPlaces,
};
