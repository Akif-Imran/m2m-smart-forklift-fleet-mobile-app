import { Text, View } from "react-native";
import React from "react";
import { ProfileSettingsStackScreenProps } from "@navigation-types";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Card } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../../theme";

const Help: React.FC<ProfileSettingsStackScreenProps<"Help">> = ({}) => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView style={styles.scrollContainer}>
        <Card elevation={0} style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="phone" size={50} color={colors.primary} />
            </View>
            <Text style={[styles.title, styles.spacing]}>Let's Speak</Text>
            <Text style={[styles.paragraph, styles.spacing]}>
              Need Help? Just pick up the phone to chat with a member of our team.
            </Text>
            <Text style={[styles.title, styles.contactInfo, styles.spacing]}>+ 60 196 638982</Text>
          </View>
        </Card>

        <Card elevation={0} style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="mail" size={50} color={colors.primary} />
            </View>
            <Text style={[styles.title, styles.spacing]}>Email Us</Text>
            <Text style={[styles.paragraph, styles.spacing]}>
              You can reach out to by emailing us. We'll be sure to get back to you soon.
            </Text>
            <Text style={[styles.title, styles.contactInfo, styles.spacing]}>
              support@m2m-network.com
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export { Help };
