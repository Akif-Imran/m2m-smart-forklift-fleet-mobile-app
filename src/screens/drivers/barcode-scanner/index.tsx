import { View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { theme } from "@theme";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { ToastService } from "@utility";
import type { BarCodeScannedCallback } from "expo-barcode-scanner";
import { BarCodeScanner } from "expo-barcode-scanner";
import { _ListEmptyComponent } from "@components";
import { qrScanDeviceDetails } from "@services";
import { useAuthContext } from "@context";
import Spinner from "react-native-loading-spinner-overlay";

import { styles } from "./styles";

const BarcodeScanner: React.FC<ForkliftStackScreenProps<"BarcodeScanner">> = ({
  navigation,
}) => {
  const {
    state: { token },
  } = useAuthContext();
  const [_deviceDetails, setDeviceDetails] = React.useState<
    QRScanDeviceDetails | undefined
  >(undefined);
  const [code, setCode] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(
    null
  );
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
      setCode(data);
    } else {
      ToastService.show("Try again!");
    }
    console.log("type", type, "data", data);
  };

  React.useEffect(() => {
    if (!scanned) {
      return;
    }
    setIsLoading(true);
    qrScanDeviceDetails(token, code)
      .then((res) => {
        console.log(res);
        if (res?.message) {
          ToastService.show(res?.message);
        }

        if (res.success) {
          setDeviceDetails(res.result);
          navigation.navigate("DriverCheckList", {
            _id: res.result?.id.toString(),
            item: res.result,
          });
        } else {
          navigation.goBack();
        }
      })
      .catch((_err) => {
        console.log(_err?.message);
        ToastService.show("Device Scan error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [code, scanned]);

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
      <Spinner
        visible={isLoading}
        cancelable={false}
        animation="fade"
        size="large"
      />
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
