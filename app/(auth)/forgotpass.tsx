import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import { isEmailFormatCorrect } from "@/lib";
import {
  CTA,
  InputContainer,
  TextInput,
  AuthHeader,
  AuthWrapper,
} from "@/components";
import { useResetPassword } from "@/hooks/useResetPassword";
import Toast from "react-native-toast-message";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [resetPassword, loading, error] = useResetPassword();

  const handleReset = () => {
    resetPassword(email, () =>
      Toast.show({
        type: "info",
        text1: "Un email t'a été envoyé",
        text2: "N'oublie pas de vérifier dans tes spams",
      })
    );
  };

  useEffect(() => {
    if (error) {
      Toast.show({
        text1: "Erreur",
        text2: error,
      });
    }
  }, [error]);

  return (
    <AuthWrapper>
      <View style={styles.MainContainer}>
        <AuthHeader
          title={`Mot de passe oublié ?`}
          subtitle="Réinitialise ton mot de passe"
        />

        <InputContainer>
          <TextInput
            label="Email"
            placeholder="tonnom@exemple.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoFocus
          />
        </InputContainer>
        <CTA
          content="Réinitialiser mot de passe"
          onPress={handleReset}
          style={styles.Cta}
          loading={loading}
          disabled={email.length === 0 || !isEmailFormatCorrect(email)}
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
