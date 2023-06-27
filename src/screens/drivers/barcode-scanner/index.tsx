import { View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { theme } from "@theme";
import { DriverStackScreenProps } from "@navigation-types";
import { ToastService } from "@utility";
import { BarCodeScannedCallback, BarCodeScanner } from "expo-barcode-scanner";
import { _ListEmptyComponent } from "@components";

const BarcodeScanner: React.FC<DriverStackScreenProps<"BarcodeScanner">> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);
  const [scanned, setScanned] = React.useState<boolean>(false);
  // const [text, setText] = useState<string>("Not yet scanned");

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status == "granted");
    })();
  };

  React.useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleBarcodeScanned: BarCodeScannedCallback = ({ type, data }) => {
    if (data) {
      setScanned(true);
      ToastService.show("Scanned successfully");
      navigation.navigate("DriverCheckList");
    } else {
      ToastService.show("Try again!");
    }
    console.log("type", type, "data", data);
  };

  if (hasPermission === null) {
    // navigation.goBack();
    return (
      <SafeAreaView style={screenStyles.mainContainer}>
        <View style={{ height: theme.header.height }} />
        <_ListEmptyComponent label="Permission not granted" />
        {/* <Text>Permission not granted</Text> */}
      </SafeAreaView>
    );
  }
  if (hasPermission === false) {
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <_ListEmptyComponent label="No access to camera" />
      {/* <Text>No access to camera</Text> */}
    </SafeAreaView>;
  }

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <View style={styles.barcodeBox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarcodeScanned}
          style={{ height: 700, width: 400 }}
        />
      </View>
    </SafeAreaView>
  );
};

export { BarcodeScanner };
