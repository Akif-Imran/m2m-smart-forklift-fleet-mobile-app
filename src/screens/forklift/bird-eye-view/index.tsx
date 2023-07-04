import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { colors, theme } from "@theme";
import type { LatLng } from "react-native-maps";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;

const BirdEyeView: React.FC<ForkliftStackScreenProps<"BirdEyeView">> = ({
  route,
}) => {
  const { mode } = route.params;
  const mapRef = React.useRef<MapView>(null);
  const [trackViewChanges, _setTrackViewChanges] =
    React.useState<boolean>(true);
  const [latAdjustment, setLatAdjustment] = React.useState<number>(0);
  const [isMapReady, setIsMapReady] = React.useState<boolean>(false);
  const [markers, _setMarkers] = React.useState<IMarkerPin[]>([]);

  const handleMarkerOnPress = React.useCallback(
    (coords: CoordinatesType) => {
      mapRef.current?.animateCamera({
        center: {
          latitude: coords.latitude - latAdjustment,
          longitude: coords.longitude,
        },
      });
    },
    [latAdjustment]
  );

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
    if (!mapRef.current || markers.length === 0) {
      return;
    }
    mapRef.current?.fitToCoordinates(markers, {
      edgePadding: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      },
      animated: true,
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

  React.useEffect(() => {
    if (mode === "single") {
      const { point } = route.params;
      _setMarkers([point]);
    } else if (mode === "multiple") {
      _setMarkers(route.params.points);
    }
  }, [mode, route.params]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <MapView
        ref={mapRef}
        mapType="standard"
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={
          markers.length > 0
            ? {
                latitude: markers[0].latitude,
                longitude: markers[0].longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
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
