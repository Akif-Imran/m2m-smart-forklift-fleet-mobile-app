import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { _DefaultCard } from "@components";
import { PaperTheme, colors, gStyles } from "@theme";
import { listCardStyles, screenStyles } from "src/screens/styles";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { truncateText } from "@utility";
import { Entypo, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { ForkliftStatusColor } from "@constants";
import { styles } from "./styles";

interface OwnProps {
  item: IForklift;
  handleDelete: (customerId: string) => void;
}

const _ForkliftListCard: React.FC<OwnProps> = ({ item, handleDelete }) => {
  const navigation = useNavigation<ForkliftStackScreenProps<"Forklift">["navigation"]>();
  return (
    <_DefaultCard>
      <TouchableOpacity
        style={listCardStyles.contentContainer}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate("BirdEyeView", {
            mode: "single",
            point: {
              latitude: 3.139003,
              longitude: 101.686855,
              name: "PT-01",
            },
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
            <View style={styles.titleContainer}>
              <Text style={gStyles.cardInfoTitleText}>{truncateText(item.name)}</Text>
              <Entypo
                name="info-with-circle"
                color={colors.titleText}
                size={18}
                onPress={() =>
                  navigation.navigate("ForkLiftDetails", {
                    item: item,
                    _id: item._id,
                  })
                }
              />
            </View>
            <Text style={gStyles.tblDescText} ellipsizeMode="tail" numberOfLines={1}>
              {item.driver}
            </Text>

            <Text style={gStyles.tblDescText} ellipsizeMode="tail" numberOfLines={0.5}>
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
            <FontAwesome5 name="caret-right" size={20} color={colors.iconGray} />
          </View>
        </View>
      </TouchableOpacity>
      <View style={listCardStyles.bottomButtonContainer}>
        <Button
          style={listCardStyles.bottomButton}
          compact={true}
          uppercase={false}
          mode={"text"}
          theme={PaperTheme}
          color={colors.titleText}
          labelStyle={StyleSheet.compose(gStyles.tblDescText, gStyles.buttonLabelTextAddOn)}
          icon={() => <MaterialCommunityIcons name="wall" size={18} color={colors.titleText} />}
          onPress={() => navigation.navigate("Fences")}
        >
          Fences
        </Button>
        <Button
          style={listCardStyles.bottomButton}
          compact={true}
          uppercase={false}
          mode={"text"}
          theme={PaperTheme}
          color={colors.titleText}
          labelStyle={StyleSheet.compose(gStyles.tblDescText, gStyles.buttonLabelTextAddOn)}
          icon={() => <FontAwesome5 name="road" size={16} color={colors.titleText} />}
          onPress={() => navigation.navigate("Trips")}
        >
          Trips
        </Button>
        <Button
          style={listCardStyles.bottomButton}
          compact={true}
          uppercase={false}
          mode={"text"}
          theme={PaperTheme}
          color={colors.titleText}
          labelStyle={StyleSheet.compose(gStyles.tblDescText, gStyles.buttonLabelTextAddOn)}
          icon={() => (
            <MaterialCommunityIcons name="file-multiple" size={16} color={colors.titleText} />
          )}
          onPress={() =>
            navigation.navigate("ReportsStack", {
              screen: "Reports",
            })
          }
        >
          Reports
        </Button>
        <Button
          style={StyleSheet.compose(listCardStyles.bottomButton, {
            flex: 1.3,
          })}
          compact={true}
          uppercase={false}
          mode={"text"}
          theme={PaperTheme}
          color={colors.titleText}
          labelStyle={StyleSheet.compose(gStyles.tblDescText, gStyles.buttonLabelTextAddOn)}
          icon={() => <MaterialIcons name="report" size={20} color={colors.titleText} />}
          onPress={() => navigation.navigate("ReqService")}
        >
          Req Service
        </Button>
      </View>
    </_DefaultCard>
  );
};

export { _ForkliftListCard };
