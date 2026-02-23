//get one time static location
export function getUserLocation(){
    return new Promise((resolve,reject) =>{
        if(!navigator.geolocation){
            reject(new Error("Geo Location is not supported by your browser"));
        }else{
            navigator.geolocation.getCurrentPosition(
                (position) =>{
                    resolve ({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error)=>{
                    reject(error);
                },{
                    enableHighAccuracy: true, // more precise
                    timeout: 10000,           // 10 seconds max
                    maximumAge: 0,            // do not use cached position
                }
            );
        }
    });
}
// Watch location continuously (for agent live tracking)
export function watchUserLocation(onLocationUpdate, onError) {
  if (!navigator.geolocation) {
    onError(new Error("Geo Location is not supported by your browser"));
    return null;
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onLocationUpdate({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });
    },
    (error) => {
      onError(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );

  // Return watchId so it can be cleared later
  return watchId;
}

// Stop watching location
export function stopWatchingLocation(watchId) {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }
}

// Reverse geocode (lat,lng → place name) using OSM Nominatim
export async function getPlaceName(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          "User-Agent": "TrackItNow/1.0",        // ← Nominatim requires this
          "Accept-Language": "en",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch location name");

    const data = await response.json();
    const address = data.address;

    return {
      full: data.display_name,
      road: address.road || "",
      suburb: address.suburb || address.neighbourhood || "",
      area: address.city_district || "",
      city: address.city || address.town || address.village || "",
      state: address.state || "",
      country: address.country || "",
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}
export async function getRoute(source, destination, profile = "driving") {
  try {
    if (!source?.lat || !source?.lng || !destination?.lat || !destination?.lng) return null;

    const url = `https://router.project-osrm.org/route/v1/${profile}/${source.lng},${source.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch route");

    const data = await response.json();
    if (!data.routes?.length) throw new Error("No route found");

    const route = data.routes[0];
    return {
      distance: route.distance,
      duration: route.duration,
      routePoints: route.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
    };
  } catch (error) {
    console.error("Route fetching error:", error);
    return null;
  }
}
