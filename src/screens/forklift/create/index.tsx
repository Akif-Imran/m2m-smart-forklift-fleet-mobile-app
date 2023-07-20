/* eslint-disable camelcase */
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Spinner from "react-native-loading-spinner-overlay";
import {
  _DatePicker,
  _Divider,
  _DropDown,
  _ScrollFormLayout,
  _TextInput,
} from "@components";
import { screenStyles } from "@screen-styles";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { ToastService } from "@utility";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import * as yup from "yup";
import type { FormikHelpers } from "formik";
import { useFormik } from "formik";
import moment from "moment";
import { Button, TextInput } from "react-native-paper";
import { baseURL } from "@api";
import {
  addDevice,
  addVehicle,
  getDevicesList,
  getFuelTypes,
  updateVehicle,
} from "@services";
import { useAuthContext } from "@context";
import { mapMarkers } from "@map-markers";

interface IForm extends Omit<AddVehicleRequest, "device_id" | "fuel_type_id"> {
  sim_no: string;
  IMEI: string;
  fuel_type_id: string;
}
const schema: yup.ObjectSchema<IForm> = yup.object().shape({
  IMEI: yup.string().required("IMEI is required"),
  sim_no: yup.string().required("Sim Number is required"),
  reg_no: yup.string().required("Registration Number is required"),
  color: yup.string().required("Color is required"),
  make: yup.string().required("Make is required"),
  model: yup.string().required("Model is required"),
  year: yup.number().required("Manufacture Year is required"),
  mileage: yup.string().required("Milage is required"),
  age: yup.string().required("Age is required"),
  // status: yup.string().required("Status is required"), //list
  purchase_date: yup.string().required("Purchase Date is required"),
  rent_start_date: yup.string().required("Rent start date is required"),
  rent_end_date: yup.string().required("Rent end date is required"),
  serial_number: yup.string().required("Forklift serial no is required"),
  battery_serial_number: yup.string().required("Battery serial no is required"),
  fuel_type_id: yup.string().required("Fuel type is required"),
  fuel_capacity: yup.string().required("Fuel capacity is required"),
  insurance_company: yup.string().required("Insurance company is required"),
  insurance_number: yup.string().required("Insurance no is required"),
  insurance_type: yup.string().required("Insurance type is required"),
  insurance_expiry_date: yup
    .string()
    .required("Insurance expiry date is required"),
  icon: yup.string().required("Year is required"),
});

