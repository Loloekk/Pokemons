import { useFaceDetector } from "@noma4i/vision-camera-face-detector";
import { Image, StyleSheet, View } from "react-native";
import { Camera, CameraDevice } from "react-native-vision-camera";
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
  const face = useFaceDetector({
    preset: "fast",
    guide: "none",
    fps: 20,
    android: {
      performanceMode: "fast",
      landmarkMode: "none",
      classificationMode: "none",
      contourMode: "none",
    },
  });

  const rect = face.result.primaryFace;

  const size = rect ? rect.bounds.width * 0.45 : 0;
  const left = rect ? rect.bounds.x + rect.bounds.width / 2 - size / 2 : 0;
  const top = rect ? rect.bounds.y - size * 0.6 : 0;

  const overlayStyle = rect
    ? {
        position: "absolute" as const,
        left: left,
        top: top,
        width: size,
        height: size,
      }
    : null;
  const uri = pokemon && pokemon.url ? pokemon.url : null;

  return (
    <View style={styles.container}>
      <Camera
        {...face.camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        mirrorMode="on"
      />
      {overlayStyle && uri && (
        <Image source={{ uri: uri }} style={overlayStyle} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
});
