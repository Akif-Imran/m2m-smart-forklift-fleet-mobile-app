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
import { screenStyles } from "@screen-styles";
import type { DriverStackScreenProps } from "@navigation-types";
import * as ImagePicker from "expo-image-picker";
import * as yup from "yup";
import type { FormikHelpers } from "formik";
import { useFormik } from "formik";
import { ToastService } from "@utility";
import moment from "moment";
import { Button, TextInput } from "react-native-paper";
import { AirbnbRating } from "react-native-ratings";
import { addDriver, updateDriver } from "@services";
import { useAuthContext } from "@context";
import { baseURL } from "@api";

type IForm = Omit<AddDriverRequest, "id"> & {
  rating?: number;
};

const scheme: yup.ObjectSchema<IForm> = yup.object().shape({
  name: yup.string().required("Name is required"),
  ic_number: yup.string().required("IC number is required"),
  touch_id: yup.string().required("Touch ID is required"),
  mobile_number: yup.string().required("Mobile number is required"),
  joining_date: yup.string().required("Joining date is required"),
  experience_in_year: yup.string().required("Experience is required"),
  license_type: yup.string().required("License type is required"),
  license_number: yup.string().required("License number is required"),
  license_expiry: yup.string().required("License expiry date is required"),
  department: yup.string().required("Department is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  dob: yup.string().required("Date of birth is required"),
  rating: yup.number().optional().default(0),
  picture: yup.string().optional(),
});

const AddDriver: React.FC<DriverStackScreenProps<"AddDriver">> = ({
  navigation,
  route,
}) => {
  const { mode } = route.params;
  const {
    state: { token },
  } = useAuthContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [_hasImages, setHasImages] = React.useState<boolean>(false);
  const [images, setImages] = React.useState<ImagePicker.ImagePickerAsset[]>(
    []
  );
  const [joiningDate, setJoiningDate] = React.useState<Date>(new Date());
  const [showJoiningDatePicker, setShowJoiningDatePicker] =
    React.useState(false);
  const [dob, setDob] = React.useState<Date>(new Date());
  const [showDobDatePicker, setShowDobDatePicker] = React.useState(false);
  const [expiryDate, setExpiryDate] = React.useState<Date>(new Date());
  const [showExpiryDatePicker, setShowExpiryDatePicker] = React.useState(false);

  const form = useFormik<IForm>({
    initialValues: {
      name: "",
      ic_number: "",
      touch_id: "",
      mobile_number: "",
      joining_date: moment().format("YYYY-MM-DD"),
      experience_in_year: "0",
      license_type: "",
      license_number: "",
      license_expiry: moment().format("YYYY-MM-DD"),
      department: "",
      email: "",
      password: "",
      dob: moment().format("YYYY-MM-DD"),
      picture: "",
      rating: 3,
    },
    onSubmit: (values, helpers) => {
      console.log(values);
      setIsLoading(true);
      if (mode === "add") {
        createDriver(values, helpers);
      } else {
        editDriver(values, helpers);
      }
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
          form.setValues((prev) => ({
            ...prev,
            picture: result.assets[0]?.base64 || "",
          }));
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

  const createDriver = (values: IForm, helpers: FormikHelpers<IForm>) => {
    setIsLoading(true);
    addDriver(token, { ...values })
      .then((res) => {
        ToastService.show(res?.message || "");
        if (res.success) {
          helpers.resetForm();
          navigation.goBack();
        }
      })
      .catch((_err) => {
        ToastService.show("Error occurred");
        console.log(_err?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const editDriver = (values: IForm, helpers: FormikHelpers<IForm>) => {
    setIsLoading(true);
    updateDriver(token, {
      id: mode === "edit" ? route.params.item.id : 0,
      ...values,
    })
      .then((res) => {
        ToastService.show(res?.message || "");
        if (res.success) {
          helpers.resetForm();
          navigation.goBack();
        }
      })
      .catch((_err) => {
        ToastService.show("Error occurred");
        console.log(_err?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    form.setValues((prev) => ({
      ...prev,
      joining_date: moment(joiningDate).format("YYYY-MM-DD"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joiningDate]);
  React.useEffect(() => {
    form.setValues((prev) => ({
      ...prev,
      dob: moment(dob).format("YYYY-MM-DD"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dob]);
  React.useEffect(() => {
    form.setValues((prev) => ({
      ...prev,
      license_expiry: moment(expiryDate).format("YYYY-MM-DD"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiryDate]);

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
      picture: item.picture || "",
      touch_id: item.touch_id || "",
      experience_in_year: item.experience_in_year.toString() || "",
      licenseType: item.license_type || "",
      mobile_number: item.mobile_number || "",
      password: item.password || "",
      //@ts-expect-error will add rating later to api
      rating: item?.rating || 0,
      license_number: item.license_number || "",
      joining_date: item.joining_date
        ? moment(item.joining_date).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD"),
      license_expiry: item.license_expiry
        ? moment(item.license_expiry).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD"),
      license_type: item.license_type || "",
      dob: item.dob
        ? moment(item.dob).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD"),
    }));
    setImages((_prev) => {
      if (!item.picture) {
        return [];
      }
      return [{ uri: `${baseURL}${item.picture}`, ...theme.img.size.md }];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params]);
  console.log(form.errors);
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
        show={showDobDatePicker}
        setShow={setShowDobDatePicker}
        mode={"date"}
        date={dob}
        setDate={setDob}
      />
      <_DatePicker
        show={showJoiningDatePicker}
        setShow={setShowJoiningDatePicker}
        mode={"date"}
        date={joiningDate}
        setDate={setJoiningDate}
      />
      <_DatePicker
        show={showExpiryDatePicker}
        setShow={setShowExpiryDatePicker}
        mode={"date"}
        date={expiryDate}
        setDate={setExpiryDate}
      />
      <_ScrollFormLayout>
        <View style={{ rowGap: theme.spacing.xs }}>
          <_Divider title="Driver Photo" />
          {images.length > 0 ? (
            <TouchableOpacity
              style={screenStyles.addedImageBtnStyle}
              onPress={() => removeImage(0)}
            >
              <Image
                source={{ uri: images[0]?.uri }}
                style={screenStyles.addedImgStyle}
                resizeMethod="scale"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={screenStyles.addImageButton}
              activeOpacity={0.5}
              onPress={() => captureImage()}
            >
              <AntDesign name="plus" size={30} color={colors.primary} />
            </TouchableOpacity>
          )}
          {/* <FlatList
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
          /> */}
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
            value={form.values.touch_id}
            label={"Touch Id"}
            onBlur={form.handleBlur("touch_id")}
            onChangeText={form.handleChange("touch_id")}
            error={
              form.errors?.touch_id && form.touched?.touch_id ? true : false
            }
            errorText={form.errors?.touch_id}
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
            keyboardType="email-address"
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
            value={form.values.mobile_number}
            label={"Mobile No."}
            onBlur={form.handleBlur("mobile_number")}
            onChangeText={form.handleChange("mobile_number")}
            error={
              form.errors?.mobile_number && form.touched?.mobile_number
                ? true
                : false
            }
            errorText={form.errors?.mobile_number}
          />
          <_TextInput
            value={form.values.dob}
            label={"Date of Birth"}
            editable={false}
            onBlur={form.handleBlur("dob")}
            onChangeText={form.handleChange("dob")}
            error={form.errors?.dob && form.touched?.dob ? true : false}
            errorText={form.errors?.dob}
            right={
              <TextInput.Icon
                icon="calendar"
                color={colors.iconGray}
                onPress={() => setShowDobDatePicker(true)}
              />
            }
          />
          <_TextInput
            value={form.values.joining_date}
            label={"Joining Date"}
            editable={false}
            onBlur={form.handleBlur("joining_date")}
            onChangeText={form.handleChange("joining_date")}
            error={
              form.errors?.joining_date && form.touched?.joining_date
                ? true
                : false
            }
            errorText={form.errors?.joining_date}
            right={
              <TextInput.Icon
                icon="calendar"
                color={colors.iconGray}
                onPress={() => setShowJoiningDatePicker(true)}
              />
            }
          />
          <_TextInput
            value={form.values.experience_in_year}
            label={"Years of Experience"}
            onBlur={form.handleBlur("experience_in_year")}
            onChangeText={form.handleChange("experience_in_year")}
            error={
              form.errors?.experience_in_year &&
              form.touched?.experience_in_year
                ? true
                : false
            }
            errorText={form.errors?.experience_in_year}
          />
          <_Divider title="License Info" />
          <_TextInput
            value={form.values.license_type}
            label={"License Type"}
            onBlur={form.handleBlur("license_type")}
            onChangeText={form.handleChange("license_type")}
            error={
              form.errors?.license_type && form.touched?.license_type
                ? true
                : false
            }
            errorText={form.errors?.license_type}
          />
          <_TextInput
            value={form.values.license_number}
            label={"License No."}
            onBlur={form.handleBlur("license_number")}
            onChangeText={form.handleChange("license_number")}
            error={
              form.errors?.license_number && form.touched?.license_number
                ? true
                : false
            }
            errorText={form.errors?.license_number}
          />
          <_TextInput
            value={form.values.license_expiry}
            label={"Expiry Date"}
            editable={false}
            onBlur={form.handleBlur("license_expiry")}
            onChangeText={form.handleChange("license_expiry")}
            error={
              form.errors?.license_expiry && form.touched?.license_expiry
                ? true
                : false
            }
            errorText={form.errors?.license_expiry}
            right={
              <TextInput.Icon
                icon="calendar"
                color={colors.iconGray}
                onPress={() => setShowExpiryDatePicker(true)}
              />
            }
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
