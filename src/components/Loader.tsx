import {
  ActivityIndicator,
  ActivityIndicatorProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

interface LoaderProps {
  style?: StyleProp<ViewStyle>;
  size?: ActivityIndicatorProps["size"];
  color?: ActivityIndicatorProps["color"];
}
export default function Loader({
  style,
  size = "large",
  color = "#e3350d",
}: LoaderProps) {
  return (
    <View style={[defaultStyles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const defaultStyles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
