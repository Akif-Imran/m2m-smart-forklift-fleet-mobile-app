import { GOOGLE_GEOCODING_API } from "@api";
import { Platform } from "react-native";
import axios from "axios";

import appConfig from "../../../app.json";

export const reverseGeocode = async (
  params: ReverseGeocodeRequestType
): Promise<{ address: string; placeId: string }[]> => {
  const API_KEY =
    Platform.OS === "android"
      ? appConfig.expo.android.config.googleMaps.apiKey
      : appConfig.expo.ios.config.googleMapsApiKey;

  const response = await axios.get<GeocodingResponse>(
    `${GOOGLE_GEOCODING_API}?latlng=${params.lat},${params.lng}&key=${API_KEY}`,
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
