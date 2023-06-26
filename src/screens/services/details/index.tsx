import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { _DefaultCard, _ScrollFormLayout } from "@components";
import type { ServiceStackScreenProps } from "@navigation-types";
import { ScrollView } from "react-native-gesture-handler";
import { faker } from "@faker-js/faker";
import moment from "moment";
import { FAB, Modal, Portal, RadioButton } from "react-native-paper";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { MaterialIcons } from "@expo/vector-icons";

enum ServiceStatus {
  "COMPLETE" = 1,
  "INPROCESS",
  "DECLINE",
}

const ServiceDetails: React.FC<ServiceStackScreenProps<"ServiceDetails">> = ({
  navigation,
  route,
}) => {
  const { _id, item } = route.params;

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
  }, []);

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
                setSelectedFilter(newValue);
                hideModal();
              }}
              value={selectedFilter}
            >
              <View style={screenStyles.radioItemStyle}>
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
              </View>
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
      {/* //TODO - update serivce screen; */}
      {/* <FAB
        icon="pencil"
        style={gStyles.fab}
        color={colors.white}
        onPress={() =>
          navigation.navigate("AddService", {
            mode: "edit",
            _id: _id,
            item: item,
          })
        }
      /> */}
    </SafeAreaView>
  );
};

export { ServiceDetails };
