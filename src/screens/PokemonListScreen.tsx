import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { fetchPokemonPage } from "../api/pokemon";
import Loader from "../components/Loader";
import PokemonList from "../components/PokemonListScreen/PokemonList";
import PokemonListItem from "../components/PokemonListScreen/PokemonListItem";
import { PokemonListItemProps } from "../types/pokemon";

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

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return <Loader />;
  };

  if (isLoading) {
    return <Loader />;
  }

  const renderItem = ({ item }: { item: PokemonListItemProps }) => {
    return (
      <Link href={`/pokemon/${item.name}`} asChild>
        <Pressable>
          <PokemonListItem pokemonProps={item} />
        </Pressable>
      </Link>
    );
  };

  return (
    <PokemonList
      data={pokemons}
      renderItem={renderItem}
      loadPokemons={loadPokemons}
      renderFooter={renderFooter}
    />
  );
}
