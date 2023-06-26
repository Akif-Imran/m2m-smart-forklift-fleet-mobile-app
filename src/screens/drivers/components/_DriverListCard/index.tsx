import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { _DefaultCard } from "@components";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { DriverStackScreenProps } from "@navigation-types";
import { listCardStyles, screenStyles } from "src/screens/styles";
import { PaperTheme, colors, gStyles } from "@theme";
import { truncateText } from "@utility";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { AirbnbRating } from "react-native-ratings";
import { styles } from "./styles";

interface OwnProps {
  item: IDriver;
  handleDelete: (driverId: string) => void;
}

const _DriverListCard: React.FC<OwnProps> = ({ handleDelete, item }) => {
  const navigation = useNavigation<DriverStackScreenProps<"Drivers">["navigation"]>();
  return (
    <_DefaultCard>
      <TouchableOpacity
        style={listCardStyles.contentContainer}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate("DriverDetails", {
            item: item,
            _id: item._id,
          })
        }
        onLongPress={() => handleDelete(item._id)}
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
            <Text style={gStyles.tblDescText} ellipsizeMode="tail" numberOfLines={1}>
              {item.email}
            </Text>
            <AirbnbRating
              count={5}
              starContainerStyle={styles.ratingContainer}
              defaultRating={item.rating}
              size={12}
              selectedColor={colors.warning}
              showRating={false}
              onFinishRating={(rating) => console.log(rating)}
            />
            <View>
              <Text
                style={StyleSheet.compose(screenStyles.badgeText, {
                  textAlign: "left",
                  alignSelf: "flex-start",
                })}
                ellipsizeMode="tail"
                numberOfLines={0.5}
              >
                {truncateText(item.department, 35).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={listCardStyles.forwardContainer}>
            <FontAwesome5 name="caret-right" size={20} color={colors.iconGray} />
          </View>
        </View>
      </TouchableOpacity>
      <View style={listCardStyles.bottomButtonContainer}>
        {/* <Button
          style={list_card_styles.bottomButton}
          compact={true}
          uppercase={false}
          mode={"text"}
          theme={PaperTheme}
          color={colors.titleText}
          labelStyle={StyleSheet.compose(gStyles.tblDescText, gStyles.buttonLabelTextAddOn)}
          icon={() => (
            <MaterialCommunityIcons
              name="file-multiple-outline"
              size={16}
              color={colors.titleText}
            />
          )}
          onPress={() => navigation.navigate("Reports")}
        >
          Reports
        </Button> */}
        <Button
          style={listCardStyles.bottomButton}
          compact={true}
          uppercase={false}
          mode={"text"}
          theme={PaperTheme}
          color={colors.titleText}
          labelStyle={StyleSheet.compose(gStyles.tblDescText, gStyles.buttonLabelTextAddOn)}
          icon={() => (
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={16}
              color={colors.titleText}
            />
          )}
          onPress={() => navigation.navigate("AssignForklift")}
        >
          Assign Forklift
        </Button>
        {/* <Button
          style={list_card_styles.bottomButton}
          compact={true}
          uppercase={false}
          mode={"text"}
          theme={PaperTheme}
          color={colors.titleText}
          labelStyle={StyleSheet.compose(gStyles.tblDescText, gStyles.buttonLabelTextAddOn)}
          icon={() => (
            <MaterialCommunityIcons name="file-phone-outline" size={18} color={colors.titleText} />
          )}
          onPress={() => navigation.navigate("CompanyContactList")}
        >
          Contacts
        </Button> */}
      </View>
    </_DefaultCard>
  );
};

export { _DriverListCard };
