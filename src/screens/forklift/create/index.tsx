import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Spinner from "react-native-loading-spinner-overlay";
import { _DatePicker, _Divider, _Dropdown, _ScrollFormLayout, _TextInput } from "@components";
import { screenStyles } from "src/screens/styles";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { ForkliftStackScreenProps } from "@navigation-types";
import { ToastService } from "@utility";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import * as yup from "yup";
import { useFormik } from "formik";
import moment from "moment";
import { Button, TextInput } from "react-native-paper";

interface OwnProps {}
interface IForm extends Omit<IForklift, "_id" | "image" | "milage" | "age" | "driver"> {
  simNo: string;
  imei: string;
  milage: number;
  age: number;
}
const schema: yup.ObjectSchema<IForm> = yup.object().shape({
  name: yup.string().required("Name is required"), //list
  simNo: yup.string().required("Sim Number is required"),
  imei: yup.string().required("IMEI is required"),
  regNo: yup.string().required("Registration Number is required"),
  color: yup.string().required("Color is required"),
  make: yup.string().required("Make is required"),
  model: yup.string().required("Model is required"),
  manufactureYear: yup.string().required("Manufacture Year is required"),
  milage: yup.number().required("Milage is required"),
  age: yup.number().required("Age is required"),
  status: yup.string().required("Status is required"), //list
  purchaseDate: yup.string().required("Purchase Date is required"),
  rentStartDate: yup.string().required("Rent start date is required"),
  rentEndDate: yup.string().required("Rent end date is required"),
  forkliftSerialNo: yup.string().required("Forklift serial no is required"),
  batterySerialNo: yup.string().required("Battery serial no is required"),
  year: yup.string().required("Year is required"),
});

