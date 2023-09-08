import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { _Badge, _DefaultCard } from "@components";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { listCardStyles } from "@screen-styles";
import { Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { truncateText } from "@utility";
import {
  Entypo,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { BASE_URL } from "@api";
import moment from "moment";

import { styles } from "./styles";

interface OwnProps {
  item: IVehicleWithDevice;
  handleDelete: (customerId: number) => void;
}

const _ForkliftListCard: React.FC<OwnProps> = ({ item, handleDelete }) => {
  const navigation =
    useNavigation<ForkliftStackScreenProps<"Forklift">["navigation"]>();
  const [isOnline, setIsOnline] = React.useState<boolean>(false);

  React.useEffect(() => {
    const gpsTime = moment(item.device?.gps_time);
    const minutes = moment().diff(gpsTime, "minutes");
    console.log(item.device?.gps_time, minutes);
    setIsOnline(minutes < 10);
  }, [item?.device]);

  return (
    <_DefaultCard>
      <TouchableOpacity
        style={listCardStyles.contentContainer}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate("BirdEyeView", {
            mode: "single",
            point: {
              latitude: item.device?.latitude
                ? parseFloat(item.device?.latitude)
                : 3.139003,
              longitude: item.device?.longitude
                ? parseFloat(item.device?.longitude)
                : 101.686855,
              name: item.reg_no,
              icon: item.icon,
            },
          })
        }
        onLongPress={() => handleDelete(item.id)}
      >
        <View style={styles.imgContainer}>
          <Image
            source={
              item.picture
                ? { uri: `${BASE_URL}${item.picture}` }
                : require("../../../../assets/images/car.png")
            }
            resizeMode="contain"
            style={listCardStyles.imgStyle}
          />
        </View>
        <View style={listCardStyles.infoWithForward}>
          <View style={listCardStyles.infoContainer}>
            <View style={styles.titleContainer}>
              <Text style={gStyles.cardInfoTitleText}>
                {truncateText(item.reg_no)}
              </Text>
              <Entypo
                name="info-with-circle"
                color={colors.titleText}
                size={20}
                onPress={() =>
                  navigation.navigate("ForkLiftDetails", {
                    _id: item.id.toString(),
                    item: item,
                  })
                }
              />
            </View>
            <Text
              style={gStyles.tblDescText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.model}-{item.make}-{item.year}
            </Text>

            <Text
              style={gStyles.tblDescText}
              ellipsizeMode="tail"
              numberOfLines={0.5}
            >
              {truncateText(item.fuel_type_name, 22)}
            </Text>
            <_Badge status={isOnline ? "online" : "offline"} />
          </View>

          <View
            style={StyleSheet.compose(listCardStyles.forwardContainer, {
              justifyContent: "space-between",
            })}
          >
            <View style={listCardStyles.forwardContainer}>
              <Text
                style={gStyles.tblDescText}
                ellipsizeMode="tail"
                numberOfLines={0.5}
              >
                {moment(item.device?.gps_time).format("ddd DD MMM, YYYY")}
              </Text>
              <Text
                style={gStyles.tblDescText}
                ellipsizeMode="tail"
                numberOfLines={0.5}
              >
                {moment(item.device?.gps_time).format("hh:mm:ss A")}
              </Text>
            </View>
            <IconButton
              icon="bell"
              color={colors.titleText}
              size={20}
              style={{ marginRight: 0 - theme.spacing.md }}
              onPress={() => console.log("Pressed")}
            />
            <FontAwesome5
              name="caret-right"
              size={20}
              color={colors.iconGray}
            />
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
          labelStyle={StyleSheet.compose(
            gStyles.tblDescText,
            gStyles.buttonLabelTextAddOn
          )}
          icon={() => (
            <MaterialCommunityIcons
              name="wall"
              size={18}
              color={colors.titleText}
            />
          )}
          onPress={() =>
            navigation.navigate("Fences", {
              _id: item.id.toString(),
              item: item,
            })
          }
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
          labelStyle={StyleSheet.compose(
            gStyles.tblDescText,
            gStyles.buttonLabelTextAddOn
          )}
          icon={() => (
            <FontAwesome5 name="road" size={16} color={colors.titleText} />
          )}
          onPress={() =>
            navigation.navigate("Trips", {
              _id: item.id.toString(),
              item: item,
            })
          }
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
          labelStyle={StyleSheet.compose(
            gStyles.tblDescText,
            gStyles.buttonLabelTextAddOn
          )}
          icon={() => (
            <MaterialCommunityIcons
              name="file-multiple"
              size={16}
              color={colors.titleText}
            />
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
          labelStyle={StyleSheet.compose(
            gStyles.tblDescText,
            gStyles.buttonLabelTextAddOn
          )}
          icon={() => (
            <MaterialIcons name="report" size={20} color={colors.titleText} />
          )}
          onPress={() => navigation.navigate("ReqService")}
        >
          Req Service
        </Button>
      </View>
    </_DefaultCard>
  );
};

export { _ForkliftListCard };
