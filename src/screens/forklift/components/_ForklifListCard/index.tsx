import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { _DefaultCard } from "@components";
import { PaperTheme, colors, gStyles } from "@theme";
import { list_card_styles, screenStyles } from "src/screens/styles";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { ForkliftStackScreenProps } from "@navigation-types";
import { truncateText } from "@utility";
import { FontAwesome5, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { ForkliftStatusColor } from "@constants";

interface OwnProps {
  item: IForklift;
  handleDelete: (customerId: string) => void;
}

const _ForkliftListCard: React.FC<OwnProps> = ({ item, handleDelete }) => {
  const navigation = useNavigation<ForkliftStackScreenProps<"Forklift">["navigation"]>();
  return (
    <_DefaultCard>
      <TouchableOpacity
        style={list_card_styles.contentContainer}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("ForkLiftDetails")}
        onLongPress={() => handleDelete(item._id)}
      >
        <View>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              resizeMode="cover"
              style={list_card_styles.imgStyle}
            />
          ) : (
            <Image
              source={require("../../../../assets/images/user.png")}
              resizeMode="contain"
              style={list_card_styles.imgStyle}
            />
          )}
        </View>
        <View style={list_card_styles.infoWithForward}>
          <View style={list_card_styles.infoContainer}>
            <Text style={gStyles.cardInfoTitleText}>{item.name}</Text>
            <View style={[list_card_styles.fieldContainer, { marginTop: 6 }]}>
              {/* <Text style={gStyles.tblHeaderText}>Name: </Text> */}
              <Text style={gStyles.tblDescText} ellipsizeMode="tail" numberOfLines={1}>
                {item.name}
              </Text>
            </View>
            <View style={list_card_styles.fieldContainer}>
              {/* <Text style={gStyles.tblHeaderText}>Phone: </Text> */}
              <Text style={gStyles.tblDescText} ellipsizeMode="tail" numberOfLines={1}>
                {item.driver}
              </Text>
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={list_card_styles.fieldContainer}>
                  {/* <Text style={gStyles.tblHeaderText}>Company: </Text> */}
                  <Text style={gStyles.tblDescText} ellipsizeMode="tail" numberOfLines={0.5}>
                    {truncateText(item.model, 22)}
                  </Text>
                </View>
                <Text
                  style={StyleSheet.compose(
                    StyleSheet.compose(gStyles.tblHeaderText, screenStyles.badgeText),
                    {
                      backgroundColor: ForkliftStatusColor[item.status],
                    }
                  )}
                >
                  {truncateText(item.status, 35).toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          <View style={list_card_styles.forwardContainer}>
            <FontAwesome5 name="caret-right" size={20} color={colors.iconGray} />
          </View>
        </View>
      </TouchableOpacity>
      <View style={list_card_styles.bottomButtonContainer}>
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
          style={list_card_styles.bottomButton}
          compact={true}
          uppercase={false}
          mode={"text"}
          theme={PaperTheme}
          color={colors.titleText}
          labelStyle={StyleSheet.compose(gStyles.tblDescText, gStyles.buttonLabelTextAddOn)}
          icon={() => (
            <MaterialCommunityIcons name="progress-alert" size={16} color={colors.titleText} />
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
