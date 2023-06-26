/* eslint-disable camelcase */
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Spinner from "react-native-loading-spinner-overlay";
import {
  _DatePicker,
  _Divider,
  _ScrollFormLayout,
  _TextInput,
} from "@components";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { screenStyles } from "src/screens/styles";
import type { DriverStackScreenProps } from "@navigation-types";
import * as ImagePicker from "expo-image-picker";
import * as yup from "yup";
import { useFormik } from "formik";
import { ToastService } from "@utility";
import moment from "moment";
import { Button, TextInput } from "react-native-paper";
import { AirbnbRating } from "react-native-ratings";

type IForm = Omit<IDriver, "_id">;

const scheme: yup.ObjectSchema<IForm> = yup.object().shape({
  name: yup.string().required("Name is required"),
  department: yup.string().required("Department is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  ic_number: yup.string().required("IC number is required"),
  image: yup.string().required("Image is required"),
  touchId: yup.string().required("Touch ID is required"),
  experience: yup.string().required("Experience is required"),
  joiningDate: yup.string().required("Joining date is required"),
  licenseType: yup.string().required("License type is required"),
  mobileNo: yup.string().required("Mobile number is required"),
  password: yup.string().required("Password is required"),
  rating: yup.number().optional().default(0),
});

const AddDriver: React.FC<DriverStackScreenProps<"AddDriver">> = ({
  navigation,
  route,
}) => {
  const { mode } = route.params;
  const [isLoading, setIsLoading] = React.useState(false);
  const [_hasImages, setHasImages] = React.useState<boolean>(false);
  const [images, setImages] = React.useState<ImagePicker.ImagePickerAsset[]>(
    []
  );
  const [joiningDate, setJoiningDate] = React.useState<Date>(new Date());
  const [showJoiningDatePicker, setShowJoiningDatePicker] =
    React.useState(false);

  const form = useFormik<IForm>({
    initialValues: {
      name: "",
      department: "",
      email: "",
      ic_number: "",
      image: "",
      touchId: "",
      experience: "",
      joiningDate: moment().format("YYYY-MM-DD"),
      licenseType: "",
      mobileNo: "",
      password: "",
      rating: 0,
    },
    onSubmit: (values, helpers) => {
      console.log(values);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        helpers.resetForm();
        ToastService.show("Driver added successfully");
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
      const result = await ImagePicker.launchCameraAsync({
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
    if (arr.length === 0) {
      setHasImages(false);
    }
    setImages(arr);
  };

  React.useEffect(() => {
    form.setValues((prev) => ({
      ...prev,
      joiningDate: moment(joiningDate).format("YYYY-MM-DD"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joiningDate]);

  React.useEffect(() => {
    if (route.params.mode === "add") {
      return;
    }
    const { item } = route.params;
    form.setValues((prev) => ({
      ...prev,
      name: item.name || "",
      department: item.department || "",
      email: item.email || "",
      ic_number: item.ic_number || "",
      image: item.image || "",
      touchId: item.touchId || "",
      experience: item.experience || "",
      joiningDate:
        moment(item.joiningDate).format("YYYY-MM-DD") ||
        moment().format("YYYY-MM-DD"),
      licenseType: item.licenseType || "",
      mobileNo: item.mobileNo || "",
      password: item.password || "",
      rating: item.rating || 0,
    }));
    setImages((_prev) => [{ uri: item.image, ...theme.img.size.md }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params]);

  return (
    <SafeAreaView
      style={StyleSheet.compose(screenStyles.mainContainer, {
        rowGap: theme.spacing.none,
      })}
    >
      <Spinner
        visible={isLoading}
        cancelable={false}
        animation="fade"
        size="large"
      />
      <_DatePicker
        show={showJoiningDatePicker}
        setShow={setShowJoiningDatePicker}
        mode={"date"}
        date={joiningDate}
        setDate={setJoiningDate}
      />
      <_ScrollFormLayout>
        <View style={{ rowGap: theme.spacing.xs }}>
          <_Divider title="Driver Photo" />
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
            ListFooterComponent={
              <TouchableOpacity
                style={screenStyles.addImageButton}
                activeOpacity={0.5}
                onPress={() => captureImage()}
              >
                <AntDesign name="plus" size={30} color={colors.primary} />
              </TouchableOpacity>
            }
            keyExtractor={(_, index) => index.toString()}
          />
          <_Divider title="New Info" />
          <_TextInput
            value={form.values.name}
            label={"Name"}
            onBlur={form.handleBlur("name")}
            onChangeText={form.handleChange("name")}
            error={form.errors?.name && form.touched?.name ? true : false}
            errorText={form.errors?.name}
          />
          <_TextInput
            value={form.values.ic_number}
            label={"IC No."}
            onBlur={form.handleBlur("ic_number")}
            onChangeText={form.handleChange("ic_number")}
            error={
              form.errors?.ic_number && form.touched?.ic_number ? true : false
            }
            errorText={form.errors?.ic_number}
          />
          <_TextInput
            value={form.values.touchId}
            label={"Touch Id"}
            onBlur={form.handleBlur("touchId")}
            onChangeText={form.handleChange("touchId")}
            error={form.errors?.touchId && form.touched?.touchId ? true : false}
            errorText={form.errors?.touchId}
          />
          <_Divider title="Driver Rating" />
          <AirbnbRating
            count={5}
            // starContainerStyle={screenStyles.ratingContainer}
            defaultRating={0}
            size={18}
            selectedColor={colors.warning}
            showRating={false}
            onFinishRating={(rating) =>
              form.setValues((prev) => ({ ...prev, rating: rating }))
            }
          />
          <_Divider title="Driver Info" />
          <_TextInput
            value={form.values.email}
            label={"Email"}
            onBlur={form.handleBlur("email")}
            onChangeText={form.handleChange("email")}
            error={form.errors?.email && form.touched?.email ? true : false}
            errorText={form.errors?.email}
          />
          <_TextInput
            value={form.values.password}
            label={"Password"}
            onBlur={form.handleBlur("password")}
            onChangeText={form.handleChange("password")}
            error={
              form.errors?.password && form.touched?.password ? true : false
            }
            errorText={form.errors?.password}
          />
          <_TextInput
            value={form.values.department}
            label={"Department"}
            onBlur={form.handleBlur("department")}
            onChangeText={form.handleChange("department")}
            error={
              form.errors?.department && form.touched?.department ? true : false
            }
            errorText={form.errors?.department}
          />
          <_TextInput
            value={form.values.mobileNo}
            label={"Mobile No."}
            onBlur={form.handleBlur("mobileNo")}
            onChangeText={form.handleChange("mobileNo")}
            error={
              form.errors?.mobileNo && form.touched?.mobileNo ? true : false
            }
            errorText={form.errors?.mobileNo}
          />
          <_TextInput
            value={form.values.joiningDate}
            label={"Joining Date"}
            editable={false}
            onBlur={form.handleBlur("joiningDate")}
            onChangeText={form.handleChange("joiningDate")}
            error={
              form.errors?.joiningDate && form.touched?.joiningDate
                ? true
                : false
            }
            errorText={form.errors?.joiningDate}
            right={
              <TextInput.Icon
                icon="calendar"
                color={colors.iconGray}
                onPress={() => setShowJoiningDatePicker(true)}
              />
            }
          />
          <_TextInput
            value={form.values.experience}
            label={"Years of Experience"}
            onBlur={form.handleBlur("experience")}
            onChangeText={form.handleChange("experience")}
            error={
              form.errors?.experience && form.touched?.experience ? true : false
            }
            errorText={form.errors?.experience}
          />
          <_Divider title="License Info" />
          <_TextInput
            value={form.values.licenseType}
            label={"License Type"}
            onBlur={form.handleBlur("licenseType")}
            onChangeText={form.handleChange("licenseType")}
            error={
              form.errors?.licenseType && form.touched?.licenseType
                ? true
                : false
            }
            errorText={form.errors?.licenseType}
          />
          <View style={screenStyles.formSubmitButtonContainer}>
            <Button
              theme={PaperTheme}
              mode="contained"
              onPress={() => form.handleSubmit()}
              labelStyle={StyleSheet.compose(gStyles.tblHeaderText, {
                color: colors.white,
              })}
            >
              {mode === "add" ? "Add" : "Update"}
            </Button>
          </View>
        </View>
      </_ScrollFormLayout>
    </SafeAreaView>
  );
};

export { AddDriver };
