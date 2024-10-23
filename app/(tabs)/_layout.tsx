import { TouchableOpacity } from "react-native";
import { Link, Redirect, Stack, useRouter } from "expo-router";

import { useAuth } from "@/hooks";
import { Text } from "@/components";

export default function TabsLayout() {
  const { user, loading } = useAuth();

  if (!user && !loading) return <Redirect href="/" />;

  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: "Accueil",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="addtrip/[tripId]"
        options={{
          title: "Nouveau",
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Compte",
        }}
      />
      <Stack.Screen
        name="autoadd"
        options={{
          title: "Trajet automatique",
          presentation: "modal",
          headerShown: true,
          headerLeft: (props) => {
            return (
              <Link href="../" style={{ paddingVertical: 8, paddingRight: 8 }}>
                <Text
                  style={{
                    color: props.tintColor,
                    fontWeight: "600",
                  }}
                >
                  Fermer
                </Text>
              </Link>
            );
          },
        }}
      />
      <Stack.Screen
        name="trips"
        options={{
          title: "Trajets",
        }}
      />
      <Stack.Screen
        name="tripDetails/[tripId]"
        options={{
          title: "Details",
        }}
      />
    </Stack>
  );
}
