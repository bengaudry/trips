import { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { CTA, AuthHeader, AuthWrapper } from "@/components";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuth } from "@/hooks";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";

export default function SignInPage() {
  const { user } = useAuth();
  const { replace } = useRouter();

  const [sendEmail, loading, error] = useVerifyEmail();

  if (user?.emailVerified) replace("/home");

  useEffect(() => {
    if (user?.emailVerified) return replace("/home");
    sendEmail(user, () => {
      Toast.show({
        type: "info",
        text1: "Email sent",
      });
    });
  }, [user]);

  useEffect(() => {
    if (error) {
      Toast.show({
        text1: "Error sending email",
        text2: error,
      });
    }
  }, [error]);

  return (
    <AuthWrapper isLoading={loading}>
      <View style={styles.MainContainer}>
        <AuthHeader
          title="Vérifie tes emails"
          subtitle={`Un email à été envoyé à ${user?.email}. Clique sur le lien pour vérifier ton compte.`}
        />

        <CTA
          content="J'ai vérifié mon compte"
          onPress={() => {
            if (!user) return;

            user.reload();
            if (user.emailVerified) {
              replace("/home");
            } else {
              Toast.show({
                type: "error",
                text1: "Erreur",
                text2: "Ton compte n'a pas encore été vérifié",
              });
            }
          }}
          style={styles.Cta}
        />
      </View>
    </AuthWrapper>
  );
}

const styles = StyleSheet.create({
  MainContainer: { paddingHorizontal: 24, paddingBottom: 32 },
  ForgotPassLink: {
    fontWeight: "500",
    textAlign: "right",
  },
  Cta: { marginTop: 32, marginBottom: 8 },
});
