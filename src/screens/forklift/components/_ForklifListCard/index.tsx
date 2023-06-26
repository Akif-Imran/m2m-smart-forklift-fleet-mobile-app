import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { _DefaultCard } from "@components";
import { PaperTheme, colors, gStyles } from "@theme";
import { listCardStyles, screenStyles } from "src/screens/styles";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { truncateText } from "@utility";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { ForkliftStatusColor } from "@constants";

interface OwnProps {
  item: IForklift;
  handleDelete: (customerId: string) => void;
}

const _ForkliftListCard: React.FC<OwnProps> = ({ item, handleDelete }) => {
  const navigation =
    useNavigation<ForkliftStackScreenProps<"Forklift">["navigation"]>();
  return (
    <_DefaultCard>
      <TouchableOpacity
        style={listCardStyles.contentContainer}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate("ForkLiftDetails", {
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
            <Text
              style={gStyles.tblDescText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.driver}
            </Text>

            <Text
              style={gStyles.tblDescText}
              ellipsizeMode="tail"
              numberOfLines={0.5}
            >
              {truncateText(item.model, 22)}
            </Text>
          </View>

          <View
            style={StyleSheet.compose(listCardStyles.forwardContainer, {
              flexDirection: "row",
            })}
          >
            <Text
              style={StyleSheet.compose(screenStyles.badgeText, {
                backgroundColor: ForkliftStatusColor[item.status],
              })}
            >
              {truncateText(item.status, 35).toUpperCase()}
            </Text>
            <FontAwesome5
              name="caret-right"
              size={20}
              color={colors.iconGray}
            />
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
          labelStyle={StyleSheet.compose(
            gStyles.tblDescText,
            gStyles.buttonLabelTextAddOn
          )}
          icon={() => (
            <MaterialCommunityIcons
              name="progress-alert"
              size={16}
              color={colors.titleText}
            />
          )}
          onPress={() => navigation.navigate("ReqService")}
        >
          Req Service
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

export { _ForkliftListCard };
