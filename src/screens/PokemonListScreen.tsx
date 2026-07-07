import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
// import { useEffect, useState } from 'react'
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPokemonPage } from "../api/pokemon";

type Pokemon = {
  name: string;
  url: string | null;
};

export default function PokemonListScreen() {
  const insets = useSafeAreaInsets();
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
      // console.log(page);
      return page.results;
    }) ?? [];
  // console.log(pokemons);
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
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#e3350d" />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#e3350d" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokemons</Text>
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={pokemons}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        onEndReached={loadPokemons}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
      />
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  listContainer: {
    padding: 16,
  },
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
  loaderContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
