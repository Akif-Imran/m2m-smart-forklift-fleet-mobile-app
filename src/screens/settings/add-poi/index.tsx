import { Image, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { NoIconHeader } from "@components";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import type { ProfileSettingsStackScreenProps } from "@navigation-types";
import { colors } from "@theme";
import Svg, { Path } from "react-native-svg";

const AddPoi: React.FC<ProfileSettingsStackScreenProps<"AddPoi">> = ({}) => {
  const [location, _setLocation] = React.useState({
    latitude: 3.139003,
    longitude: 101.686855,
    name: "Placeholder",
  });
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
      <NoIconHeader title="Add POI" />
      <MapView
        ref={mapRef}
        mapType="standard"
        provider={PROVIDER_DEFAULT}
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
          pinColor={colors.info}
          tracksViewChanges={false}
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={location.name}
          onPress={() => handleMarkerOnPress(location)}
        >
          <Image
            source={require("@assets/images/forklift.png")}
            // onLoad={() => setViewTrackingA1(false)}
            // style={{ width: 35, height: 35 }}
            resizeMethod="auto"
            resizeMode="contain"
          />
        </Marker>
      </MapView>
    </SafeAreaView>
  );
};

export { AddPoi };
