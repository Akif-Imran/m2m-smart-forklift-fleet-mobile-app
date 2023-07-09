import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React from "react";
import { Button, Modal, Portal } from "react-native-paper";
import LottieView from "lottie-react-native";
import { PaperTheme, colors, gStyles } from "@theme";

import { styles } from "./styles";

interface OwnProps {
  question: string;
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  cancelLabel: string;
}

const _ConfirmModal: React.FC<OwnProps> = ({
  onConfirm,
  onCancel,
  question,
  visible,
  confirmLabel,
  cancelLabel,
}) => {
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
  const animation = React.useRef(null);

  return (
    <Portal theme={PaperTheme}>
      <Modal
        visible={visible}
        dismissable={false}
        theme={PaperTheme}
        style={[
          styles.modal,
          {
            marginTop: (SCREEN_HEIGHT / 100) * 45,
            marginBottom: (SCREEN_HEIGHT / 100) * 1,
            marginHorizontal: (SCREEN_WIDTH / 100) * 8,
            // borderWidth: 1,
          },
        ]}
        contentContainerStyle={styles.modalContent}
      >
        <LottieView
          ref={animation}
          autoPlay
          duration={1500}
          style={styles.lottieView}
          source={require("../../assets/animations/warning-status.json")}
          loop={false}
          enableMergePathsAndroidForKitKatAndAbove
        />
        <Text style={gStyles.tblDescText}>{question}</Text>
        <View style={styles.buttonContainer}>
          <Button
            theme={PaperTheme}
            mode="text"
            onPress={onCancel}
            color={colors.warning}
            labelStyle={StyleSheet.compose(gStyles.tblHeaderText, {
              color: colors.warning,
            })}
            style={styles.buttonStyle}
          >
            {cancelLabel}
          </Button>
          <Button
            theme={PaperTheme}
            mode="contained"
            onPress={onConfirm}
            color={colors.warning}
            labelStyle={StyleSheet.compose(gStyles.tblHeaderText, {
              color: colors.white,
            })}
            style={styles.buttonStyle}
          >
            {confirmLabel}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

export { _ConfirmModal };