const AddForklift: React.FC<ForkliftStackScreenProps<"AddForklift">> = ({
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
  const [purchaseDate, setPurchaseDate] = React.useState<Date>(new Date());
  const [showPurchaseDatePicker, setShowPurchaseDatePicker] =
    React.useState(false);
  const [rentStartDate, setRentStartDate] = React.useState<Date>(new Date());
  const [showRentStartDatePicker, setShowRentStartDatePicker] =
    React.useState(false);
  const [rentEndDate, setRentEndDate] = React.useState<Date>(new Date());
  const [showRentEndDatePicker, setShowRentEndDatePicker] =
    React.useState(false);
  const [insuranceExpiryDate, setInsuranceExpiryDate] = React.useState<Date>(
    new Date()
  );
  const [showInsuranceExpiryDatePicker, setShowInsuranceExpiryDatePicker] =
    React.useState(false);
  /*   const [statusDropdownVisible, setStatusDropdownVisible] =
    React.useState(false); */
  const [fuelTypeDropdownVisible, setFuelTypeDropdownVisible] =
    React.useState(false);

  const [fuelTypeList, setFuelTypeList] = React.useState<
    { label: string; value: string }[]
  >([]);
  /*   const statusDropDownList = [
    { label: "Moving", value: "moving" },
    { label: "Parked", value: "parked" },
    { label: "Offline", value: "offline" },
    { label: "Faulty", value: "faulty" },
  ]; */

  const form = useFormik<IForm>({
    initialValues: {
      sim_no: "",
      IMEI: "",
      reg_no: "",
      color: "",
      make: "",
      model: "",
      year: 0,
      mileage: "0",
      age: "0",
      // status: "parked",
      purchase_date: moment().format("YYYY-MM-DD"),
      rent_start_date: moment().format("YYYY-MM-DD"),
      rent_end_date: moment().format("YYYY-MM-DD"),
      serial_number: "",
      battery_serial_number: "",
      fuel_capacity: "",
      fuel_type_id: "0",
      insurance_company: "",
      insurance_number: "",
      insurance_type: "",
      insurance_expiry_date: "",
      icon: mapMarkers["marker-pin"].name,
    },
    onSubmit: (values, helpers) => {
      console.log(values);
      if (mode === "add") {
        createVehicle(values, helpers);
      } else {
        editVehicle(values, helpers);
      }
    },
    validationSchema: schema,
  });

  const createVehicle = (values: IForm, helpers: FormikHelpers<IForm>) => {
    setIsLoading(true);
    addDevice(token, {
      device_type_id: 1,
      IMEI: values.IMEI,
      sim_no: values.sim_no,
    })
      .then((device) => {
        ToastService.show(device?.message || "");
        console.log("device", device);
        addVehicle(token, {
          //@ts-expect-error device returned when already in database so success is false.
          device_id: device.data.id,
          reg_no: values.reg_no,
          color: values.color,
          make: values.make,
          model: values.model,
          purchase_date: values.purchase_date,
          rent_start_date: values.rent_start_date,
          rent_end_date: values.rent_end_date,
          serial_number: values.serial_number,
          battery_serial_number: values.battery_serial_number,
          year: values.year,
          age: values.age,
          mileage: values.mileage,
          fuel_type_id: parseInt(values.fuel_type_id, 10),
          fuel_capacity: values.fuel_capacity,
          insurance_company: values.insurance_company,
          insurance_number: values.insurance_number,
          insurance_type: values.insurance_type,
          insurance_expiry_date: values.insurance_expiry_date,
          icon: values.icon,
        })
          .then((res) => {
            ToastService.show(res?.message || "");
            helpers.resetForm();
            navigation.goBack();
          })
          .catch((_err) => {
            console.log(_err?.message);
            ToastService.show("Error occurred!");
          });
      })
      .catch((_err) => {
        ToastService.show("Device error occurred");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const editVehicle = (values: IForm, helpers: FormikHelpers<IForm>) => {
    setIsLoading(true);
    addDevice(token, {
      device_type_id: 1,
      IMEI: values.IMEI,
      sim_no: values.sim_no,
    })
      .then((device) => {
        console.log("res add Device", device);
        console.log("device", device);
        // if (device.success) {
        updateVehicle(token, {
          id: mode === "edit" ? route.params.item.id : 0,
          //@ts-expect-error device returned when already in database so success is false.
          device_id: device.data.id,
          reg_no: values.reg_no,
          color: values.color,
          make: values.make,
          model: values.model,
          purchase_date: values.purchase_date,
          rent_start_date: values.rent_start_date,
          rent_end_date: values.rent_end_date,
          serial_number: values.serial_number,
          battery_serial_number: values.battery_serial_number,
          year: values.year,
          age: values.age,
          mileage: values.mileage,
          fuel_type_id: parseInt(values.fuel_type_id, 10),
          fuel_capacity: values.fuel_capacity,
          insurance_company: values.insurance_company,
          insurance_number: values.insurance_number,
          insurance_type: values.insurance_type,
          insurance_expiry_date: values.insurance_expiry_date,
          icon: values.icon,
        })
          .then((res) => {
            console.log("res update Vehicle", res);
            ToastService.show(res?.message || "");
            helpers.resetForm();
            navigation.goBack();
          })
          .catch((_err) => {
            ToastService.show("Error occurred!");
          });
        // }
      })
      .catch((_err) => {
        ToastService.show("Device error occurred");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
      purchase_date: moment(purchaseDate).format("YYYY-MM-DD"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseDate]);

  React.useEffect(() => {
    form.setValues((prev) => ({
      ...prev,
      rent_start_date: moment(rentStartDate).format("YYYY-MM-DD"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rentStartDate]);

  React.useEffect(() => {
    form.setValues((prev) => ({
      ...prev,
      rent_end_date: moment(rentEndDate).format("YYYY-MM-DD"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rentEndDate]);

  React.useEffect(() => {
    form.setValues((prev) => ({
      ...prev,
      insurance_expiry_date: moment(insuranceExpiryDate).format("YYYY-MM-DD"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insuranceExpiryDate]);

  React.useEffect(() => {
    if (route.params.mode === "add") {
      return;
    }
    const { item } = route.params;
    setIsLoading(true);
    getDevicesList(token)
      .then((res) => {
        console.log(res);
        if (res.success) {
          const index = res.data.rows.findIndex(
            (value) => value.id === item.device_id
          );
          if (index === -1) {
            ToastService.show("Device Invalid");
            navigation.goBack();
            return;
          }
          const device = res.data.rows[index];
          form.setValues((_prev) => ({
            sim_no: device.sim_no || "",
            IMEI: device.IMEI || "",
            reg_no: item.reg_no || "",
            color: item.color || "",
            make: item.make || "",
            model: item.model || "",
            year: item.year || 0,
            mileage: item?.mileage || "",
            age: item.age,
            // status: item.status || "parked",
            purchase_date: item.purchase_date || moment().format("YYYY-MM-DD"),
            rent_start_date:
              item.rent_start_date || moment().format("YYYY-MM-DD"),
            rent_end_date: item.rent_end_date || moment().format("YYYY-MM-DD"),
            serial_number: item.serial_number || "",
            battery_serial_number: item.battery_serial_number || "",
            fuel_capacity: item.fuel_capacity || "",
            fuel_type_id: item.fuel_type_id.toString() || "",
            insurance_company: item.insurance_company || "",
            insurance_expiry_date:
              item.insurance_expiry_date || moment().format("YYYY-MM-DD"),
            insurance_number: item.insurance_number || "",
            insurance_type: item.insurance_type || "",
            icon: item.icon,
          }));
          setImages((_prev) => {
            if (!item.picture) {
              return [];
            }
            return [
              { uri: `${baseURL}${item.picture}`, width: 125, height: 125 },
            ];
          });
        } else {
          ToastService.show("Device Invalid");
          navigation.goBack();
        }
      })
      .catch((_err) => {
        ToastService.show("Device fetch error");
        console.log(_err.message);
        navigation.goBack();
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params]);

  React.useEffect(() => {
    if (!token) {
      return;
    }
    getFuelTypes(token)
      .then((res) => {
        if (res.success) {
          const list = res.data.rows.map((type) => ({
            label: type.name,
            value: type.id.toString(),
          }));
          setFuelTypeList(list);
        }
      })
      .catch((_err) => {
        ToastService.show("Error occured");
      });
  }, [token]);

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
      <_DatePicker
        show={showInsuranceExpiryDatePicker}
        setShow={setShowInsuranceExpiryDatePicker}
        mode={"date"}
        date={insuranceExpiryDate}
        setDate={setInsuranceExpiryDate}
      />
      <_ScrollFormLayout>
        <View style={{ rowGap: theme.spacing.xs }}>
          <_Divider title="Forklift Image" />
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
          {images.length > 0 ? (
            <TouchableOpacity
              style={[
                screenStyles.addedImageBtnStyle,
                screenStyles.addedImgStyle,
              ]}
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
          <_Divider title="Forklift Info" />
          {/* <_TextInput
            value={form.values.name}
            label={"Name"}
            onBlur={form.handleBlur("name")}
            onChangeText={form.handleChange("name")}
            error={form.errors?.name && form.touched?.name ? true : false}
            errorText={form.errors?.name}
          /> */}
          <_TextInput
            value={form.values.IMEI}
            label={"BlackBox IMEI No."}
            onBlur={form.handleBlur("IMEI")}
            onChangeText={form.handleChange("IMEI")}
            error={form.errors?.IMEI && form.touched?.IMEI ? true : false}
            errorText={form.errors?.IMEI}
          />
          <_TextInput
            value={form.values.sim_no}
            label={"Sim No."}
            onBlur={form.handleBlur("sim_no")}
            onChangeText={form.handleChange("sim_no")}
            error={form.errors?.sim_no && form.touched?.sim_no ? true : false}
            errorText={form.errors?.sim_no}
          />
          <_Divider title="General Info" />

          <_TextInput
            value={form.values.reg_no}
            label={"Registration No."}
            onBlur={form.handleBlur("reg_no")}
            onChangeText={form.handleChange("reg_no")}
            error={form.errors?.reg_no && form.touched?.reg_no ? true : false}
            errorText={form.errors?.reg_no}
          />
          {/* <_DropDown
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
          /> */}
          {/* <_TextInput
            value={form.values.simNo}
            label={"Sim No."}
            onBlur={form.handleBlur("simNo")}
            onChangeText={form.handleChange("simNo")}
            error={form.errors?.simNo && form.touched?.simNo ? true : false}
            errorText={form.errors?.simNo}
          /> */}
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
            value={form.values.year.toString()}
            label={"Manufactured Year"}
            onBlur={form.handleBlur("year")}
            onChangeText={form.handleChange("year")}
            error={form.errors?.year && form.touched?.year ? true : false}
            errorText={form.errors?.year}
          />
          <_TextInput
            value={form?.values?.mileage}
            label={"Milage"}
            onBlur={form.handleBlur("mileage")}
            onChangeText={form.handleChange("mileage")}
            error={form.errors?.mileage && form.touched?.mileage ? true : false}
            errorText={form.errors?.mileage}
            keyboardType="numeric"
          />
          <_TextInput
            value={form.values.age}
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
            value={form.values.purchase_date}
            label={"Purchase Date"}
            onBlur={form.handleBlur("purchase_date")}
            onChangeText={form.handleChange("purchase_date")}
            error={
              form.errors?.purchase_date && form.touched?.purchase_date
                ? true
                : false
            }
            errorText={form.errors?.purchase_date}
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
            value={form.values.rent_start_date}
            label={"Rent Start Date"}
            onBlur={form.handleBlur("rent_start_date")}
            onChangeText={form.handleChange("rent_start_date")}
            error={
              form.errors?.rent_start_date && form.touched?.rent_start_date
                ? true
                : false
            }
            errorText={form.errors?.rent_start_date}
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
            value={form.values.rent_end_date}
            label={"Rent End Date"}
            onBlur={form.handleBlur("rent_end_date")}
            onChangeText={form.handleChange("rent_end_date")}
            error={
              form.errors?.rent_end_date && form.touched?.rent_end_date
                ? true
                : false
            }
            errorText={form.errors?.rent_end_date}
            right={
              <TextInput.Icon
                icon="calendar"
                color={colors.iconGray}
                onPress={() => setShowRentEndDatePicker(true)}
              />
            }
          />
          <_TextInput
            value={form.values.serial_number}
            label={"Forklift Serial No."}
            onBlur={form.handleBlur("serial_number")}
            onChangeText={form.handleChange("serial_number")}
            error={
              form.errors?.serial_number && form.touched?.serial_number
                ? true
                : false
            }
            errorText={form.errors?.serial_number}
          />
          <_TextInput
            value={form.values.battery_serial_number}
            label={"Battery Serial No."}
            onBlur={form.handleBlur("battery_serial_number")}
            onChangeText={form.handleChange("battery_serial_number")}
            error={
              form.errors?.battery_serial_number &&
              form.touched?.battery_serial_number
                ? true
                : false
            }
            errorText={form.errors?.battery_serial_number}
          />
          <_DropDown
            theme={PaperTheme}
            dropDownItemTextStyle={{ ...gStyles.descText }}
            dropDownItemSelectedTextStyle={{
              ...gStyles.descTextPrimary,
            }}
            mode="outlined"
            label="Fuel Type"
            value={form.values.fuel_type_id}
            visible={fuelTypeDropdownVisible}
            showDropDown={() => setFuelTypeDropdownVisible(true)}
            onDismiss={() => setFuelTypeDropdownVisible(false)}
            setValue={(value) => {
              console.log(value);
              form.setValues((prev) => ({ ...prev, fuel_type_id: value }));
            }}
            list={fuelTypeList}
          />
          {/* <_TextInput
            value={form.values.fuelType}
            label={"Fuel Type"}
            onBlur={form.handleBlur("fuelType")}
            onChangeText={form.handleChange("fuelType")}
            error={
              form.errors?.fuelType && form.touched?.fuelType ? true : false
            }
            errorText={form.errors?.fuelType}
          /> */}
          <_TextInput
            value={form.values.fuel_capacity}
            label={"Fuel Capacity"}
            onBlur={form.handleBlur("fuel_capacity")}
            onChangeText={form.handleChange("fuel_capacity")}
            error={
              form.errors?.fuel_capacity && form.touched?.fuel_capacity
                ? true
                : false
            }
            errorText={form.errors?.fuel_capacity}
          />
          <_Divider title="Insurance Info" />
          <_TextInput
            value={form.values.insurance_company}
            label={"Company"}
            onBlur={form.handleBlur("insurance_company")}
            onChangeText={form.handleChange("insurance_company")}
            error={
              form.errors?.insurance_company && form.touched?.insurance_company
                ? true
                : false
            }
            errorText={form.errors?.insurance_company}
          />
          <_TextInput
            value={form.values.insurance_number}
            label={"Insurance No."}
            onBlur={form.handleBlur("insurance_number")}
            onChangeText={form.handleChange("insurance_number")}
            error={
              form.errors?.insurance_number && form.touched?.insurance_number
                ? true
                : false
            }
            errorText={form.errors?.insurance_number}
          />
          <_TextInput
            value={form.values.insurance_type}
            label={"Type"}
            onBlur={form.handleBlur("insurance_type")}
            onChangeText={form.handleChange("insurance_type")}
            error={
              form.errors?.insurance_type && form.touched?.insurance_type
                ? true
                : false
            }
            errorText={form.errors?.insurance_type}
          />
          <_TextInput
            editable={false}
            value={form.values.insurance_expiry_date}
            label={"Expiry Date"}
            onBlur={form.handleBlur("insurance_expiry_date")}
            onChangeText={form.handleChange("insurance_expiry_date")}
            error={
              form.errors?.insurance_expiry_date &&
              form.touched?.insurance_expiry_date
                ? true
                : false
            }
            errorText={form.errors?.insurance_expiry_date}
            right={
              <TextInput.Icon
                icon="calendar"
                color={colors.iconGray}
                onPress={() => setShowInsuranceExpiryDatePicker(true)}
              />
            }
          />
          <View style={screenStyles.formSubmitButtonContainer}>
            <Button
              theme={PaperTheme}
              mode="contained"
              onPress={form.handleSubmit}
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

export { AddForklift };
