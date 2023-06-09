import React from "react";
import { View } from "react-native";
import { HelperText, TextInput, TextInputProps } from "react-native-paper";
import { PaperTheme, colors } from "@theme";
import { styles } from "./styles";

interface OwnProp {
  errorText: string | undefined;
  error?: boolean;
}

const _TextInput: React.FC<Omit<TextInputProps, keyof OwnProp | "theme"> & OwnProp> = ({
  errorText,
  error,
  ...props
}) => {
  return (
    <View style={styles.mainContainer}>
      <TextInput
        dense
        autoCapitalize="none"
        theme={PaperTheme}
        mode="outlined"
        error={error}
        outlineColor={colors.borderColor}
        selectionColor={colors.primary}
        clearButtonMode="while-editing"
        activeOutlineColor={colors.primary}
        style={styles.input}
        {...props}
      />
      {error ? (
        <HelperText type="error" selectable={false} style={styles.formErrorText}>
          {errorText}
        </HelperText>
      ) : null}
    </View>
  );
};

export { _TextInput };
