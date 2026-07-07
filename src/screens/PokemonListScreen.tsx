import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { fetchPokemonPage } from "../api/pokemon";
import Loader from "../components/Loader";
import PokemonList from "../components/PokemonList";

type Pokemon = {
  name: string;
  url: string | null;
};

export default function PokemonListScreen() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["pokemon-list"],
      queryFn: ({ pageParam }) => fetchPokemonPage(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (!lastPage.next) return undefined;
        const url = new URL(lastPage.next);
        return Number(url.searchParams.get("offset"));
      },
    });

  const pokemons =
    data?.pages.flatMap((page) => {
      return page.results;
    }) ?? [];

  const loadPokemons = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const getPokemonImageUrl = (pokemon: Pokemon) => {
    if (!pokemon.url) return "";

    const id = pokemon.url.split("/").filter(Boolean).pop();
    if (!id) return "";

    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  };

  const renderItem = ({ item }: { item: Pokemon }) => (
    <Link href={`/pokemon/${item.name}`} asChild>
      <Pressable>
        <View style={styles.card}>
          <Image
            source={{ uri: getPokemonImageUrl(item) }}
            style={styles.image}
          />
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </Pressable>
    </Link>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return <Loader />;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <PokemonList
      data={pokemons}
      renderItem={renderItem}
      loadPokemons={loadPokemons}
      renderFooter={renderFooter}
    />
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
