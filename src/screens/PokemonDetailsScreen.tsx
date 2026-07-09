import { useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { fetchPokemon } from "../api/pokemon";
import Loader from "../components/Loader";
import PokemonCard from "../components/PokemonCard";
import PokemonFetchFailed from "../components/PokemonFetchFailed";
import { useFavouritePokemonName } from "../storage/favouritePokemon";

type PokemonDetailsScreenProps = {
  pokemonName: string;
};

export default function PokemonDetailsScreen({
  pokemonName,
}: PokemonDetailsScreenProps) {
  const {
    favouritePokemonName,
    isLoading: isLoadingFavourite,
    refetch: refetchFavourite,
    toggleFavourite: toggleFavouritePokemon,
  } = useFavouritePokemonName();

  const {
    data: pokemon,
    isLoading: isLoadingPokemon,
    isError,
  } = useQuery({
    queryKey: ["pokemon", pokemonName],
    queryFn: () => fetchPokemon(pokemonName),
    enabled: !!pokemonName,
  });

  useFocusEffect(
    useCallback(() => {
      refetchFavourite();
    }, [refetchFavourite]),
  );

  if (isLoadingPokemon || isLoadingFavourite) {
    return <Loader />;
  }

  if (isError || !pokemon) {
    return <PokemonFetchFailed />;
  }

  const isFavourite = favouritePokemonName === pokemonName;

  const toggleFavourite = async () => {
    await toggleFavouritePokemon(isFavourite ? null : pokemonName);
  };

  return (
    <PokemonCard
      pokemon={pokemon}
      isLiked={isFavourite}
      toggleFavourite={toggleFavourite}
    />
  );
}
