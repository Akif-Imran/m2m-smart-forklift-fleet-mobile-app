import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { _DefaultCard, _Divider } from "@components";
import { listCardStyles, screenStyles } from "@screen-styles";
import { colors, gStyles } from "@theme";
import { faker } from "@faker-js/faker";
import moment from "moment";

import { styles } from "./styles";

interface OwnProps {
  item: IDriverActivity;
  handleDelete: (activityId: string) => void;
}

const _DriverActivityCard: React.FC<OwnProps> = ({ item }) => {
  return (
    <_DefaultCard>
      <View
        style={StyleSheet.compose(listCardStyles.contentContainer, {
          backgroundColor: colors.white,
        })}
      >
        <View>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              resizeMode="cover"
              style={listCardStyles.imgStyle}
            />
          ) : (
            <Image
              source={require("../../../../assets/images/user.png")}
              resizeMode="contain"
              style={listCardStyles.imgStyle}
            />
          )}
        </View>
        <View style={listCardStyles.infoWithForward}>
          <View style={listCardStyles.infoContainer}>
            <Text style={gStyles.cardInfoTitleText}>{item.name}</Text>
            {/* <Text style={gStyles.tblHeaderText}>Phone: </Text> */}
            <Text
              style={gStyles.tblDescText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.email}
            </Text>
            <_Divider marginVertical={0.5} />
            <View style={styles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Event Type</Text>
              <Text style={screenStyles.tblDescText}>
                {faker.helpers.arrayElement(["Type 1", "Type 2", "Type 3"])}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Date/Time</Text>
              <Text style={screenStyles.tblDescText}>
                {moment(item.date).format("DD MMM, YYYY hh:mm:ss A")}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Description</Text>
              <Text style={screenStyles.tblDescText}>{item.description}</Text>
            </View>
          </View>

          <View style={listCardStyles.forwardContainer}>
            {/* <FontAwesome5 name="caret-right" size={20} color={colors.iconGray} /> */}
          </View>
        </View>
      </View>
    </_DefaultCard>
  );
};

export { _DriverActivityCard };
