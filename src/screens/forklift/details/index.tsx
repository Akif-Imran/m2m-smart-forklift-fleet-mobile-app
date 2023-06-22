import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { NoIconHeader, _DefaultCard } from "@components";
import { SafeAreaView } from "react-native-safe-area-context";
import { ForkliftStackScreenProps } from "@navigation-types";
import { screenStyles } from "src/screens/styles";
import { colors, gStyles, theme } from "@theme";
import { ForkliftStatusColor } from "@constants";
import { truncateText } from "@utility";
import { FAB } from "react-native-paper";

interface OwnProps {}

const ForkLiftDetails: React.FC<ForkliftStackScreenProps<"ForkLiftDetails">> = ({
  navigation,
  route,
}) => {
  const { _id, item } = route.params;

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <NoIconHeader title="Details" />
      <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing.xl }}>
        <View
          style={{
            // borderWidth: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Image source={{ uri: item.image }} style={styles.imgStyle} />
        </View>
        <_DefaultCard>
          <View>
            <Text style={screenStyles.detailsCardHeadingText}>General Info</Text>
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
            <Text style={screenStyles.tblDescText}>{item.manufactureYear}</Text>
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
            <Text style={screenStyles.detailsCardHeadingText}>Maintenance Info</Text>
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
            <Text style={screenStyles.tblHeaderText}>Forklift Serial No.</Text>
            <Text style={screenStyles.tblDescText}>{item.forkliftSerialNo}</Text>
          </View>
          <View style={screenStyles.fieldContainer}>
            <Text style={screenStyles.tblHeaderText}>Battery Serial No.</Text>
            <Text style={screenStyles.tblDescText}>{item.batterySerialNo}</Text>
          </View>
          <View style={screenStyles.fieldContainer}>
            <Text style={screenStyles.tblHeaderText}>Year</Text>
            <Text style={screenStyles.tblDescText}>{item.year}</Text>
          </View>
        </_DefaultCard>
      </ScrollView>
      <FAB
        icon="pencil"
        style={gStyles.fab}
        color={colors.white}
        onPress={() => navigation.navigate("AddForklift")}
      />
    </SafeAreaView>
  );
};

export { ForkLiftDetails };
