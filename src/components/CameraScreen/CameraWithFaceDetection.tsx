import { Image } from "expo-image";
import { useCallback, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { CameraDevice } from "react-native-vision-camera";
import { Camera, Face } from "react-native-vision-camera-face-detector";
import { PokemonDataProps } from "../../types/pokemon";

export default function CameraWithFaceDetection({
  device,
  isFocused,
  pokemon,
}: {
  device: CameraDevice;
  isFocused: boolean;
  pokemon: PokemonDataProps;
}) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const isAndroid = Platform.OS === "android";
  const pokemonLeft = useSharedValue<number>(0);
  const pokemonTop = useSharedValue<number>(0);
  const pokemonWidth = useSharedValue<number>(0);
  const pokemonHeight = useSharedValue<number>(0);
  const pokemonRotation = useSharedValue<string>("0deg");

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute" as const,
      left: withSpring(pokemonLeft.value),
      top: withSpring(pokemonTop.value),
      width: withSpring(pokemonWidth.value),
      height: withSpring(pokemonHeight.value),
      transform: [{ rotate: withSpring(pokemonRotation.value) }],
    };
  });

  const uri = pokemon?.url ?? null;

  const onFacesDetected = useCallback(
    (faces: Face[]) => {
      "worklet";
      const face = faces[0] ?? null;
      if (!face) return;
      const leftEye = isAndroid
        ? face.landmarks?.RIGHT_EYE
        : face.landmarks?.LEFT_EYE;
      const rightEye = isAndroid
        ? face.landmarks?.LEFT_EYE
        : face.landmarks?.RIGHT_EYE;

      const hasEyes = leftEye && rightEye;

      const dx = hasEyes ? rightEye.x - leftEye.x : 0;
      const dy = hasEyes ? rightEye.y - leftEye.y : 0;
      const size = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      const middleX = hasEyes ? (leftEye.x + rightEye.x) / 2 : 0;
      const middleY = hasEyes ? (leftEye.y + rightEye.y) / 2 : 0;

      const normalX = size > 0 ? dy / size : 0;
      const normalY = size > 0 ? -dx / size : 0;

      const distance = size * 1.2;

      const pokemonCenterX = middleX + normalX * distance;
      const pokemonCenterY = middleY + normalY * distance;
      /* eslint-disable react-hooks/immutability -- Reanimated shared values */
      pokemonLeft.value = pokemonCenterX - size / 2;
      pokemonTop.value = pokemonCenterY - size / 2;
      pokemonWidth.value = size;
      pokemonHeight.value = size;
      pokemonRotation.value = `${angle}deg`;
      /* eslint-enable react-hooks/immutability */
    },
    [
      isAndroid,
      pokemonLeft,
      pokemonTop,
      pokemonWidth,
      pokemonHeight,
      pokemonRotation,
    ],
  );

  return (
    <View
      style={styles.container}
      onLayout={({ nativeEvent: { layout } }) => {
        setWindowSize({
          width: layout.width,
          height: layout.height,
        });
      }}
    >
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        performanceMode="accurate"
        runLandmarks
        autoMode
        windowWidth={windowSize.width}
        windowHeight={windowSize.height}
        cameraFacing="front"
        onFacesDetected={onFacesDetected}
        onError={(error) => console.error("Face detection error:", error)}
      />
      {uri && (
        <Animated.View style={animatedStyle}>
          <Image source={{ uri: uri }} style={styles.image} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
