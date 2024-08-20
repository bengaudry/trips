import { useColors } from "@/hooks";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { View, ViewProps } from "react-native";
import { InputLabel } from "./themed";
import { Ionicons } from "@expo/vector-icons";

export function DateInput({
  date,
  onChange,
  style,
  ...props
}: ViewProps & {
  date: Date;
  onChange: (date: Date) => void;
}) {
  const { accent, border } = useColors();

  return (
    <View style={[{ alignItems: "flex-start" }, style]} {...props}>
      <InputLabel label="Date" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          borderColor: border,
          borderWidth: 1.5,
          borderRadius: 10,
          paddingLeft: 12,
        }}
      >
        <Ionicons name="calendar-outline" color={accent} size={22} />
        <RNDateTimePicker
          mode="date"
          value={date}
          onChange={(e) => onChange(new Date(e.nativeEvent.timestamp))}
          themeVariant="light"
          style={{ marginLeft: -10 }}
        />
      </View>
    </View>
  );
}
