import { Linking, Platform } from "react-native";

import { ToastService } from "./toast-utility";

export const handleOpenWebsite = (url: string) => {
  Linking.canOpenURL(url)
    .then((supported) => {
      console.log(url);
      if (supported) {
        Linking.openURL(url);
      } else {
        ToastService.show("Website link error");
      }
    })
    .catch((_err) => {
      ToastService.show("Website link error");
    });
};

export const getMapsUrlFromLatLng = (
  label: string,
  lat: string,
  lng: string
): string => {
  const scheme = Platform.select({
    ios: "maps://0,0?q=",
    android: "geo:0,0?q=",
  });
  const latLng = `${lat},${lng}`;
  const url =
    Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    }) || "";
  return url;
};
