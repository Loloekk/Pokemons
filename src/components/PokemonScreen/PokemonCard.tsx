import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { fetchPokemon } from "../../api/pokemon";
import { useFavouritePokemonName } from "../../storage/favouritePokemon";
import Loader from "../Loader";
import PokemonImage from "../PokemonImage";

export type PokemonCardProps = {
  pokemonName: string;
  // isLiked: boolean;
  // toggleFavourite: () => Promise<void>;
  toggleRemoveFromMap?: () => Promise<void>;
};

export default function PokemonCard({
  pokemonName,
  toggleRemoveFromMap,
}: PokemonCardProps) {
  const { data: pokemon } = useQuery({
    queryKey: ["pokemon", pokemonName],
    queryFn: () => fetchPokemon(pokemonName),
    enabled: !!pokemonName,
  });
  const { favouritePokemonName, toggleFavourite } = useFavouritePokemonName();

  const isLiked = favouritePokemonName === pokemonName;

  if (!pokemon) {
    return <Loader size="large" />;
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        {toggleRemoveFromMap && (
          <Pressable
            onPress={toggleRemoveFromMap}
            style={styles.removeButton}
            hitSlop={12}
          >
            <Ionicons name="trash" size={28} color="white" />
          </Pressable>
        )}
        <Text style={styles.title}>{pokemon.name}</Text>
        <Pressable
          onPress={() => toggleFavourite(isLiked ? null : pokemonName)}
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
        <PokemonImage
          pokemonName={pokemon.name}
          style={styles.image}
          loaderSize="large"
        />
        <Text style={[styles.params, { marginTop: 20 }]}>
          Height: {pokemon.height}
        </Text>
        <Text style={[styles.params, { marginTop: 10 }]}>
          Weight: {pokemon.weight}
        </Text>
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
    alignSelf: "center",
  },
  heartButton: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  removeButton: {
    position: "absolute",
    left: 20,
    top: 20,
  },
});
