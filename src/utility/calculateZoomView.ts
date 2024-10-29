export function calculateZoomLevelOfEachCounty(
  countyGeoJSON: FeatureCollection,
  width = 800, // Default width is 800
  height = 600
) {
  const zoomToWhichCounty = {};

  // Calculate view for each state
  countyGeoJSON.features.forEach((countyFeature) => {
    const [minLng, minLat, maxLng, maxLat] = turf.bbox(countyFeature);

    const [centerLng, centerLat] =
      turf.centroid(countyFeature).geometry.coordinates;

    // Calculate zoom
    const viewport = new WebMercatorViewport({ width, height }).fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      {
        padding: 20, // Add some padding
      }
    );

    // Special case for state "a" (adjust as needed)
    // if (stateName === "a") {
    //   zoomToWhichCounty[countyFeature.properties.GEOID] = {
    //     longitude: centerLng,
    //     latitude: centerLat,
    //     zoom: 6,
    //   };
    // } else {
    zoomToWhichCounty[countyFeature.properties.GEOID] = {
      longitude: centerLng,
      latitude: centerLat,
      zoom: Math.ceil(viewport.zoom) * 0.881,
      minZoom: 3.2,
    };
    // }
  });

  return zoomToWhichCounty;
}
