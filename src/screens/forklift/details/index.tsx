import { Image, Text, View } from "react-native";
import React from "react";
import { _DefaultCard, _ScrollFormLayout } from "@components";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { screenStyles } from "@screen-styles";
import { colors, gStyles } from "@theme";
import { FAB } from "react-native-paper";
import { BASE_URL } from "@api";
import { FORMAT_DATE_DD_MM_YYYY } from "@utility";
import { useAuthContext } from "@context";

const ForkLiftDetails: React.FC<
  ForkliftStackScreenProps<"ForkLiftDetails">
> = ({ navigation, route }) => {
  const { item } = route.params;
  const {
    state: { isAdmin },
  } = useAuthContext();

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <_ScrollFormLayout>
        <>
          <View style={screenStyles.singleImgContainer}>
            {item.picture ? (
              <Image
                source={{ uri: `${BASE_URL}${item.picture}` }}
                style={screenStyles.imgStyle}
              />
            ) : (
              <Image
                source={require("../../../assets/images/user.png")}
                style={screenStyles.imgStyle}
              />
            )}
          </View>
          <_DefaultCard>
            <View>
              <Text style={screenStyles.detailsCardHeadingText}>
                General Info
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>RegNo.</Text>
              <Text style={screenStyles.tblDescText}>{item.reg_no}</Text>
            </View>
            {/* <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Status</Text>
              <Text
                style={StyleSheet.compose(
                  StyleSheet.compose(screenStyles.badgeText, {
                    marginHorizontal: theme.spacing.none,
                  }),
                  {
                    backgroundColor: ForkliftStatusColor[item],
                  }
                )}
              >
                {item.status}
              </Text>
            </View> */}
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Color</Text>
              <Text style={screenStyles.tblDescText}>{item.color}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Make</Text>
              <Text style={screenStyles.tblDescText}>{item.make}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Model</Text>
              <Text style={screenStyles.tblDescText}>{item.model}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Manufactured Year</Text>
              <Text style={screenStyles.tblDescText}>{item.year}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Milage</Text>
              <Text style={screenStyles.tblDescText}>{item?.mileage || 0}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Age</Text>
              <Text style={screenStyles.tblDescText}>{item.age}</Text>
            </View>
          </_DefaultCard>
          <_DefaultCard>
            <View>
              <Text style={screenStyles.detailsCardHeadingText}>
                Maintenance Info
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Purchase Date</Text>
              <Text style={screenStyles.tblDescText}>
                {FORMAT_DATE_DD_MM_YYYY(item.purchase_date)}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Rent Start Date</Text>
              <Text style={screenStyles.tblDescText}>
                {FORMAT_DATE_DD_MM_YYYY(item.rent_start_date)}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Rent End Date</Text>
              <Text style={screenStyles.tblDescText}>
                {FORMAT_DATE_DD_MM_YYYY(item.rent_end_date)}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>
                Forklift Serial No.
              </Text>
              <Text style={screenStyles.tblDescText}>{item.serial_number}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Battery Serial No.</Text>
              <Text style={screenStyles.tblDescText}>
                {item.battery_serial_number}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Fuel Type</Text>
              <Text style={screenStyles.tblDescText}>
                {item.fuel_type_name}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Fuel Capacity</Text>
              <Text style={screenStyles.tblDescText}>{item.fuel_capacity}</Text>
            </View>
          </_DefaultCard>

          <_DefaultCard>
            <View>
              <Text style={screenStyles.detailsCardHeadingText}>
                Insurance Info
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Company</Text>
              <Text style={screenStyles.tblDescText}>
                {item.insurance_company}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Contact</Text>
              <Text style={screenStyles.tblDescText}>
                {item.insurance_company_contact}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Type</Text>
              <Text style={screenStyles.tblDescText}>
                {item.insurance_type}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>No.</Text>
              <Text style={screenStyles.tblDescText}>
                {item.insurance_number}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Expiry Date</Text>
              <Text style={screenStyles.tblDescText}>
                {FORMAT_DATE_DD_MM_YYYY(item.insurance_expiry_date)}
              </Text>
            </View>
          </_DefaultCard>
        </>
      </_ScrollFormLayout>
      {isAdmin && (
        <FAB
          icon="pencil"
          style={gStyles.fab}
          color={colors.white}
          onPress={() =>
            navigation.navigate("AddForklift", {
              mode: "edit",
              item: item,
              _id: item.id.toString(),
            })
          }
        />
      )}
    </SafeAreaView>
  );
};

export { ForkLiftDetails };
