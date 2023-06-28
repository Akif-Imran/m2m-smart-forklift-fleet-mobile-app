import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { _DefaultCard, _ScrollFormLayout } from "@components";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { screenStyles } from "src/screens/styles";
import { colors, gStyles, theme } from "@theme";
import { ForkliftStatusColor } from "@constants";
import { FAB } from "react-native-paper";

const ForkLiftDetails: React.FC<
  ForkliftStackScreenProps<"ForkLiftDetails">
> = ({ navigation, route }) => {
  const { item } = route.params;

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <_ScrollFormLayout>
        <>
          <View style={screenStyles.singleImgContainer}>
            <Image source={{ uri: item.image }} style={screenStyles.imgStyle} />
          </View>
          <_DefaultCard>
            <View>
              <Text style={screenStyles.detailsCardHeadingText}>
                General Info
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>RegNo.</Text>
              <Text style={screenStyles.tblDescText}>{item.regNo}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Status</Text>
              <Text
                style={StyleSheet.compose(
                  StyleSheet.compose(screenStyles.badgeText, {
                    marginHorizontal: theme.spacing.none,
                  }),
                  {
                    backgroundColor: ForkliftStatusColor[item.status],
                  }
                )}
              >
                {item.status}
              </Text>
            </View>
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
              <Text style={screenStyles.tblDescText}>
                {item.manufactureYear}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Milage</Text>
              <Text style={screenStyles.tblDescText}>{item.milage}</Text>
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
              <Text style={screenStyles.tblDescText}>{item.purchaseDate}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Rent Start Date</Text>
              <Text style={screenStyles.tblDescText}>{item.rentStartDate}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Rent End Date</Text>
              <Text style={screenStyles.tblDescText}>{item.rentEndDate}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>
                Forklift Serial No.
              </Text>
              <Text style={screenStyles.tblDescText}>
                {item.forkliftSerialNo}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Battery Serial No.</Text>
              <Text style={screenStyles.tblDescText}>
                {item.batterySerialNo}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Fuel Type</Text>
              <Text style={screenStyles.tblDescText}>{item.fuelType}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Fuel Capacity</Text>
              <Text style={screenStyles.tblDescText}>{item.fuelCapacity}</Text>
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
                {item.insuranceCompany}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Type</Text>
              <Text style={screenStyles.tblDescText}>{item.insuranceType}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>No.</Text>
              <Text style={screenStyles.tblDescText}>{item.insuranceNo}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Expiry Date</Text>
              <Text style={screenStyles.tblDescText}>
                {item.insuranceExpiryDate}
              </Text>
            </View>
          </_DefaultCard>
        </>
      </_ScrollFormLayout>
      <FAB
        icon="pencil"
        style={gStyles.fab}
        color={colors.white}
        onPress={() =>
          navigation.navigate("AddForklift", {
            mode: "edit",
            item: item,
            _id: item._id,
          })
        }
      />
    </SafeAreaView>
  );
};

export { ForkLiftDetails };
