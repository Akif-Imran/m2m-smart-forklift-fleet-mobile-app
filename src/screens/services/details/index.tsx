import { Image, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { _DefaultCard, _ScrollFormLayout } from "@components";
import type { ServiceStackScreenProps } from "@navigation-types";
import { ScrollView } from "react-native-gesture-handler";
import { faker } from "@faker-js/faker";
import moment from "moment";
import { FAB } from "react-native-paper";
import { colors, gStyles, theme } from "@theme";

const ServiceDetails: React.FC<ServiceStackScreenProps<"ServiceDetails">> = ({
  navigation,
  route,
}) => {
  const { item } = route.params;

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <_ScrollFormLayout>
        <>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
            contentContainerStyle={{ gap: theme.spacing.sm }}
          >
            <Image
              source={{ uri: faker.image.url() }}
              style={screenStyles.imgStyle}
            />
            <Image
              source={{ uri: faker.image.url() }}
              style={screenStyles.imgStyle}
            />
          </ScrollView>
          <_DefaultCard>
            <View>
              <Text style={screenStyles.detailsCardHeadingText}>
                Service Info
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Registration No.</Text>
              <Text style={screenStyles.tblDescText}>{item.regNo}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Status</Text>
              <Text style={screenStyles.tblDescText}>{item.status}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Request Date</Text>
              <Text style={screenStyles.tblDescText}>
                {moment(item.date).format("DD MMM, YYYY hh:mm A")}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Service Type</Text>
              <Text style={screenStyles.tblDescText}>
                {item.type.toUpperCase()}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Description</Text>
              <Text style={screenStyles.tblDescText}>{item.description}</Text>
            </View>
          </_DefaultCard>
        </>
      </_ScrollFormLayout>
      <FAB
        icon="plus"
        style={gStyles.fab}
        color={colors.white}
        onPress={() => navigation.navigate("")}
      />
    </SafeAreaView>
  );
};

export { ServiceDetails };
