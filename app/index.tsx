import { SafeAreaView, StyleSheet, View } from "react-native";
import { Link, Redirect, useRouter } from "expo-router";

import APP_INFO from "@/constants/appInfo";
import { useAuth } from "@/hooks";
import { AuthHeader, CTA, Text } from "@/components";

export default () => {
  const { user, loading } = useAuth();
  const { push } = useRouter();

  if (user && !loading) return <Redirect href="/home" />;

  return (
    <SafeAreaView>
      <View style={styles.MainContainer}>
        <AuthHeader
          title={`Bienvenue sur ${APP_INFO.name}`}
          subtitle="Découvre l'application !"
        />
        <View>
          <CTA
            content="Créer mon compte"
            onPress={() => push("/(auth)/register")}
          />
          <Text style={styles.Subtitle} secondary>
            Déjà inscrit(e) ?{" "}
            <Link href="/(auth)/signin">
              <Text>Connexion</Text>
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    paddingTop: 64,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  Subtitle: { fontWeight: "500", textAlign: "center", marginTop: 16 },
});
