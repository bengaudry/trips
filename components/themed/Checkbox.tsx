import { Pressable, Switch, SwitchProps } from "react-native";
import { InputLabel } from "./Input";
import { useEffect, useState } from "react";
import { useColors } from "@/hooks";

export function Checkbox({
  value,
  onValueChange,
  label,
  style,
  ...props
}: SwitchProps & { label: string, value: boolean }) {
  const { border } = useColors();
  const [boolValue, setBoolValue] = useState(value);

  useEffect(() => setBoolValue(value), [value])

  return (
    <Pressable
      style={[
        {
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: border,
        },
        style,
      ]}
      onPress={() => setBoolValue((v) => !v)}
    >
      <InputLabel label={label} />
      <Switch
        value={boolValue}
        onValueChange={(v) => {
          setBoolValue(v);
          if (onValueChange) onValueChange(v);
        }}
        {...props}
      />
    </Pressable>
  );
}
