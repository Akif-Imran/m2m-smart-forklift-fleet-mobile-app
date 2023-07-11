/* eslint-disable camelcase */
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { _DefaultCard, _ScrollFormLayout } from "@components";
import type { ServiceStackScreenProps } from "@navigation-types";
import { ScrollView } from "react-native-gesture-handler";
import { Modal, Portal, RadioButton } from "react-native-paper";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { MaterialIcons } from "@expo/vector-icons";
import { baseURL } from "@api";
import { getServiceStatus, updateServiceStatus } from "@services";
import { useAuthContext } from "@context";
import { FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_12, ToastService } from "@utility";

enum ServiceStatus {
  "COMPLETE" = 1,
  "INPROCESS",
  "DECLINE",
}

const ServiceDetails: React.FC<ServiceStackScreenProps<"ServiceDetails">> = ({
  navigation,
  route,
}) => {
  const { item } = route.params;
  const {
    state: { token },
  } = useAuthContext();
  const [statusList, setStatusList] = React.useState<IServiceStatus[]>([]);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = React.useState<string>(
    ServiceStatus.COMPLETE.toString()
  );

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: (_props) => (
        <TouchableOpacity activeOpacity={0.8} onPress={() => showModal()}>
          <MaterialIcons
            name="published-with-changes"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchServiceStatus = React.useCallback(() => {
    getServiceStatus(token)
      .then((res) => {
        if (res.success) {
          setStatusList(res.data);
        }
      })
      .catch((_err) => {
        ToastService.show("Error occurred");
      });
  }, [token]);

  const updateStatus = async (serviceId: number, statusId: string) => {
    updateServiceStatus(token, {
      id: serviceId,
      status_id: parseInt(statusId, 10),
    })
      .then((res) => {
        console.log(res);
        ToastService.show("Service updated");
      })
      .catch((_err) => {
        ToastService.show("Error occurred");
      });
  };

  React.useEffect(() => {
    fetchServiceStatus();
  }, [fetchServiceStatus]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <Portal theme={PaperTheme}>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={screenStyles.filterModalStyle}
        >
          <Text style={gStyles.headerText}>Update Status</Text>
          <>
            <RadioButton.Group
              onValueChange={(newValue) => {
                updateStatus(item.id, newValue);
                setSelectedFilter(newValue);
                hideModal();
              }}
              value={selectedFilter}
            >
              {statusList.map((status) => (
                <View style={screenStyles.radioItemStyle} key={status.id}>
                  <RadioButton.Item
                    theme={PaperTheme}
                    label={status.status_name}
                    value={status.id.toString()}
                    color={colors.primary}
                    uncheckedColor={colors.iconGray}
                    labelStyle={gStyles.descText}
                  />
                </View>
              ))}
            </RadioButton.Group>
          </>
        </Modal>
      </Portal>
      <_ScrollFormLayout>
        <>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
            contentContainerStyle={{ gap: theme.spacing.sm }}
          >
            {item.pictures.length > 0 ? (
              <>
                {item.pictures.map((picture, index) => (
                  <Image
                    key={index}
                    source={{ uri: `${baseURL}${picture}` }}
                    style={screenStyles.imgStyle}
                  />
                ))}
              </>
            ) : (
              <View
                style={StyleSheet.compose(
                  screenStyles.imgStyle,
                  screenStyles.noImage
                )}
              >
                <Text style={gStyles.cardInfoTitleText}>No Images</Text>
              </View>
            )}
          </ScrollView>
          <_DefaultCard>
            <View>
              <Text style={screenStyles.detailsCardHeadingText}>
                Service Info
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Registration No.</Text>
              <Text style={screenStyles.tblDescText}>{item.id}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Status</Text>
              <Text style={screenStyles.tblDescText}>{item.status}</Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Request Date</Text>
              <Text style={screenStyles.tblDescText}>
                {/* {moment(item.service_date).format("DD MMM, YYYY hh:mm A")} */}
                {FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_12(item.service_date)}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Service Type</Text>
              <Text style={screenStyles.tblDescText}>
                {item.type_name.toUpperCase()}
              </Text>
            </View>
            <View style={screenStyles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Description</Text>
              <Text style={screenStyles.tblDescText}>{item.description}</Text>
            </View>
          </_DefaultCard>
        </>
      </_ScrollFormLayout>
    </SafeAreaView>
  );
};

export { ServiceDetails };

/* <View style={screenStyles.radioItemStyle}>
                <RadioButton.Item
                  theme={PaperTheme}
                  label="Complete"
                  value={ServiceStatus.COMPLETE.toString()}
                  color={colors.primary}
                  uncheckedColor={colors.iconGray}
                  labelStyle={gStyles.descText}
                />
              </View>
              <View style={screenStyles.radioItemStyle}>
                <RadioButton.Item
                  theme={PaperTheme}
                  label="In process"
                  value={ServiceStatus.INPROCESS.toString()}
                  color={colors.primary}
                  uncheckedColor={colors.iconGray}
                  labelStyle={gStyles.descText}
                />
              </View>
              <View style={screenStyles.radioItemStyle}>
                <RadioButton.Item
                  theme={PaperTheme}
                  label="Decline"
                  value={ServiceStatus.DECLINE.toString()}
                  color={colors.primary}
                  uncheckedColor={colors.iconGray}
                  labelStyle={gStyles.descText}
                />
              </View> */
