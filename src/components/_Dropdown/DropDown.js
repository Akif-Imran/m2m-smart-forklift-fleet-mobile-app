import { ScrollView, View, Dimensions, StyleSheet } from "react-native";
import {
  Checkbox,
  Divider,
  Menu,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import React from "react";

const DropDown = React.forwardRef((props, ref) => {
  const activeTheme = useTheme();
  const {
    multiSelect = false,
    visible,
    onDismiss,
    showDropDown,
    value,
    setValue,
    activeColor,
    mode,
    label,
    placeholder,
    inputProps,
    list,
    dropDownContainerMaxHeight,
    dropDownContainerHeight,
    theme,
    dropDownStyle,
    dropDownItemStyle,
    dropDownItemSelectedStyle,
    dropDownItemTextStyle,
    dropDownItemSelectedTextStyle,
    accessibilityLabel,
  } = props;

  const [displayValue, setDisplayValue] = React.useState("");
  const [inputLayout, setInputLayout] = React.useState({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const onLayout = (event) => {
    setInputLayout(event.nativeEvent.layout);
  };

  React.useEffect(() => {
    if (multiSelect) {
      const _labels = list
        .filter((_) => value.indexOf(_.value) !== -1)
        .map((_) => _.label)
        .join(", ");
      setDisplayValue(_labels);
    } else {
      const _label = list.find((_) => _.value === value)?.label;
      if (_label) {
        setDisplayValue(_label);
      }
    }
  }, [list, value]);

  const isActive = React.useCallback(
    (currentValue) => {
      if (multiSelect) {
        return value.indexOf(currentValue) !== -1;
      } else {
        return value === currentValue;
      }
    },
    [value]
  );

  const setActive = React.useCallback(
    (currentValue) => {
      if (multiSelect) {
        const valueIndex = value.indexOf(currentValue);
        const values = value.split(",");
        if (valueIndex === -1) {
          setValue([...values, currentValue].join(","));
        } else {
          setValue([...values].filter((val) => val !== currentValue).join(","));
        }
      } else {
        setValue(currentValue);
      }
    },
    [value]
  );

  return (
    <Menu
      visible={visible}
      onDismiss={onDismiss}
      theme={theme}
      anchor={
        <TouchableRipple
          ref={ref}
          onPress={showDropDown}
          onLayout={onLayout}
          accessibilityLabel={accessibilityLabel}
        >
          <View pointerEvents={"none"}>
            <TextInput
              dense
              value={displayValue}
              mode={mode}
              label={label}
              placeholder={placeholder}
              pointerEvents={"none"}
              theme={theme}
              right={
                <TextInput.Icon
                  name={visible ? "menu-up" : "menu-down"}
                  color={"#adb6be"}
                />
              }
              {...inputProps}
              style={{ minWidth: Dimensions.get("window").width - 30 }}
              outlineColor={"#cfcfcf"}
              selectionColor={"#00c853"}
              activeOutlineColor={"#00c853"}
            />
          </View>
        </TouchableRipple>
      }
      style={{
        maxWidth: inputLayout?.width,
        width: inputLayout?.width,
        marginTop: inputLayout?.height,
        ...dropDownStyle,
      }}
    >
      <ScrollView
        bounces={false}
        style={{
          ...(dropDownContainerHeight
            ? {
                height: dropDownContainerHeight,
              }
            : {
                maxHeight: dropDownContainerMaxHeight || 200,
              }),
        }}
      >
        {list.map((_item, _index) => (
          <React.Fragment key={_item.value}>
            <TouchableRipple
              style={styles.touchableRipple}
              onPress={() => {
                setActive(_item.value);
                if (onDismiss) {
                  onDismiss();
                }
              }}
            >
              <React.Fragment>
                <Menu.Item
                  titleStyle={{
                    color: isActive(_item.value)
                      ? activeColor || (theme || activeTheme).colors.primary
                      : (theme || activeTheme).colors.text,
                    ...(isActive(_item.value)
                      ? dropDownItemSelectedTextStyle
                      : dropDownItemTextStyle),
                  }}
                  title={_item.custom || _item.label}
                  style={StyleSheet.compose(styles.menuItem, {
                    maxWidth: inputLayout?.width,
                    ...(isActive(_item.value)
                      ? dropDownItemSelectedStyle
                      : dropDownItemStyle),
                  })}
                />
                {multiSelect && (
                  <Checkbox.Android
                    theme={{
                      colors: { accent: activeTheme?.colors.primary },
                    }}
                    status={isActive(_item.value) ? "checked" : "unchecked"}
                    onPress={() => setActive(_item.value)}
                  />
                )}
              </React.Fragment>
            </TouchableRipple>
            <Divider />
          </React.Fragment>
        ))}
      </ScrollView>
    </Menu>
  );
});

const styles = StyleSheet.create({
  touchableRipple: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItem: {
    flex: 1,
  },
});
export { DropDown };
