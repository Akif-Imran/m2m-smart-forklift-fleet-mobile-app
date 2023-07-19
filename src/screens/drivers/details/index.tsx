import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { EvilIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import {
  _DefaultCard,
  _ListEmptyComponent,
  _ScrollFormLayout,
} from "@components";
import type { DriverStackScreenProps } from "@navigation-types";
import { colors, gStyles } from "@theme";
import { handleOpenWebsite } from "@utility";
import moment from "moment";
import { FAB } from "react-native-paper";
import { baseURL } from "@api";
import { getAssignedVehicles, getDriverById } from "@services";
import { useAuthContext } from "@context";
import { useIsFocused } from "@react-navigation/native";

const DriverDetails: React.FC<DriverStackScreenProps<"DriverDetails">> = ({
  navigation,
  route,
}) => {
  const { item, _id } = route.params;
  const {
    state: { token },
  } = useAuthContext();
  const isFocused = useIsFocused();
  const [assignedVehicles, setAssignedVehicles] = React.useState<
    IGetAssignedVehicle[]
  >([]);

  React.useEffect(() => {
    if (!token || !_id) {
      return;
    }
    getAssignedVehicles(token, _id).then((res) => {
      if (res.success) {
        // console.log(res.data);
        setAssignedVehicles(res.data);
      }
    });
  }, [token, _id]);

  const refreshDriver = React.useCallback(() => {
    getDriverById(token, _id).then((res) => {
      if (res.success) {
        navigation.setParams({ item: { ...res.data } });
      }
    });
  }, [token, _id, navigation]);

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }
    // refreshDriver();
  }, [refreshDriver, isFocused]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <_ScrollFormLayout>
        <>
          <View style={screenStyles.singleImgContainer}>
            {item.picture ? (
              <Image
                source={{ uri: `${baseURL}${item.picture}` }}
                style={screenStyles.imgStyle}
              />
            ) : (
              <Image
                source={require("../../../assets/images/user.png")}
                resizeMode="contain"
                style={screenStyles.imgStyle}
              />
            )}
          </View>
          <_DefaultCard>
            <View>
              <Text style={screenStyles.detailsCardHeadingText}>
                Identification Info
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Name</Text>
              <Text style={screenStyles.tblDescText}>{item.name}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>IC No.</Text>
              <Text style={screenStyles.tblDescText}>{item.ic_number}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Touch ID</Text>
              <Text style={screenStyles.tblDescText}>{item.touch_id}</Text>
            </View>
          </_DefaultCard>
          <_DefaultCard>
            <View>
              <Text style={screenStyles.detailsCardHeadingText}>
                Driver Info
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Email</Text>
              <TouchableOpacity
                style={screenStyles.linkButton}
                onPress={() => handleOpenWebsite(`mailto:${item.email}`)}
                activeOpacity={0.7}
              >
                <Text style={[screenStyles.tblDescText, screenStyles.linkText]}>
                  {item.email}
                </Text>
                <EvilIcons name="external-link" size={16} color={colors.info} />
              </TouchableOpacity>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Password</Text>
              <Text style={screenStyles.tblDescText}>{item.password}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Department</Text>
              <Text style={screenStyles.tblDescText}>{item.department}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Mobile No.</Text>
              <Text style={screenStyles.tblDescText}>{item.mobile_number}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Joining Date</Text>
              <Text style={screenStyles.tblDescText}>
                {moment(item.joining_date).format("DD MMM, YYYY")}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Experience</Text>
              <Text style={screenStyles.tblDescText}>
                {item.experience_in_year}
              </Text>
            </View>
          </_DefaultCard>
          <_DefaultCard>
            <View>
              <Text style={screenStyles.detailsCardHeadingText}>
                License Info
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Type</Text>
              <Text style={screenStyles.tblDescText}>{item.license_type}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>No.</Text>
              <Text style={screenStyles.tblDescText}>
                {item.license_number}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Expiry Date</Text>
              <Text style={screenStyles.tblDescText}>
                {moment(item.license_expiry).format("DD MMM, YYYY")}
              </Text>
            </View>
          </_DefaultCard>
          <_DefaultCard>
            <View>
              <Text style={screenStyles.detailsCardHeadingText}>
                Assigned Forklifts
              </Text>
            </View>
            {assignedVehicles.length > 0 ? (
              assignedVehicles.map((vehicle) => (
                <View
                  style={screenStyles.fieldContainer}
                  key={vehicle?.vehicle_id}
                >
                  <Text style={gStyles.tblHeaderText}>
                    {vehicle?.vehicle_reg_no}
                  </Text>
                  <Text style={gStyles.tblDescText}>
                    {vehicle?.vehicle_model}-{vehicle?.vehicle_make}-
                    {vehicle?.vehicle_year}
                  </Text>
                </View>
              ))
            ) : (
              <_ListEmptyComponent
                label={"No assigned vehicles"}
                coversSpace={false}
              />
            )}
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText} />
              <Text style={screenStyles.tblDescText} />
            </View>
          </_DefaultCard>
        </>
      </_ScrollFormLayout>
      <FAB
        icon="pencil"
        style={gStyles.fab}
        color={colors.white}
        onPress={() =>
          navigation.navigate("AddDriver", {
            mode: "edit",
            _id: _id,
            item: item,
          })
        }
      />
    </SafeAreaView>
  );
};

export { DriverDetails };
