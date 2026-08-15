const { geocodeDestination } = require("./maps.service");

const SYSTEM_PROMPT = `You are a world-class AI Senior Travel Concierge and Master Itinerary Designer.
Your task is to generate a comprehensive, highly realistic, day-by-day travel plan tailored to the user's budget, destination, interests, party size, and travel style.

You MUST respond strictly with valid JSON only. No markdown formatting ticks like \`\`\`json, no preamble, no tailing explanations outside the JSON object.

Your JSON output structure MUST follow this exact schema:
{
  "title": string,
  "summary": string,
  "destination": string,
  "country": string,
  "coordinates": { "lat": number, "lng": number },
  "itinerary": [
    {
      "day": number,
      "date": string,
      "title": string,
      "summary": string,
      "schedule": [
        {
          "time": string,
          "activity": string,
          "location": string,
          "description": string,
          "category": "attraction" | "food" | "hotel" | "transit" | "leisure",
          "estimatedCostUSD": number,
          "coordinates": { "lat": number, "lng": number },
          "mapUrl": string,
          "durationHours": number
        }
      ],
      "dailyEstimatedCostUSD": number,
      "insiderTip": string
    }
  ],
  "hotels": [
    {
      "name": string,
      "rating": number,
      "reviewsCount": number,
      "priceRangeUSD": string,
      "address": string,
      "amenities": string[],
      "coordinates": { "lat": number, "lng": number },
      "googleMapsUrl": string,
      "photoUrl": string,
      "matchReason": string
    }
  ],
  "restaurants": [
    {
      "name": string,
      "cuisine": string,
      "rating": number,
      "priceLevel": string,
      "address": string,
      "coordinates": { "lat": number, "lng": number },
      "googleMapsUrl": string,
      "signatureDish": string
    }
  ],
  "attractions": [
    {
      "name": string,
      "category": string,
      "rating": number,
      "address": string,
      "coordinates": { "lat": number, "lng": number },
      "openingHours": string,
      "admissionFeeUSD": number,
      "googleMapsUrl": string,
      "recommendedDuration": string
    }
  ],
  "costBreakdown": {
    "accommodationTotal": number,
    "foodTotal": number,
    "transportTotal": number,
    "attractionsTotal": number,
    "miscellaneousTotal": number,
    "grandTotalUSD": number,
    "perPersonUSD": number
  },
  "travelTips": {
    "weatherSummary": string,
    "bestTimeToVisit": string,
    "localEtiquette": string[],
    "packingEssentials": string[],
    "currencyAndTipping": string,
    "safetyAdvice": string
  }
}

Guidelines for generating content:
1. Ensure the budget limits match the user budget tier ("Budget", "Moderate", "Luxury", "Ultra-Luxury").
2. Ensure realistic timing between activities (morning, mid-day, afternoon, evening, dinner).
3. Recommend 3 to 5 distinct hotels matching accommodation preferences.
4. Recommend 4 to 6 authentic local restaurants matching user food tastes.
5. Provide top attractions with real addresses or accurate relative geographical locations.
6. Provide coordinates (lat, lng) close to the target destination.
7. Include helpful travel tips (packing, safety, etiquette).
`;

