import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { useEffect, useState } from 'preact/compat'
import { useGeoip } from '@/hooks/use-geoip'

export function useLocationBias(radius = 50000): google.maps.Circle | null {
  const mapsLibrary = useMapsLibrary('maps')
  const userLocation = useGeoip()

  const [locationBias, setLocationBias] = useState<google.maps.Circle | null>(
    null
  )

  useEffect(() => {
    if (!mapsLibrary || !userLocation) return
    setLocationBias(
      new mapsLibrary.Circle({
        center: userLocation,
        radius: radius,
      })
    )
  }, [mapsLibrary, userLocation, radius])

  return locationBias
}
