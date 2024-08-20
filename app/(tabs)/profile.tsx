import { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  TextInput as NatTextInput,
  RefreshControl,
  Pressable,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/hooks";
import { CTA, TextInput, Text } from "@/components";
import { updateProfile } from "firebase/auth";

const DisplayNameContainer = ({
  onChange,
  onAskModify,
  onError,
}: {
  onChange?: (newName: string) => void;
  onAskModify?: () => void;
  onError?: (err: unknown) => void;
}) => {
  const { user } = useAuth();

  const inputRef = useRef(null);

  const [isEditingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName);

  useEffect(() => {
    setDisplayName(user?.displayName);
  }, [user]);

  useEffect(() => {
    // @ts-expect-error
    if (isEditingName) inputRef.current?.focus();
  }, [isEditingName]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <View
          style={{
            backgroundColor: "#e7e7e7",
            height: 75,
            aspectRatio: "1/1",
            borderRadius: 9999,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 32, fontWeight: "600" }}>
            {user?.displayName ? user.displayName[0] : "-"}
          </Text>
        </View>
        <NatTextInput
          style={{ fontSize: 24, fontWeight: "600" }}
          editable={isEditingName}
          value={displayName ?? ""}
          ref={inputRef}
          onFocus={(e) => {
            if (!isEditingName) e.target.blur();
          }}
          onBlur={async () => {
            if (onAskModify) onAskModify();
            setEditingName(false);
            if (!user || !displayName) return;
            try {
              updateProfile(user, { displayName });
              if (onChange) onChange(displayName);
            } catch (err) {
              console.error(err);
              if (onError) onError(err);
            }
          }}
          onChangeText={setDisplayName}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          setEditingName(true);
        }}
      >
        <Ionicons name="pencil-sharp" size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default function ListPage() {
  const { user, signOut } = useAuth();
  const { navigate } = useRouter();

  const [refreshing, setRefreshing] = useState(false);

  return (
    <SafeAreaView>
      <ScrollView
        style={{ height: "100%" }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 32,
          paddingVertical: 64,
        }}
      >
        <RefreshControl refreshing={refreshing} />
        <DisplayNameContainer
          onChange={() => setRefreshing(false)}
          onAskModify={() => setRefreshing(true)}
          onError={() => setRefreshing(false)}
        />

        <Text>Compte</Text>
        {!user?.emailVerified && (
          <Pressable onPress={() => navigate("/check-email")}>
            <Text style={{ color: "blue", fontWeight: "500" }}>
              Vérifier mon email
            </Text>
          </Pressable>
        )}

        <Pressable onPress={signOut}>
          <Text style={{ color: "red", fontWeight: "500" }}>
            Se déconnecter
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
