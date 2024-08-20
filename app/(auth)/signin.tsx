import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";

import { useColors } from "@/hooks";
import APP_INFO from "@/constants/appInfo";
import { isEmailFormatCorrect } from "@/lib";
import {
  CTA,
  InputContainer,
  TextInput,
  AuthFooter,
  AuthHeader,
  AuthWrapper,
} from "@/components";
import { useSignIn } from "@/hooks/useSignIn";

export default function SignInPage() {
  const { replace } = useRouter();
  const { primaryTextColor } = useColors();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signin, loading, error] = useSignIn();

  const handleSignin = async () => {
    signin(email, password, () => replace("/home"));
  };

  return (
    <AuthWrapper isLoading={loading} error={error}>
      <View style={styles.MainContainer}>
        <AuthHeader
          title={`Connexion à ${APP_INFO.name}`}
          subtitle="Merci de te connecter pour continuer"
        />

        <InputContainer>
          <TextInput
            label="Adresse email"
            placeholder="tonnom@exemple.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoFocus
          />
          <TextInput
            label="Mot de passe"
            placeholder="***********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </InputContainer>
        <CTA
          content="Se connecter"
          onPress={handleSignin}
          style={styles.Cta}
          disabled={
            email.length === 0 ||
            !isEmailFormatCorrect(email) ||
            password.length === 0
          }
        />

        <Link
          href={"/forgotpass"}
          style={[{ color: primaryTextColor }, styles.ForgotPassLink]}
        >
          Mot de passe oublié ?
        </Link>
      </View>
      <AuthFooter redirectUri="register" />
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
