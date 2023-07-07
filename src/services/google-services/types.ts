interface ReverseGeocodeRequestType {
  lat: number;
  lng: number;
}
interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Geometry {
  location: {
    lat: number;
    lng: number;
  };
  location_type: string;
  viewport: {
    northeast: {
      lat: number;
      lng: number;
    };
    southwest: {
      lat: number;
      lng: number;
    };
  };
}

interface Result {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  types: string[];
}

interface GeocodingResponse {
  results: Result[];
  status: string;
}

interface GetDirectionsResponseType {
  coords: {
    latitude: number;
    longitude: number;
  }[];
  distance: number; //distance in meters.
}
