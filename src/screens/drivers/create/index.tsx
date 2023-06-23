import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Spinner from "react-native-loading-spinner-overlay";
import { _DatePicker, _Divider, _ScrollFormLayout, _TextInput } from "@components";
import { colors, theme } from "@theme";
import { screenStyles } from "src/screens/styles";
import { DriverStackScreenProps } from "@navigation-types";
import * as ImagePicker from "expo-image-picker";
import * as yup from "yup";
import { useFormik } from "formik";
import { ToastService } from "@utility";

interface OwnProps {}
interface IForm extends Omit<IDriver, "_id"> {}

const scheme = yup.object().shape({});

const AddDriver: React.FC<DriverStackScreenProps<"AddDriver">> = ({ navigation, route }) => {
  const { mode } = route.params;
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasImages, setHasImages] = React.useState<boolean>(false);
  const [images, setImages] = React.useState<ImagePicker.ImagePickerAsset[]>([]);
  const [purchaseDate, setPurchaseDate] = React.useState<Date>(new Date());
  const [showPurchaseDatePicker, setShowPurchaseDatePicker] = React.useState(false);

  const form = useFormik<IForm>({
    initialValues: {
      name: "",
      department: "",
      email: "",
      ic_number: "",
      image: "",
      rating: 0,
      touchId: "",
    },
    onSubmit: (values, helpers) => {
      console.log(values);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        ToastService.show("Forklift added successfully");
        navigation.goBack();
      });
    },
    validationSchema: scheme,
  });

  const captureImage = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.granted === false) {
        ToastService.show("Camera permission denied");
        return;
      }
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        base64: true,
        allowsMultipleSelection: false,
        quality: 1,
      });
      // console.log(result);
      if (!result.canceled) {
        if (result.assets !== null) {
          //multiple images for
          setHasImages(true);
          const newImg = result?.assets[0];
          setImages((prev) => [...prev, newImg]);
          console.log(result.assets[0]?.uri, "camera");
        } else {
          // setImage(undefined);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      // closeBottomSheet();
    }
  };

  const removeImage = (index: number) => {
    const arr = [...images];
    arr.splice(index, 1);
    if (arr.length === 0) setHasImages(false);
    setImages(arr);
  };

  return (
    <SafeAreaView
      style={StyleSheet.compose(screenStyles.mainContainer, { rowGap: theme.spacing.none })}
    >
      <Spinner visible={isLoading} cancelable={false} animation="fade" size="large" />
      <_DatePicker
        show={showPurchaseDatePicker}
        setShow={setShowPurchaseDatePicker}
        mode={"date"}
        date={purchaseDate}
        setDate={setPurchaseDate}
      />
      <_ScrollFormLayout>
        <View style={{ rowGap: theme.spacing.xs }}>
          <_Divider title="Forklift Image" />
          <FlatList
            horizontal
            data={images}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ columnGap: theme.spacing.sm }}
            renderItem={({ index, item }) => (
              <TouchableOpacity
                style={screenStyles.addedImageBtnStyle}
                onPress={() => removeImage(index)}
              >
                <Image
                  source={{ uri: item?.uri }}
                  style={screenStyles.addedImgStyle}
                  resizeMethod="scale"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            ListFooterComponent={() => (
              <TouchableOpacity
                style={screenStyles.addImageButton}
                activeOpacity={0.5}
                onPress={() => captureImage()}
              >
                <AntDesign name="plus" size={30} color={colors.primary} />
              </TouchableOpacity>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
          <_Divider title="Forklift Info" />
          <_TextInput
            value={form.values.name}
            label={"Name"}
            onBlur={form.handleBlur("name")}
            onChangeText={form.handleChange("name")}
            error={form.errors?.name && form.touched?.name ? true : false}
            errorText={form.errors?.name}
          />
        </View>
      </_ScrollFormLayout>
    </SafeAreaView>
  );
};

export { AddDriver };