async function generateAITrip(params) {
  const mistralKey = process.env.MISTRAL_API_KEY;
  console.log("[AI Service] starting generateAITrip for:", params.destination);
  
  console.log("[AI Service] calling geocodeDestination...");
  const destinationInfo = await geocodeDestination(params.destination);
  console.log("[AI Service] geocoding result:", destinationInfo);

  const userPrompt = `
Generate a ${params.durationDays}-day travel itinerary for ${params.destination} (${destinationInfo.country}).
- Target Destination Lat/Lng: (${destinationInfo.lat}, ${destinationInfo.lng})
- Budget Level: ${params.budgetTier}
- Number of Travelers: ${params.travelersCount} (${params.travelersType})
- Travel Dates: ${params.startDate || "Flexible"} to ${params.endDate || "Flexible"}
- Selected Interests: ${params.interests && params.interests.length > 0 ? params.interests.join(", ") : "General Sightseeing & Local Culture"}
- Accommodation Preference: ${params.accommodationPref}
- Transportation Mode: ${params.transportPref}

Ensure the schedule covers all ${params.durationDays} days with 4-5 activities per day including meals and sights.
Return ONLY valid JSON matching the exact system prompt schema.
`;

  // 1. Try Mistral if API key is provided
  if (mistralKey) {
    console.log("[AI Service] MISTRAL_API_KEY found. Preparing fetch to Mistral AI...");
    
    // Create an AbortController for a 12-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${mistralKey}`
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log("[AI Service] Mistral response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        console.log("[AI Service] Mistral response content length:", text?.length);
        if (text) {
          const parsed = JSON.parse(text);
          if (!parsed.coordinates || !parsed.coordinates.lat) {
            parsed.coordinates = { lat: destinationInfo.lat, lng: destinationInfo.lng };
          }
          return parsed;
        }
      } else {
        const errText = await response.text();
        console.warn(`[AI Service] Mistral API request failed with status ${response.status}: ${errText}`);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        console.warn("[AI Service] Mistral API request timed out after 12 seconds. Falling back.");
      } else {
        console.warn("[AI Service] Mistral API call failed, falling back to heuristic generator", err);
      }
    }
  } else {
    console.warn("[AI Service] MISTRAL_API_KEY is not set. Using heuristic generator.");
  }

  // Heuristic Smart Generator Fallback
  return generateFallbackTrip(params, destinationInfo);

}

