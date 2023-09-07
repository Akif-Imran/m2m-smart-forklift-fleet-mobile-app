import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { Button, Modal, Portal, Searchbar } from "react-native-paper";
import { _ListEmptyComponent, _TextInput } from "@components";
import { useAuthContext } from "@context";
import { addChecklistItem, getCheckList } from "@services";
import { ToastService } from "@utility";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFormik } from "formik";
import * as yup from "yup";

import { _ChecklistListCard } from "../components";

import { styles } from "./styles";

interface IForm {
  name: string;
}

const schema: yup.ObjectSchema<IForm> = yup.object().shape({
  name: yup.string().required("Name is required"),
});

const Checklist = () => {
  const {
    state: { token },
  } = useAuthContext();
  const [isFetching, setIsFetching] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [checklist, setChecklist] = React.useState<IChecklist[]>([]);
  const [searchedChecklist, setSearchedChecklist] = React.useState<
    IChecklist[]
  >([]);

  const [visible, setVisible] = React.useState<boolean>(false);

  const hideModal = () => setVisible(false);
  const showModal = () => setVisible(true);

  const form = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: (values, helpers) => {
      addChecklistItem(token, { name: values.name })
        .then((res) => {
          ToastService.show(res?.message || "N/A");
          if (res.success) {
            helpers.resetForm();
            hideModal();
          }
        })
        .catch((_err) => {
          ToastService.show("An error occurred");
        })
        .finally(() => {
          handleRefresh();
        });
    },
    validationSchema: schema,
  });

  const handleSearch = (query: string) => {
    console.log(query);
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    fetchChecklist(true);
  };

  const fetchChecklist = React.useCallback(
    (withLoader = false) => {
      setIsFetching(withLoader);
      getCheckList(token)
        .then((res) => {
          if (res.success) {
            setChecklist((_prev) => res.data);
          }
        })
        .catch((_err) => {
          console.log(_err?.message);
          ToastService.show("Error fetching checklist");
        })
        .finally(() => {
          setIsFetching(false);
        });
    },
    [token]
  );

  React.useEffect(() => {
    fetchChecklist(true);
  }, [fetchChecklist]);

  React.useEffect(() => {
    setSearchedChecklist((_prev) => checklist);
  }, [checklist]);

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <View style={screenStyles.searchContainer}>
        <Searchbar
          theme={PaperTheme}
          autoCapitalize="none"
          value={searchQuery}
          placeholder="Search..."
          onChangeText={(query) => handleSearch(query)}
          style={screenStyles.searchStyle}
        />
        <TouchableOpacity
          style={screenStyles.filterButtonStyle}
          onPress={() => showModal()}
        >
          <MaterialCommunityIcons
            name="plus"
            size={20}
            color={colors.iconGray}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={searchedChecklist}
        showsVerticalScrollIndicator={false}
        style={screenStyles.flatListStyle}
        // contentContainerStyle={{ padding: 2 }}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<_ListEmptyComponent label="No Services..." />}
        renderItem={({ item }) => (
          <_ChecklistListCard
            key={item.id}
            label={item.name}
            checklistItemId={item.id}
            handleRefresh={handleRefresh}
          />
        )}
        refreshControl={
          <RefreshControl
            enabled={true}
            refreshing={isFetching}
            colors={[colors.primary]}
            progressBackgroundColor={colors.white}
            onRefresh={handleRefresh}
          />
        }
      />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalStyle}
        >
          {/* <Text style={[styles.headerText, { paddingLeft: 8 }]}> */}
          <Text style={gStyles.tblHeaderText}>Checklist Item</Text>
          <View style={styles.orderInputContainer}>
            <_TextInput
              dense
              value={form.values.name}
              label={"Name"}
              onBlur={form.handleBlur("name")}
              onChangeText={form.handleChange("name")}
              error={form.errors.name && form.touched.name ? true : false}
              errorText={form.errors.name}
            />
          </View>
          <Button
            theme={PaperTheme}
            mode="contained"
            onPress={() => form.handleSubmit()}
            labelStyle={{ ...gStyles.cardTitleText, color: colors.white }}
          >
            Ok
          </Button>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

export { Checklist };
