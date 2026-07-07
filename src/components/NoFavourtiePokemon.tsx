import { StyleSheet, Text, View } from "react-native";
export default function NoFavouritePokemon() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favourite Pokemon</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.message}>Like some pokemon to show him there</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#e3350d",
    alignItems: "center",
    position: "relative",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "capitalize",
    color: "white",
  },
  card: {
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#aaa",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
});