function generateFallbackTrip(params, geo) {
  const days = Math.min(Math.max(params.durationDays || 3, 1), 14);
  const destName = geo.name || params.destination;
  const baseLat = geo.lat;
  const baseLng = geo.lng;

  let dailyHotelCost = 120;
  let dailyFoodCost = 60;
  let dailyTransportCost = 25;
  let dailyAttractionCost = 35;
  let dailyMiscCost = 20;

  if (params.budgetTier === "Budget") {
    dailyHotelCost = 45;
    dailyFoodCost = 30;
    dailyTransportCost = 12;
    dailyAttractionCost = 15;
    dailyMiscCost = 10;
  } else if (params.budgetTier === "Luxury") {
    dailyHotelCost = 350;
    dailyFoodCost = 150;
    dailyTransportCost = 80;
    dailyAttractionCost = 90;
    dailyMiscCost = 50;
  } else if (params.budgetTier === "Ultra-Luxury") {
    dailyHotelCost = 750;
    dailyFoodCost = 300;
    dailyTransportCost = 180;
    dailyAttractionCost = 200;
    dailyMiscCost = 100;
  }

  const accommodationTotal = dailyHotelCost * days;
  const foodTotal = dailyFoodCost * days * (params.travelersCount || 1);
  const transportTotal = dailyTransportCost * days * (params.travelersCount || 1);
  const attractionsTotal = dailyAttractionCost * days * (params.travelersCount || 1);
  const miscellaneousTotal = dailyMiscCost * days * (params.travelersCount || 1);
  const grandTotalUSD = accommodationTotal + foodTotal + transportTotal + attractionsTotal + miscellaneousTotal;
  const perPersonUSD = Math.round(grandTotalUSD / (params.travelersCount || 1));

  const interestsList = params.interests && params.interests.length > 0 ? params.interests : ["Culture", "Food", "Sightseeing"];

  const offsetCoord = (index, factor = 0.012) => ({
    lat: baseLat + Math.sin(index * 1.5) * factor,
    lng: baseLng + Math.cos(index * 1.5) * factor,
  });

  const itinerary = [];
  const sampleActivities = [
    { title: "Old Town & Landmark Walk", cat: "attraction", duration: 2.5, desc: "Explore historic architecture, scenic alleyways, and local heritage." },
    { title: "Famous Local Bistro & Tasting", cat: "food", duration: 1.5, desc: "Sample authentic regional dishes and local signature beverages." },
    { title: "Cultural Museum & Art Gallery", cat: "attraction", duration: 3.0, desc: "Immerse yourself in world-class masterpieces and regional artifacts." },
    { title: "Panoramic Lookout & Sunset Point", cat: "leisure", duration: 2.0, desc: "Capture breathless views of the city skyline and landscape." },
    { title: "Gourmet Dinner Experience", cat: "food", duration: 2.0, desc: "Savor fine cuisine crafted by award-winning local chefs." },
    { title: "Bustling Local Market & Shopping", cat: "attraction", duration: 2.5, desc: "Browse artisanal crafts, souvenirs, and street food stalls." },
    { title: "Scenic Garden & Nature Walk", cat: "leisure", duration: 2.0, desc: "Relax in peaceful surroundings away from urban hustle." },
  ];

  for (let d = 1; d <= days; d++) {
    const dayCoord1 = offsetCoord(d * 1);
    const dayCoord2 = offsetCoord(d * 2);
    const dayCoord3 = offsetCoord(d * 3);

    const themeInterest = interestsList[(d - 1) % interestsList.length];

    itinerary.push({
      day: d,
      date: params.startDate ? new Date(new Date(params.startDate).getTime() + (d - 1) * 86400000).toISOString().split("T")[0] : `Day ${d}`,
      title: `Day ${d}: ${themeInterest} Highlights & ${destName} Gems`,
      summary: `Focus on ${themeInterest.toLowerCase()} with handpicked attractions, culinary hotspots, and iconic views across ${destName}.`,
      schedule: [
        {
          time: "08:30 AM",
          activity: "Morning Artisan Breakfast & Coffee",
          location: `Central ${destName} Café`,
          description: "Start your day with freshly brewed local coffee and regional breakfast pastries.",
          category: "food",
          estimatedCostUSD: Math.round(dailyFoodCost * 0.25),
          coordinates: dayCoord1,
          mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Cafe ${destName}`)}`,
          durationHours: 1,
        },
        {
          time: "10:00 AM",
          activity: sampleActivities[(d - 1) % sampleActivities.length].title,
          location: `${destName} Historic Quarter`,
          description: sampleActivities[(d - 1) % sampleActivities.length].desc,
          category: sampleActivities[(d - 1) % sampleActivities.length].cat,
          estimatedCostUSD: Math.round(dailyAttractionCost * 0.5),
          coordinates: dayCoord1,
          mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${sampleActivities[(d - 1) % sampleActivities.length].title} ${destName}`)}`,
          durationHours: sampleActivities[(d - 1) % sampleActivities.length].duration,
        },
        {
          time: "01:00 PM",
          activity: "Authentic Local Lunch Break",
          location: `${destName} Market District`,
          description: "Enjoy a hearty regional lunch in a top-rated local restaurant.",
          category: "food",
          estimatedCostUSD: Math.round(dailyFoodCost * 0.35),
          coordinates: dayCoord2,
          mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Lunch ${destName}`)}`,
          durationHours: 1.5,
        },
        {
          time: "03:00 PM",
          activity: sampleActivities[(d + 1) % sampleActivities.length].title,
          location: `${destName} Waterfront & Promenade`,
          description: sampleActivities[(d + 1) % sampleActivities.length].desc,
          category: sampleActivities[(d + 1) % sampleActivities.length].cat,
          estimatedCostUSD: Math.round(dailyAttractionCost * 0.5),
          coordinates: dayCoord2,
          mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${destName} Sights`)}`,
          durationHours: 2,
        },
        {
          time: "07:30 PM",
          activity: "Evening Culinary Dinner & Drinks",
          location: `${destName} Downtown Quarter`,
          description: "Relax after an inspiring day with signature local dishes and atmosphere.",
          category: "food",
          estimatedCostUSD: Math.round(dailyFoodCost * 0.4),
          coordinates: dayCoord3,
          mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Dinner ${destName}`)}`,
          durationHours: 2,
        },
      ],
      dailyEstimatedCostUSD: dailyFoodCost + dailyAttractionCost + dailyTransportCost,
      insiderTip: `Buy tickets online in advance to bypass morning queues in ${destName}. Use ${params.transportPref.toLowerCase()} for seamless navigation.`,
    });
  }

  const hotels = [
    {
      name: `Grand ${destName} Palace Hotel`,
      rating: 4.8,
      reviewsCount: 1420,
      priceRangeUSD: `$${dailyHotelCost - 20} - $${dailyHotelCost + 60} / night`,
      address: `100 Central Boulevard, ${destName}`,
      amenities: ["Free High-Speed Wi-Fi", "Infinity Pool", "Rooftop Lounge", "Spa & Wellness", "Buffet Breakfast"],
      coordinates: offsetCoord(1, 0.008),
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Grand Palace Hotel ${destName}`)}`,
      photoUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      matchReason: `Top-rated choice perfectly matching your ${params.budgetTier} budget and prime location preferences.`,
    },
    {
      name: `${destName} Heritage Boutique Suites`,
      rating: 4.6,
      reviewsCount: 890,
      priceRangeUSD: `$${dailyHotelCost - 30} - $${dailyHotelCost + 20} / night`,
      address: `45 Old Town Square, ${destName}`,
      amenities: ["Historic Architecture", "Artisan Breakfast", "Concierge Service", "Quiet Courtyard"],
      coordinates: offsetCoord(2, 0.01),
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Boutique Hotel ${destName}`)}`,
      photoUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      matchReason: "Charming boutique hotel located right in the walkable heart of the historic center.",
    },
    {
      name: `Urban Sky Resort & Spa ${destName}`,
      rating: 4.7,
      reviewsCount: 1150,
      priceRangeUSD: `$${dailyHotelCost + 10} - $${dailyHotelCost + 90} / night`,
      address: `88 Riverside Drive, ${destName}`,
      amenities: ["Panoramic Skyline Views", "Fitness Center", "Fine Dining Restaurant", "Airport Shuttle"],
      coordinates: offsetCoord(3, 0.015),
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Resort Spa ${destName}`)}`,
      photoUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      matchReason: "Modern luxury resort offering quiet relaxation and excellent public transit access.",
    },
  ];

  const restaurants = [
    {
      name: `La Table de ${destName}`,
      cuisine: "Regional & Modern Fusion",
      rating: 4.8,
      priceLevel: params.budgetTier === "Budget" ? "$$" : "$$$",
      address: `12 Gourmet Lane, ${destName}`,
      coordinates: offsetCoord(1, 0.009),
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`La Table ${destName}`)}`,
      signatureDish: "Chef's Signature Braised Delicacy with Organic Herbs",
    },
    {
      name: `Oasis Garden Bistro`,
      cuisine: "Farm-to-Table Fresh",
      rating: 4.7,
      priceLevel: "$$",
      address: `77 Parkside Avenue, ${destName}`,
      coordinates: offsetCoord(2, 0.011),
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Oasis Garden Bistro ${destName}`)}`,
      signatureDish: "Artisanal Wood-Fired Specialties & Fresh Local Salads",
    },
    {
      name: `The ${destName} Seafood & Grill`,
      cuisine: "Fresh Seafood & Steak",
      rating: 4.6,
      priceLevel: "$$$",
      address: `3 Maritime Wharf, ${destName}`,
      coordinates: offsetCoord(3, 0.014),
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Seafood Grill ${destName}`)}`,
      signatureDish: "Catch of the Day served with Garlic Butter Risotto",
    },
    {
      name: `Street Flavor Alley`,
      cuisine: "Authentic Local Street Food",
      rating: 4.9,
      priceLevel: "$",
      address: `5 Market Square, ${destName}`,
      coordinates: offsetCoord(4, 0.007),
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Street Food ${destName}`)}`,
      signatureDish: "Crispy Traditional Savory Dumplings & Spicy Noodles",
    },
  ];

  const attractions = [
    {
      name: `The National Landmark of ${destName}`,
      category: "Historic Monument",
      rating: 4.9,
      address: `1 Monument Plaza, ${destName}`,
      coordinates: offsetCoord(1, 0.005),
      openingHours: "09:00 AM - 06:00 PM Daily",
      admissionFeeUSD: 25,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Landmark ${destName}`)}`,
      recommendedDuration: "2 - 3 Hours",
    },
    {
      name: `${destName} Royal Botanical Gardens`,
      category: "Nature & Parks",
      rating: 4.8,
      address: `15 Greenery Way, ${destName}`,
      coordinates: offsetCoord(2, 0.012),
      openingHours: "08:00 AM - 07:00 PM Daily",
      admissionFeeUSD: 12,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Botanical Gardens ${destName}`)}`,
      recommendedDuration: "2 Hours",
    },
    {
      name: `${destName} Museum of Fine Arts`,
      category: "Art & Culture",
      rating: 4.7,
      address: `22 Cultural Boulevard, ${destName}`,
      coordinates: offsetCoord(3, 0.008),
      openingHours: "10:00 AM - 05:00 PM (Closed Mondays)",
      admissionFeeUSD: 20,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Fine Arts Museum ${destName}`)}`,
      recommendedDuration: "3 Hours",
    },
    {
      name: `Sunset Observation Tower & Skywalk`,
      category: "Sightseeing Lookout",
      rating: 4.8,
      address: `99 Skyline Height, ${destName}`,
      coordinates: offsetCoord(4, 0.016),
      openingHours: "10:00 AM - 10:00 PM Daily",
      admissionFeeUSD: 30,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Observation Tower ${destName}`)}`,
      recommendedDuration: "1.5 Hours",
    },
  ];

  return {
    title: `${params.durationDays}-Day Ultimate ${destName} Travel Experience`,
    summary: `A carefully tailored ${params.durationDays}-day itinerary for ${params.travelersCount} ${params.travelersType.toLowerCase()} traveler(s) exploring ${destName}. Custom designed around ${interestsList.join(", ")} with a ${params.budgetTier} budget profile.`,
    destination: destName,
    country: geo.country,
    coordinates: { lat: baseLat, lng: baseLng },
    itinerary,
    hotels,
    restaurants,
    attractions,
    costBreakdown: {
      accommodationTotal,
      foodTotal,
      transportTotal,
      attractionsTotal,
      miscellaneousTotal,
      grandTotalUSD,
      perPersonUSD,
    },
    travelTips: {
      weatherSummary: `Expect pleasant temperatures with mild breezes in ${destName}. Layers and comfortable walking footwear are highly recommended.`,
      bestTimeToVisit: "Spring (April - June) and Autumn (September - November) offer optimal weather and manageable tourist crowds.",
      localEtiquette: [
        "Greet locals politely using local customary greetings.",
        "Dress respectfully when visiting sacred or religious heritage sites.",
        "Keep card and local small cash notes for local markets.",
      ],
      packingEssentials: [
        "Comfortable walking shoes with good arch support",
        "Universal power adapter and portable power bank",
        "Lightweight rain jacket or umbrella",
        "Reusable water bottle & sunscreen",
      ],
      currencyAndTipping: "Credit cards are widely accepted across hotels and restaurants. A 10-15% tip is customary for good service.",
      safetyAdvice: "Keep valuables secure in crowded tourist spots and use officially licensed ride-hailing app services or public transit.",
    },
  };
}

module.exports = {
  generateAITrip,
};
