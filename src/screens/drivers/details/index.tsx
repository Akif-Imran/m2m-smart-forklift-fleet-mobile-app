import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { EvilIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { _DefaultCard, _ScrollFormLayout } from "@components";
import { faker } from "@faker-js/faker";
import { DriverStackScreenProps } from "@navigation-types";
import { colors } from "@theme";
import { handleOpenWebsite } from "@utility";
import moment from "moment";

interface OwnProps {}

const DriverDetails: React.FC<DriverStackScreenProps<"DriverDetails">> = ({
  navigation,
  route,
}) => {
  const { item, _id } = route.params;

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <_ScrollFormLayout>
        <>
          <View style={screenStyles.singleImgContainer}>
            <Image source={{ uri: item.image }} style={screenStyles.imgStyle} />
          </View>
          <_DefaultCard>
            <View>
              <Text style={screenStyles.detailsCardHeadingText}>Identification Info</Text>
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
              <Text style={screenStyles.tblDescText}>{item.touchId}</Text>
            </View>
          </_DefaultCard>
          <_DefaultCard>
            <View>
              <Text style={screenStyles.detailsCardHeadingText}>Driver Info</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Email</Text>
              <TouchableOpacity
                style={screenStyles.linkButton}
                onPress={() => handleOpenWebsite(`mailto:${item.email}`)}
                activeOpacity={0.7}
              >
                <Text style={[screenStyles.tblDescText, screenStyles.linkText]}>{item.email}</Text>
                <EvilIcons name="external-link" size={16} color={colors.info} />
              </TouchableOpacity>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Password</Text>
              <Text style={screenStyles.tblDescText}>{123456}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Department</Text>
              <Text style={screenStyles.tblDescText}>{item.department}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Mobile No.</Text>
              <Text style={screenStyles.tblDescText}>{faker.phone.number("+60 ### ### ####")}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Joining Date</Text>
              <Text style={screenStyles.tblDescText}>
                {moment(faker.date.past().toJSON()).format("DD MMM, YYYY")}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Experience</Text>
              <Text style={screenStyles.tblDescText}>{faker.number.int({ min: 3, max: 8 })}</Text>
            </View>
          </_DefaultCard>
          <_DefaultCard>
            <View>
              <Text style={screenStyles.detailsCardHeadingText}>License Info</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Type</Text>
              <Text style={screenStyles.tblDescText}>
                {faker.helpers.arrayElement([
                  "CDL",
                  "IDP",
                  "Class A",
                  "Class B",
                  "Class C",
                  "Class M",
                ])}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>No.</Text>
              <Text style={screenStyles.tblDescText}>
                {faker.string.alphanumeric({ length: 14, casing: "upper" })}
              </Text>
            </View>
          </_DefaultCard>
        </>
      </_ScrollFormLayout>
    </SafeAreaView>
  );
};

export { DriverDetails };
