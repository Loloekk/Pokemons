import { useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { fetchPokemon } from "../api/pokemon";
import Loader from "../components/Loader";
import NoFavouritePokemon from "../components/NoFavourtiePokemon";
import PokemonCard from "../components/PokemonCard";
import FetchingPokemonFailed from "../components/PokemonFetchFailed";
import { useFavouritePokemonName } from "../storage/favouritePokemon";
export default function FavouritePokemonScreen() {
  const [pokemonName, setPokemonName] = useState<string | null>(null);

  const {
    favouritePokemonName,
    isLoading: isLoadingFavourite,
    refetch: refetchFavourite,
    toggleFavourite: toggleFavouritePokemon,
  } = useFavouritePokemonName();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { data } = await refetchFavourite();
        setPokemonName(data ?? null);
      })();
    }, [refetchFavourite]),
  );

  const {
    data: pokemon,
    isLoading: isLoadingPokemon,
    isError: isErrorPokemon,
  } = useQuery({
    queryKey: ["pokemon", pokemonName],
    queryFn: () => fetchPokemon(pokemonName),
    enabled: !!pokemonName,
  });

  if (isLoadingPokemon || isLoadingFavourite) {
    return <Loader />;
  }

  if (!favouritePokemonName && !pokemonName) {
    return <NoFavouritePokemon />;
  }

  if (isErrorPokemon || !pokemon) {
    return <FetchingPokemonFailed />;
  }

  const toggleFavourite = async () => {
    await toggleFavouritePokemon(favouritePokemonName ? null : pokemonName);
  };

  return (
    <PokemonCard
      pokemon={pokemon}
      isLiked={!!favouritePokemonName}
      toggleFavourite={toggleFavourite}
    />
  );
}
