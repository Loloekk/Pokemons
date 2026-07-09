import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { fetchPokemon } from "../api/pokemon";
import { PokemonListItemProps } from "../types/pokemon";
import Loader from "./Loader";
export default function PokemonListItem({
  pokemonProps,
}: {
  pokemonProps: PokemonListItemProps;
}) {
  const {
    data: pokemon,
    isLoading: isLoadingPokemon,
    isError: isErrorPokemon,
  } = useQuery({
    queryKey: ["pokemon", pokemonProps.name],
    queryFn: () => fetchPokemon(pokemonProps.name),
    enabled: !!pokemonProps.name,
  });

  if (isLoadingPokemon) {
    return <Loader />;
  }

  return (
    <Link href={`/pokemon/${pokemonProps.name}`} asChild>
      <Pressable>
        <View style={styles.card}>
          <Image
            source={{
              uri: isErrorPokemon
                ? ""
                : (pokemon?.sprites?.front_default ?? ""),
            }}
            style={styles.image}
          />
          <Text style={styles.name}>{pokemonProps.name}</Text>
        </View>
      </Pressable>
    </Link>
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
