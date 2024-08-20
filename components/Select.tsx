import React from "react";
import { View, ViewProps } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";

import { InputLabel } from "./themed";
import { useColors } from "@/hooks";

export function Select<T extends any>({
  value,
  items,
  style,
  label,
  onChange,
  ...props
}: ViewProps & {
  value: T;
  label: string;
  items: Array<{ label: string; value: T }>;
  onChange: (value: T) => void;
}) {
  const { border } = useColors();

  return (
    <View style={[{ flexGrow: 1 }, style]} {...props}>
      <InputLabel label={label} />
      <View
        style={{
          borderColor: border,
          flexDirection: "row",
          position: "relative",
          alignItems: "center",
          borderWidth: 1.5,
          borderRadius: 10,
        }}
      >
        <RNPickerSelect
          style={{
            viewContainer: {
              paddingLeft: 18,
              paddingRight: 18 + 6,
              paddingVertical: 12,
            },
          }}
          value={value}
          items={items}
          onValueChange={(value: T | null) => {
            if (value !== null) return onChange(value);
          }}
        />
        <Ionicons
          name="caret-down"
          style={{ position: "absolute", right: 6 }}
        />
      </View>
    </View>
  );
}
