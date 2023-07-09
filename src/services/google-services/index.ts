import {
  GOOGLE_API_KEY,
  GOOGLE_DIRECTIONS_API,
  GOOGLE_GEOCODING_API,
} from "@api";
import axios from "axios";
import poly from "@mapbox/polyline";

export const reverseGeocode = async (
  params: ReverseGeocodeRequestType
): Promise<{ address: string; placeId: string }[]> => {
  const response = await axios.get<GeocodingResponse>(
    `${GOOGLE_GEOCODING_API}?latlng=${params.lat},${params.lng}&key=${GOOGLE_API_KEY}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const json = response.data.results.map((value) => ({
    address: value.formatted_address,
    placeId: value.place_id,
  }));
  console.log("before returning=>", json);
  return json;
};

export const getDirections = async (
  startLoc: string,
  destinationLoc: string
): Promise<GetDirectionsResponseType> => {
  const res = await axios.get(
    `${GOOGLE_DIRECTIONS_API}?origin=${startLoc}&destination=${destinationLoc}&key=${GOOGLE_API_KEY}`
  );
  const data = await res.data;
  console.log("response", data);
  const points = poly.decode(data.routes[0].overview_polyline.points);
  const coords = points.map((point, _index) => {
    return {
      latitude: point[0],
      longitude: point[1],
    };
  });
  console.log(coords);
  return {
    coords: coords,
    distance: data.routes[0].legs[0].distance.value,
  };
};
