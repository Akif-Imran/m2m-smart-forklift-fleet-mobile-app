import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { colors, theme } from "@theme";
import type { LatLng } from "react-native-maps";
// eslint-disable-next-line import/no-extraneous-dependencies
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

interface _LatLng extends LatLng {
  name: string;
}
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;

const BirdEyeView: React.FC<ForkliftStackScreenProps<"BirdEyeView">> = ({}) => {
  const mapRef = React.useRef<MapView>(null);
  const [trackViewChanges, setTrackViewChanges] = React.useState<boolean>(true);
  const [latAdjustment, setLatAdjustment] = React.useState<number>(0);
  const [isMapReady, setIsMapReady] = React.useState<boolean>(false);
  const [markers, setMarkers] = React.useState<_LatLng[]>([
    {
      latitude: 3.139003,
      longitude: 101.686855,
      name: "PT-01",
    },
    {
      latitude: 3.154159,
      longitude: 101.713877,
      name: "PT-02",
    },
    {
      latitude: 3.151663,
      longitude: 101.695417,
      name: "PT-03",
    },
    {
      latitude: 3.149408,
      longitude: 101.696225,
      name: "PT-04",
    },
  ]);

  const handleMarkerOnPress = React.useCallback((coords: CoordinatesType) => {
    mapRef.current?.animateCamera({
      center: {
        latitude: coords.latitude - latAdjustment,
        longitude: coords.longitude,
      },
    });
  }, []);

  const calculateDelta = async () => {
    if (!mapRef.current) {
      return;
    }
    const boundingBox = await mapRef.current?.getMapBoundaries();
    const northeastLat = boundingBox?.northEast.latitude;
    const southwestLat = boundingBox?.southWest.latitude;
    const latDelta = northeastLat - southwestLat;
    // const lngDelta = latDelta * ASPECT_RATIO;
    const latAdj = (latDelta / SCREEN_HEIGHT) * SCREEN_HEIGHT * 0.1;
    setLatAdjustment(latAdj);
  };

  const fitCoordinates = React.useCallback(() => {
    if (!mapRef.current) {
      return;
    }
    mapRef.current?.fitToCoordinates(markers, {
      edgePadding: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      },
    });
  }, [mapRef, markers]);

  React.useEffect(() => {
    if (!isMapReady) {
      return;
    }
    calculateDelta().catch((err) =>
      console.error("delta calculate error - CarOnMap", err)
    );
  }, [mapRef, isMapReady]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <MapView
        ref={mapRef}
        mapType="standard"
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: markers[0].latitude,
          longitude: markers[0].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        loadingEnabled={true}
        loadingIndicatorColor={colors.primary}
        zoomEnabled={true}
        zoomControlEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        onMapLoaded={() => setIsMapReady(true)}
        onMapReady={() => fitCoordinates()}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            tracksViewChanges={trackViewChanges}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.name}
            onPress={() => handleMarkerOnPress(marker)}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
};

export { BirdEyeView };
