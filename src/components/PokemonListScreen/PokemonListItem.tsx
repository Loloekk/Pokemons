import { StyleSheet, Text, View } from "react-native";
import { PokemonDataProps } from "../../types/pokemon";
import PokemonImage from "../PokemonImage";
export default function PokemonListItem({
  pokemonProps,
}: {
  pokemonProps: PokemonDataProps;
}) {
  return (
    <View style={styles.card}>
      <PokemonImage
        style={{ marginRight: 16 }}
        pokemonName={pokemonProps.name}
      />
      <Text style={styles.name}>{pokemonProps.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
    color: "#333",
  },
});
