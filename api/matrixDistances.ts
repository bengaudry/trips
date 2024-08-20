// Fonction pour géocoder une ville et obtenir ses coordonnées
export async function fetchCityCoords(location: string) {
  const API_KEY = process.env.EXPO_PUBLIC_OPENROUTE_APIKEY;
  if (!API_KEY) throw new Error("Api key not found");
  const url = `https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${location}&size=1`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.features.length > 0) {
    return data.features[0].geometry.coordinates;
  } else {
    throw new Error(`Could not geocode location: ${location}`);
  }
}

export async function fetchLocationFromCoords(coords: {
  lat: number;
  lon: number;
}) {
  const API_KEY = process.env.EXPO_PUBLIC_OPENROUTE_APIKEY;
  if (!API_KEY) throw new Error("Api key not found");
  const url = `https://api.openrouteservice.org/geocode/reverse?api_key=${API_KEY}&point.lon=${coords.lon}&point.lat=${coords.lat}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.features.length > 0) {
    console.log("data", data.features)
    return data.features[0].properties.localadmin as string
  } else {
    throw new Error(`Could not geocode location: ${location}`);
  }
}

// Fonction pour calculer la distance entre deux coordonnées
export async function calculateDistanceBetweenCoords(
  startCoords: number[],
  endCoords: number[]
) {
  const API_KEY = process.env.EXPO_PUBLIC_OPENROUTE_APIKEY;
  if (!API_KEY) throw new Error("Api key not found");
  const url = `https://api.openrouteservice.org/v2/directions/driving-car`;
  const body = JSON.stringify({
    coordinates: [startCoords, endCoords],
  });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: API_KEY,
      "Content-Type": "application/json",
    },
    body: body,
  });
  const data = await response.json();
  if ("routes" in data && data.routes.length > 0) {
    const route = data.routes[0];
    const distance = Math.round(route.summary.distance / 1000); // Distance en kilomètres
    const duration = Math.round(route.summary.duration / 60); // Durée en minutes
    return { distance, duration };
  } else {
    throw new Error("Could not calculate route");
  }
}
