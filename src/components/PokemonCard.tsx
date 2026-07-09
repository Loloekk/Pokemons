import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PokemonStats } from "../types/pokemon";

export type PokemonCardProps = {
  pokemon: PokemonStats;
  isLiked: boolean;
  toggleFavourite: () => Promise<void>;
};

export default function PokemonCard({
  pokemon,
  isLiked,
  toggleFavourite,
}: PokemonCardProps) {
  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>{pokemon.name}</Text>
        <Pressable
          onPress={toggleFavourite}
          style={styles.heartButton}
          hitSlop={12}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={28}
            color="white"
          />
        </Pressable>
      </View>
      <View
        style={[
          styles.card,
          {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
          },
        ]}
      >
        {pokemon.sprites && pokemon.sprites.front_default && (
          <Image
            source={{ uri: pokemon.sprites.front_default }}
            style={styles.image}
          />
        )}
        <Text style={styles.params}>Height: {pokemon.height}</Text>
        <Text style={styles.params}>Weight: {pokemon.weight}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#aaa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  params: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  image: {
    width: 200,
    height: 200,
  },
  heartButton: {
    position: "absolute",
    right: 20,
    top: 20,
  },
});
