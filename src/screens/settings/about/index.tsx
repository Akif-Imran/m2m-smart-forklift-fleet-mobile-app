import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ProfileSettingsStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Card } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@theme";
import { styles } from "./styles";

interface OwnProps {}

const About: React.FC<ProfileSettingsStackScreenProps<"About">> = ({ navigation, route }) => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView style={styles.scrollContainer}>
        <Card elevation={0} style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="info" size={50} color={colors.primary} />
            </View>
            <Text style={[styles.title, styles.spacing]}>About Us</Text>
            <Text style={[styles.paragraph, styles.spacing]}>
              M2M Networks is a company that specializes in providing customized solutions that
              positively impacted the business, versus solutions that were technically excellent but
              may not have delivered on key business objectives. Our investments on into product
              development some of the major holistic pain point related to software development and
              maintenance, keep us on the cutting edge of technology and well positioned to deliver
              exponential value to our client.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export { About };