const AddForklift: React.FC<ForkliftStackScreenProps<"AddForklift">> = ({ navigation, route }) => {
  const { mode } = route.params;
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasImages, setHasImages] = React.useState<boolean>(false);
  const [images, setImages] = React.useState<ImagePicker.ImagePickerAsset[]>([]);
  const [purchaseDate, setPurchaseDate] = React.useState<Date>(new Date());
  const [showPurchaseDatePicker, setShowPurchaseDatePicker] = React.useState(false);
  const [rentStartDate, setRentStartDate] = React.useState<Date>(new Date());
  const [showRentStartDatePicker, setShowRentStartDatePicker] = React.useState(false);
  const [rentEndDate, setRentEndDate] = React.useState<Date>(new Date());
  const [showRentEndDatePicker, setShowRentEndDatePicker] = React.useState(false);
  const [statusDropdownVisible, setStatusDropdownVisible] = React.useState(false);

  const statusDropDownList = [
    { label: "Moving", value: "moving" },
    { label: "Parked", value: "parked" },
    { label: "Offline", value: "offline" },
    { label: "Faulty", value: "faulty" },
  ];

  const form = useFormik<IForm>({
    initialValues: {
      name: "",
      simNo: "",
      imei: "",
      regNo: "",
      color: "",
      make: "",
      model: "",
      manufactureYear: "",
      milage: 0,
      age: 0,
      status: "parked",
      purchaseDate: moment().format("YYYY-MM-DD"),
      rentStartDate: moment().format("YYYY-MM-DD"),
      rentEndDate: moment().format("YYYY-MM-DD"),
      forkliftSerialNo: "",
      batterySerialNo: "",
      year: "",
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
    validationSchema: schema,
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
  React.useEffect(() => {
    form.setValues((prev) => ({
      ...prev,
      purchaseDate: moment(purchaseDate).format("YYYY-MM-DD"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseDate]);
  React.useEffect(() => {
    form.setValues((prev) => ({
      ...prev,
      rentStartDate: moment(rentStartDate).format("YYYY-MM-DD"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rentStartDate]);
  React.useEffect(() => {
    form.setValues((prev) => ({ ...prev, rentEndDate: moment(rentEndDate).format("YYYY-MM-DD") }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rentEndDate]);

  React.useEffect(() => {
    if (route.params.mode === "add") return;
    const { mode, item, _id } = route.params;
    form.setValues((prev) => ({
      ...prev,
      name: item.name || "",
      simNo: item.simNo || "",
      imei: item.imei || "",
      regNo: item.regNo || "",
      color: item.color || "",
      make: item.make || "",
      model: item.model || "",
      manufactureYear: item.manufactureYear || "",
      milage: parseInt(item.milage) || 0,
      age: parseInt(item.age) || 0,
      status: item.status || "parked",
      purchaseDate: item.purchaseDate || moment().format("YYYY-MM-DD"),
      rentStartDate: item.rentStartDate || moment().format("YYYY-MM-DD"),
      rentEndDate: item.rentEndDate || moment().format("YYYY-MM-DD"),
      forkliftSerialNo: item.forkliftSerialNo || "",
      batterySerialNo: item.batterySerialNo || "",
      year: item.year || "",
    }));
    setImages((prev) => [{ uri: item.image, width: 125, height: 125 }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params]);

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
      <_DatePicker
        show={showRentStartDatePicker}
        setShow={setShowRentStartDatePicker}
        mode={"date"}
        date={rentStartDate}
        setDate={setRentStartDate}
      />
      <_DatePicker
        show={showRentEndDatePicker}
        setShow={setShowRentEndDatePicker}
        mode={"date"}
        date={rentEndDate}
        setDate={setRentEndDate}
      />
      <_ScrollFormLayout>
        <View style={{ rowGap: theme.spacing.xs, borderWidth: 1 }}>
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
          <_TextInput
            value={form.values.imei}
            label={"BlackBox IMEI No."}
            onBlur={form.handleBlur("imei")}
            onChangeText={form.handleChange("imei")}
            error={form.errors?.imei && form.touched?.imei ? true : false}
            errorText={form.errors?.imei}
          />
          <_TextInput
            value={form.values.simNo}
            label={"Sim No."}
            onBlur={form.handleBlur("simNo")}
            onChangeText={form.handleChange("simNo")}
            error={form.errors?.simNo && form.touched?.simNo ? true : false}
            errorText={form.errors?.simNo}
          />
          <_Divider title="General Info" />

          <_TextInput
            value={form.values.regNo}
            label={"Registration No."}
            onBlur={form.handleBlur("regNo")}
            onChangeText={form.handleChange("regNo")}
            error={form.errors?.regNo && form.touched?.regNo ? true : false}
            errorText={form.errors?.regNo}
          />
          <_Dropdown
            theme={PaperTheme}
            dropDownItemTextStyle={{ ...gStyles.descText }}
            dropDownItemSelectedTextStyle={{
              ...gStyles.descTextPrimary,
            }}
            mode="outlined"
            label="Person"
            value={form.values.status}
            visible={statusDropdownVisible}
            showDropDown={() => setStatusDropdownVisible(true)}
            onDismiss={() => setStatusDropdownVisible(false)}
            setValue={(value) => {
              console.log(value);
              form.setValues((prev) => ({ ...prev, status: value }));
            }}
            list={statusDropDownList}
          />
          <_TextInput
            value={form.values.simNo}
            label={"Sim No."}
            onBlur={form.handleBlur("simNo")}
            onChangeText={form.handleChange("simNo")}
            error={form.errors?.simNo && form.touched?.simNo ? true : false}
            errorText={form.errors?.simNo}
          />
          <_TextInput
            value={form.values.color}
            label={"Color"}
            onBlur={form.handleBlur("color")}
            onChangeText={form.handleChange("color")}
            error={form.errors?.color && form.touched?.color ? true : false}
            errorText={form.errors?.color}
          />
          <_TextInput
            value={form.values.make}
            label={"Make"}
            onBlur={form.handleBlur("make")}
            onChangeText={form.handleChange("make")}
            error={form.errors?.make && form.touched?.make ? true : false}
            errorText={form.errors?.make}
          />
          <_TextInput
            value={form.values.model}
            label={"Model"}
            onBlur={form.handleBlur("model")}
            onChangeText={form.handleChange("model")}
            error={form.errors?.model && form.touched?.model ? true : false}
            errorText={form.errors?.model}
          />
          <_TextInput
            value={form.values.manufactureYear}
            label={"Manufactured Year"}
            onBlur={form.handleBlur("manufactureYear")}
            onChangeText={form.handleChange("manufactureYear")}
            error={form.errors?.manufactureYear && form.touched?.manufactureYear ? true : false}
            errorText={form.errors?.manufactureYear}
          />
          <_TextInput
            value={form.values.milage.toString()}
            label={"Milage"}
            onBlur={form.handleBlur("milage")}
            onChangeText={form.handleChange("milage")}
            error={form.errors?.milage && form.touched?.milage ? true : false}
            errorText={form.errors?.milage}
            keyboardType="numeric"
          />
          <_TextInput
            value={form.values.age.toString()}
            label={"Age"}
            onBlur={form.handleBlur("age")}
            onChangeText={form.handleChange("age")}
            error={form.errors?.age && form.touched?.age ? true : false}
            errorText={form.errors?.age}
            keyboardType="numeric"
          />
          <_Divider title="Maintenance Info" />
          <_TextInput
            editable={false}
            value={form.values.purchaseDate}
            label={"Purchase Date"}
            onBlur={form.handleBlur("purchaseDate")}
            onChangeText={form.handleChange("purchaseDate")}
            error={form.errors?.purchaseDate && form.touched?.purchaseDate ? true : false}
            errorText={form.errors?.purchaseDate}
            right={
              <TextInput.Icon
                icon="calendar"
                color={colors.iconGray}
                onPress={() => setShowPurchaseDatePicker(true)}
              />
            }
          />
          <_TextInput
            editable={false}
            value={form.values.rentStartDate}
            label={"Rent Start Date"}
            onBlur={form.handleBlur("rentStartDate")}
            onChangeText={form.handleChange("rentStartDate")}
            error={form.errors?.rentStartDate && form.touched?.rentStartDate ? true : false}
            errorText={form.errors?.rentStartDate}
            right={
              <TextInput.Icon
                icon="calendar"
                color={colors.iconGray}
                onPress={() => setShowRentStartDatePicker(true)}
              />
            }
          />
          <_TextInput
            editable={false}
            value={form.values.rentEndDate}
            label={"Rent End Date"}
            onBlur={form.handleBlur("rentEndDate")}
            onChangeText={form.handleChange("rentEndDate")}
            error={form.errors?.rentEndDate && form.touched?.rentEndDate ? true : false}
            errorText={form.errors?.rentEndDate}
            right={
              <TextInput.Icon
                icon="calendar"
                color={colors.iconGray}
                onPress={() => setShowRentEndDatePicker(true)}
              />
            }
          />
          <_TextInput
            value={form.values.forkliftSerialNo}
            label={"Forklift Serial No."}
            onBlur={form.handleBlur("forkliftSerialNo")}
            onChangeText={form.handleChange("forkliftSerialNo")}
            error={form.errors?.forkliftSerialNo && form.touched?.forkliftSerialNo ? true : false}
            errorText={form.errors?.forkliftSerialNo}
          />
          <_TextInput
            value={form.values.batterySerialNo}
            label={"Battery Serial No."}
            onBlur={form.handleBlur("batterySerialNo")}
            onChangeText={form.handleChange("batterySerialNo")}
            error={form.errors?.batterySerialNo && form.touched?.batterySerialNo ? true : false}
            errorText={form.errors?.batterySerialNo}
          />
          <_TextInput
            value={form.values.year}
            label={"Year"}
            onBlur={form.handleBlur("year")}
            onChangeText={form.handleChange("year")}
            error={form.errors?.year && form.touched?.year ? true : false}
            errorText={form.errors?.year}
            keyboardType="numeric"
          />
          <View style={screenStyles.formSubmitButtonContainer}>
            <Button
              theme={PaperTheme}
              mode="contained"
              onPress={form.handleSubmit}
              labelStyle={StyleSheet.compose(gStyles.tblHeaderText, { color: colors.white })}
            >
              {mode === "add" ? "Add" : "Update"}
            </Button>
          </View>
        </View>
      </_ScrollFormLayout>
    </SafeAreaView>
  );
};

export { AddForklift };
