import { Stack } from "expo-router";
import { ThemeProvider } from "@react-navigation/native";
import Toast, {
  ErrorToast,
  InfoToast,
  SuccessToast,
  ToastConfigParams,
} from "react-native-toast-message";
import { StyleSheet, useColorScheme } from "react-native";
import { useColors } from "@/hooks";
import { StatusBar } from "expo-status-bar";

const StackLayout = () => {
  const scheme = useColorScheme();
  const { appBackground } = useColors();

  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Retour",
        animation: "ios",
        animationDuration: 300,
        contentStyle: {
          backgroundColor: appBackground,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="(auth)/signin"
        options={{
          headerShown: true,
          title: "Connexion",
          headerBackButtonMenuEnabled: true,
          headerTintColor: scheme === "light" ? "black" : "white",
        }}
      />
      <Stack.Screen
        name="(auth)/register"
        options={{
          headerShown: true,
          title: "Inscription",
          headerBackButtonMenuEnabled: true,
          headerTintColor: scheme === "light" ? "black" : "white",
        }}
      />
      <Stack.Screen
        name="(auth)/forgotpass"
        options={{
          headerShown: true,
          title: "Mot de passe oublié ?",
          headerBackButtonMenuEnabled: true,
          headerTintColor: scheme === "light" ? "black" : "white",
        }}
      />
      <Stack.Screen
        name="(auth)/check-email"
        options={{
          headerShown: true,
          title: "Vérifier email",
          headerBackButtonMenuEnabled: true,
          headerTintColor: scheme === "light" ? "black" : "white",
        }}
      />
    </Stack>
  );
};

export default function RootLayout() {
  const scheme = useColorScheme();

  const {
    appBackground,
    border,
    subtleBackground,
    shadow,
    accent,
    primaryTextColor,
    dangerBackground,
    successBackground,
    infoBackground,
  } = useColors();

  return (
    <ThemeProvider
      value={{
        dark: useColorScheme() === "dark",
        colors: {
          background: appBackground,
          border,
          card: subtleBackground,
          notification: shadow,
          primary: accent,
          text: primaryTextColor,
        },
      }}
    >
      <StatusBar style={scheme === "light" ? "dark" : "light"} />
      <StackLayout />
      <Toast
        type="error"
        config={{
          error: (props) => (
            <ErrorToast
              {...props}
              style={styles.toastStyle}
              contentContainerStyle={[
                styles.contentContainerStyle,
                {
                  backgroundColor: dangerBackground,
                },
              ]}
              text1Style={[styles.text1style, { color: primaryTextColor }]}
              text2Style={[styles.text2Style, { color: primaryTextColor }]}
            />
          ),
          success: (props) => (
            <SuccessToast
              {...props}
              style={styles.toastStyle}
              contentContainerStyle={[
                styles.contentContainerStyle,
                {
                  backgroundColor: successBackground,
                },
              ]}
              text1Style={[styles.text1style, { color: primaryTextColor }]}
              text2Style={[styles.text2Style, { color: primaryTextColor }]}
            />
          ),
          info: (props) => (
            <InfoToast
              {...props}
              style={styles.toastStyle}
              contentContainerStyle={[
                styles.contentContainerStyle,
                {
                  backgroundColor: infoBackground,
                },
              ]}
              text1Style={[styles.text1style, { color: primaryTextColor }]}
              text2Style={[styles.text2Style, { color: primaryTextColor }]}
            />
          ),
        }}
      />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  text1style: {
    fontSize: 15,
    marginBottom: 1,
  },
  text2Style: {
    fontSize: 13,
    marginTop: 0,
  },
  contentContainerStyle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 0,
    borderRadius: 12,
  },
  toastStyle: {
    width: "100%",
    height: "auto",
    borderLeftWidth: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
