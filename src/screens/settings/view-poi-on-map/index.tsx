import {
  Image,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import type { ProfileSettingsStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { colors, theme } from "@theme";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { images } from "@markers";

const ViewPoiOnMap: React.FC<
  ProfileSettingsStackScreenProps<"ViewPoiOnMap">
> = ({ route }) => {
  const { _id, item } = route.params;
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
  const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const mapRef = React.useRef<MapView>(null);
  const [_isMapReady, setIsMapReady] = React.useState<boolean>(false);

  const fitCoordinates = React.useCallback(() => {
    if (!mapRef.current || !item) {
      return;
    }
    mapRef.current?.animateCamera({
      center: {
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
      },
      zoom: 14,
      altitude: 2500, //altitude in meters.
    });
  }, [mapRef, item]);

  const handleMarkerOnPress = React.useCallback((coords: CoordinatesType) => {
    mapRef.current?.animateCamera({
      center: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    });
  }, []);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <MapView
        ref={mapRef}
        mapType="standard"
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        loadingEnabled={true}
        loadingIndicatorColor={colors.primary}
        zoomEnabled={true}
        rotateEnabled={false}
        showsCompass={Platform.OS === "ios"}
        zoomTapEnabled={false}
        zoomControlEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        onMapLoaded={() => setIsMapReady(true)}
        onMapReady={() => fitCoordinates()}
      >
        <Marker
          key={_id}
          pinColor={colors.info}
          tracksViewChanges={false}
          coordinate={{
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
          }}
          centerOffset={{ x: 0, y: -18 }}
          title={item.poi_name}
          onPress={() =>
            handleMarkerOnPress({
              latitude: parseFloat(item.latitude),
              longitude: parseFloat(item.longitude),
            })
          }
        >
          <Image
            source={images[`${item.marker_shape}-${item.color}`]}
            // onLoad={() => setViewTrackingA1(false)}
            style={{ ...theme.img.size.sm }}
            resizeMethod="auto"
            resizeMode="contain"
          />
        </Marker>
      </MapView>
    </SafeAreaView>
  );
};

export { ViewPoiOnMap };
