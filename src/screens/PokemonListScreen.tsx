import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPokemonPage } from "../api/pokemon";
import Loader from "../components/Loader";
import PokemonList from "../components/PokemonList";
import PokemonListItem from "../components/PokemonListItem";

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

  // const getPokemonImageUrl = (pokemon: PokemonListItemProps) => {
  //   const { data: pokemonData } = useQuery({
  //     queryKey: ["pokemon", pokemon.name],
  //     queryFn: () => fetchPokemon(pokemon.name),
  //     enabled: !!pokemon.name,
  //   });
  //   if (!pokemonData) return "";
  //   return pokemonData.sprites.front_default;
  // };

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
      renderItem={({ item }) => <PokemonListItem pokemonProps={item} />}
      loadPokemons={loadPokemons}
      renderFooter={renderFooter}
    />
  );
}
