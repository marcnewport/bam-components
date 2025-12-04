export async function getLocations() {
  const response = await fetch('apps/map', {
    headers: {
      Accept: 'application/json',
    },
  })
  const locations = await response.json()
  return locations as GeoJSON.FeatureCollection<GeoJSON.Point>
}
