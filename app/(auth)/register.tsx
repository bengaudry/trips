import { useState } from "react";
import { View, StyleSheet } from "react-native";

import APP_INFO from "@/constants/appInfo";
import { isEmailFormatCorrect } from "@/lib";
import {
  CTA,
  InputContainer,
  TextInput,
  AuthFooter,
  AuthHeader,
  AuthWrapper,
  Text,
} from "@/components";
import { useRouter } from "expo-router";
import { useRegister } from "@/hooks/useRegister";

export default function SignInPage() {
  const { push } = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [register, loading, error] = useRegister();

  const handleRegister = () => {
    if (password !== passwordConfirm) return;
    register(email, password, displayName, () => {
      push("/check-email")
    })
  };

  return (
    <AuthWrapper isLoading={loading} error={error}>
      <View style={styles.MainContainer}>
        <AuthHeader
          title={`S'inscrire sur ${APP_INFO.name}`}
          subtitle="Bienvenue ! Quelques questions avant de continuer"
        />

        <InputContainer>
          <TextInput
            label="Nom"
            placeholder="John Doe"
            textContentType="name"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <TextInput
            label="Adresse email"
            placeholder="tonnom@exemple.com"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            label="Mot de passe"
            placeholder="***********"
            textContentType="newPassword"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            label="Confirmation mot de passe"
            placeholder="***********"
            textContentType="newPassword"
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry
          />
        </InputContainer>
        <CTA
          content="Créer mon compte"
          style={styles.Cta}
          onPress={handleRegister}
          disabled={
            email.length === 0 ||
            !isEmailFormatCorrect(email) ||
            displayName.length === 0 ||
            password !== passwordConfirm ||
            password.length === 0
          }
        />
      </View>
      <AuthFooter redirectUri="signin" />
    </AuthWrapper>
  );
}

const styles = StyleSheet.create({
  MainContainer: { paddingHorizontal: 24 },
  ForgotPassLink: {
    fontWeight: "500",
    textAlign: "right",
  },
  Cta: { marginTop: 32, marginBottom: 8 },
});
