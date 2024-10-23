import { useColors } from "@/hooks";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { RadialGradient } from "react-native-gradients";

const AddLink = ({
  title,
  href,
  visible,
  offset = 0,
}: {
  title: string;
  href: string;
  visible: boolean;
  offset?: number;
}) => {
  const { appBackground, shadow } = useColors();

  const linkTranslation = useSharedValue(0);
  const boxOpacity = useSharedValue(0);

  const config = {
    duration: 300,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  useEffect(() => {
    linkTranslation.value = withDelay(
      visible ? offset * 100 : -offset * 100,
      withTiming(visible ? 0 : 20, config)
    );
    boxOpacity.value = withDelay(
      visible ? offset * 100 : -offset * 100,
      withTiming(visible ? 1 : 0, config)
    );
  }, [visible]);

  const translationAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: linkTranslation.value }],
    };
  });

  const opacityAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: boxOpacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor: appBackground,
          shadowColor: shadow,
          width: "auto",
          borderRadius: 12,
          shadowOpacity: 0.2,
          shadowRadius: 12,
          shadowOffset: { height: 12, width: 0 },
        },
        translationAnimStyle,
        opacityAnimStyle,
      ]}
    >
      <Link href={href} style={styles.addLinkTitle}>
        {title}
      </Link>
    </Animated.View>
  );
};

export function AddTripButtons() {
  const { navigate } = useRouter();

  const [popupOpened, setPopupOpened] = useState(false);

  const {
    accent,
    invertedPrimaryTextColor,
    shadow,
    subtleBackground,
    primaryTextColor,
    appBackground,
  } = useColors();

  const crossRotation = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);
  const shadowTranslate = useSharedValue(150);

  const easing = Easing.bezier(0.5, 0.01, 0, 1);
  const config = { duration: 300, easing };

  const rotateAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${crossRotation.value}deg` }],
    };
  });

  const shadowAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: shadowOpacity.value,
      transform: [
        { translateX: shadowTranslate.value },
        { translateY: shadowTranslate.value },
      ],
    };
  });

  const togglePopup = () => {
    if (!__DEV__) return navigate("/addtrip/null");
    setPopupOpened((prev) => !prev);
    crossRotation.value = withTiming(popupOpened ? 0 : 45, config);
    shadowOpacity.value = withTiming(popupOpened ? 0 : 1, config);
    shadowTranslate.value = withTiming(popupOpened ? 150 : 0, {
      duration: 500,
      easing,
    });
  };

  return (
    <>
      <View
        style={[
          {
            pointerEvents: popupOpened ? "auto" : "none",
          },
          styles.buttonsContainer,
        ]}
      >
        <AddLink
          href="/autoadd"
          title="Ajouter automatiquement"
          visible={popupOpened}
          offset={1}
        />
        <AddLink
          href="/addtrip/null"
          title="Ajouter manuellement"
          visible={popupOpened}
        />
      </View>

      <TouchableOpacity
        onPress={togglePopup}
        onLongPress={() => {
          if (!__DEV__) return;
          if (popupOpened) return;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          navigate("/addtrip/null");
        }}
        style={[
          {
            backgroundColor: popupOpened ? subtleBackground : accent,
            shadowColor: shadow,
          },
          styles.mainButton,
        ]}
      >
        <Animated.View style={rotateAnimStyle}>
          <Ionicons
            name="add"
            size={48}
            color={popupOpened ? primaryTextColor : invertedPrimaryTextColor}
          />
        </Animated.View>
      </TouchableOpacity>

      <Pressable
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          right: 0,
          width: "100%",
          height: "100%",
          zIndex: 40,
          backgroundColor: "transparent",
          pointerEvents: popupOpened ? "auto" : "none"
        }}
        onPress={() => togglePopup()}
      />

      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "80%",
            borderTopLeftRadius: 9999,
            height: "40%",
          },
          shadowAnimStyle,
        ]}
      >
        <RadialGradient
          colorList={[
            { offset: "50%", color: accent, opacity: "0.2" },
            { offset: "100%", color: accent, opacity: "0" },
          ]}
          x="100%"
          y="100%"
          rx="320"
          ry="320"
        />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    zIndex: 50,
    position: "absolute",
    right: 24,
    bottom: 24 + 64 + 16,
    gap: 8,
  },
  mainButton: {
    position: "absolute",
    zIndex: 50,
    right: 24,
    bottom: 24,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { height: 12, width: 0 },
  },
  addLinkTitle: {
    padding: 16,
    fontSize: 16,
    fontWeight: "500",
  },
});
