import { PropsWithChildren, useEffect } from "react";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@/hooks";
import { Text, Title } from "./themed";
import { LoadingOverlay } from "./LoadingOverlay";
import Toast from "react-native-toast-message";

export function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={{ paddingTop: 64 }}>
      <Image
        style={styles.Icon}
        source={require("../res/icons/png/icon-128.png")}
        width={55}
        height={55}
        resizeMode="cover"
      />

      <Title style={{ textAlign: "center" }}>{title}</Title>
      <Title heading="subtitle" style={{ textAlign: "center", fontSize: 16 }}>
        {subtitle}
      </Title>
    </View>
  );
}

export function AuthFooter({
  redirectUri,
}: {
  redirectUri: "signin" | "register";
}) {
  const { border, subtleBackground } = useColors();

  const texts =
    redirectUri === "register"
      ? {
          desc: "Pas encore inscrit(e) ?",
          link: "Créer un compte",
        }
      : {
          desc: "Déjà inscrit(e) ?",
          link: "Connexion",
        };

  return (
    <View
      style={[
        { backgroundColor: subtleBackground, borderColor: border },
        styles.Footer,
      ]}
    >
      <Text style={[styles.NoAccountPrompt]} secondary>
        {texts.desc}{" "}
        <Link replace href={`/${redirectUri}`}>
          <Text>{texts.link}</Text>
        </Link>
      </Text>
    </View>
  );
}

export function AuthWrapper({
  children,
  isLoading,
  error,
}: PropsWithChildren & { isLoading?: boolean; error?: string | null }) {
  const { appBackground } = useColors();

  useEffect(() => {
    if (error) {
      Toast.show({
        text1: "Auth error",
        text2: error,
      });
    }
  }, [error]);

  return (
    <SafeAreaView
      edges={{
        top: "off",
        left: "additive",
        right: "additive",
        bottom: "off",
      }}
      style={{ backgroundColor: appBackground }}
    >
      <LoadingOverlay visible={isLoading ?? false} />
      <View style={{ height: "100%", backgroundColor: appBackground }}>
        <ScrollView
          style={{  }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <KeyboardAvoidingView
            contentContainerStyle={styles.KeyboardAvoidingView}
            behavior="position"
          >
            {children}
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Icon: {
    borderRadius: 12,
    width: 55,
    height: 55,
    marginHorizontal: "auto",
    marginBottom: 16,
  },

  NoAccountPrompt: {
    fontWeight: "500",
    textAlign: "center",
  },
  Footer: {
    padding: 24,
    paddingBottom: 64,
    borderTopWidth: 1.5,
    width: "100%",
  },
  KeyboardAvoidingView: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});
