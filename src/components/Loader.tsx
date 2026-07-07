import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Loader() {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#e3350d" />
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
