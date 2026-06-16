import { Place, PlaceCategory, PlaceFeatures } from '../screens/MapScreen'

export const CATEGORY_FEATURE_DEFAULTS: Record<PlaceCategory, PlaceFeatures> = {
  shelter:    { entrance: true,  toilet: false, inside: true  },
  hospital:   { entrance: true,  toilet: true,  inside: true  },
  restaurant: { entrance: true,  toilet: true,  inside: true  },
  landmark:   { entrance: true,  toilet: true,  inside: true  },
  supermarket:{ entrance: true,  toilet: false, inside: true  },
  park:       { entrance: true,  toilet: true,  inside: false },
  bank:       { entrance: true,  toilet: false, inside: true  },
  toilet:     { entrance: true,  toilet: true,  inside: false },
  pharmacy:   { entrance: true,  toilet: false, inside: true  },
}

export function getPlaceFeatures(place: Place): PlaceFeatures {
  return { ...CATEGORY_FEATURE_DEFAULTS[place.category], ...place.featuresOverride ?? {} }
}
