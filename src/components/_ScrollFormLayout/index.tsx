import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import React from "react";

import { styles } from "./styles";

interface OwnProps {
  hasSpacing?: boolean;
}

const _ScrollFormLayout: React.FC<React.PropsWithChildren<OwnProps>> = ({
  children,
  hasSpacing = true,
}) => {
  if (React.Children.count(children) !== 1) {
    console.error("Error: _ScrollFormLayout component expects exactly one child node.");
    return null;
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={hasSpacing ? styles.scrollStyle : styles.scrollStyleNoSpacing}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export { _ScrollFormLayout };
