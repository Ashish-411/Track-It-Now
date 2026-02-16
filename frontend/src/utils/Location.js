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