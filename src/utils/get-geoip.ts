export type GeoipResponse = {
  ip: string
  network: string
  version: string
  city: string
  region: string
  region_code: string
  country: string
  country_name: string
  country_code: string
  country_code_iso3: string
  country_capital: string
  country_tld: string
  continent_code: string
  in_eu: boolean
  postal: string
  latitude: number
  longitude: number
  timezone: string
  utc_offset: string
  country_calling_code: string
  currency: string
  currency_name: string
  languages: string
  country_area: number
  country_population: number
  asn: string
  org: string
}

const sydneyResponse = {
  ip: '180.150.38.253', // Example IP
  network: '180.150.38.0/23', // Example network
  version: 'IPv4',
  city: 'Sydney',
  region: 'New South Wales',
  region_code: 'NSW',
  country: 'AU',
  country_name: 'Australia',
  country_code: 'AU',
  country_code_iso3: 'AUS',
  country_capital: 'Canberra',
  country_tld: '.au',
  continent_code: 'OC',
  in_eu: false,
  postal: '2000',
  latitude: -33.8679,
  longitude: 151.207,
  timezone: 'Australia/Sydney',
  utc_offset: '+1100',
  country_calling_code: '+61',
  currency: 'AUD',
  currency_name: 'Dollar',
  languages: 'en-AU',
  country_area: 7686850,
  country_population: 24992369,
  asn: 'AS4764',
  org: 'Aussie Broadband',
}

// TODO : only store necessary fields
// TODO : check if this service is reliable enough for production use
export async function getGeoip(): Promise<GeoipResponse> {
  // Check if geoip data is already cached in sessionStorage
  const cachedGeoip = sessionStorage.getItem('geoipData')
  if (cachedGeoip) {
    return JSON.parse(cachedGeoip) as GeoipResponse
  }

  try {
    // const response = await fetch('https://geoip-db.com/json/')
    const response = await fetch('https://ipapi.co/json')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    // Cache the geoip data in sessionStorage
    sessionStorage.setItem('geoipData', JSON.stringify(data))
    return data
  } catch (error) {
    console.error('Error fetching geoip data:', error)
  }

  // Fallback to Sydney, Australia if fetch fails
  return sydneyResponse
}
