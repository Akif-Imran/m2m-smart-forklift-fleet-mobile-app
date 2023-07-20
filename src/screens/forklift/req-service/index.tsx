/* eslint-disable camelcase */
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { screenStyles } from "@screen-styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Spinner from "react-native-loading-spinner-overlay";
import { AntDesign } from "@expo/vector-icons";
import {
  _Divider,
  _DropDown,
  _ScrollFormLayout,
  _TextInput,
} from "@components";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import * as ImagePicker from "expo-image-picker";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { ToastService } from "@utility";
import * as yup from "yup";
import { useFormik } from "formik";
import moment from "moment";
import { Button } from "react-native-paper";
import { addService, getServiceTypes } from "@services";
import { useAuthContext } from "@context";

interface IForm {
  type: string;
  description: string;
}

const schema: yup.ObjectSchema<IForm> = yup.object().shape({
  type: yup.string().required("Please select a type"),
  description: yup.string().required("Description is required"),
});

const RequestService: React.FC<ForkliftStackScreenProps<"ReqService">> = ({
  navigation,
}) => {
  const {
    state: { token },
  } = useAuthContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [date, _setDate] = React.useState<Date>(new Date());
  const [_hasImages, setHasImages] = React.useState<boolean>(false);
  const [images, setImages] = React.useState<ImagePicker.ImagePickerAsset[]>(
    []
  );
  const [typeDropdownVisible, setTypeDropdownVisible] = React.useState(false);

  const [typeDropDownList, setTypeDropDownList] = React.useState([
    { label: "Breakdown", value: "breakdown" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Warranty", value: "warranty" },
  ]);

  const form = useFormik<IForm>({
    initialValues: {
      description: "",
      type: "",
    },
    onSubmit: (values, helpers) => {
      console.log(values);
      setIsLoading(true);
      const pictures: string[] = [];
      if (images) {
        images.forEach((item) => {
          if (item?.base64) {
            pictures.push(item.base64);
          }
        });
      }
      addService(token, {
        //TODO - change this to vehicle id pass parameter from previous screen.
        vehicle_id: 1,
        type_id: parseInt(values.type, 10),
        description: values.description,
        pictures: pictures,
        service_date: moment().utc().toJSON(),
      })
        .then((res) => {
          console.log(res);
          ToastService.show("Service Request added successfully");
        })
        .catch((_err) => {
          ToastService.show("Error occurred");
        })
        .finally(() => {
          setIsLoading(false);
          helpers.resetForm();
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

  const fetchServiceTypes = React.useCallback(() => {
    getServiceTypes(token)
      .then((res) => {
        if (res.success) {
          const types = res.data.map((item) => {
            return { label: item.type_name, value: item.id.toString() };
          });
          console.log(types);
          setTypeDropDownList(types);
        }
      })
      .catch((_err) => {
        ToastService.show("Error occurred");
      });
  }, [token]);

  React.useEffect(() => {
    fetchServiceTypes();
  }, [fetchServiceTypes]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <Spinner
        visible={isLoading}
        cancelable={false}
        animation="fade"
        size="large"
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
          <_Divider title="Date/Time Info" />
          <View style={screenStyles.fieldContainer}>
            <Text style={screenStyles.tblHeaderText}>Request Date/Time</Text>
            <Text style={screenStyles.tblDescText}>
              {moment(date).format("DD MMM, YYYY hh:mm A")}
            </Text>
          </View>
          <_Divider title="Service Info" />
          <_DropDown
            theme={PaperTheme}
            dropDownItemTextStyle={{ ...gStyles.descText }}
            dropDownItemSelectedTextStyle={{
              ...gStyles.descTextPrimary,
            }}
            mode="outlined"
            label="Type"
            value={form.values.type}
            visible={typeDropdownVisible}
            showDropDown={() => setTypeDropdownVisible(true)}
            onDismiss={() => setTypeDropdownVisible(false)}
            setValue={(value) => {
              console.log(value);
              form.setValues((prev) => ({ ...prev, type: value }));
            }}
            list={typeDropDownList}
          />
          <_TextInput
            multiline={true}
            numberOfLines={4}
            value={form.values.description}
            label={"Description"}
            onBlur={form.handleBlur("description")}
            onChangeText={form.handleChange("description")}
            error={
              form.errors?.description && form.touched?.description
                ? true
                : false
            }
            errorText={form.errors?.description}
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
              Request
            </Button>
          </View>
        </View>
      </_ScrollFormLayout>
    </SafeAreaView>
  );
};

export { RequestService };
