import { StyleSheet, View } from "react-native";
import React from "react";
import type { ReportStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { screenStyles } from "@screen-styles";
import { colors, theme } from "@theme";

const ViewOnMap: React.FC<ReportStackScreenProps<"ViewOnMap">> = ({
  route,
}) => {
  const { location, name } = route.params;
  const mapRef = React.useRef<MapView>(null);
  const [_isMapReady, setIsMapReady] = React.useState<boolean>(false);

  const fitCoordinates = React.useCallback(() => {
    if (!mapRef.current || !location) {
      return;
    }
    mapRef.current?.fitToCoordinates([location], {
      animated: true,
      edgePadding: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      },
    });
  }, [mapRef, location]);

  const handleMarkerOnPress = React.useCallback((coords: CoordinatesType) => {
    mapRef.current?.animateCamera({
      center: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
      zoom: 12,
    });
  }, []);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <MapView
        ref={mapRef}
        mapType="standard"
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
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
        <Marker
          tracksViewChanges={false}
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={name}
          onPress={() => handleMarkerOnPress(location)}
        />
      </MapView>
    </SafeAreaView>
  );
};

export { ViewOnMap };
