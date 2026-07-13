import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import Loader from "../components/Loader";
import NoFavouritePokemon from "../components/PokemonScreen/NoFavourtiePokemon";
import PokemonCard from "../components/PokemonScreen/PokemonCard";
import { useFavouritePokemonName } from "../storage/favouritePokemon";

export default function FavouritePokemonScreen() {
  const [pokemonName, setPokemonName] = useState<string | null>(null);

  const {
    // favouritePokemonName,
    isLoading: isLoadingFavourite,
    refetch: refetchFavourite,
  } = useFavouritePokemonName();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { data } = await refetchFavourite();
        setPokemonName(data ?? null);
      })();
    }, [refetchFavourite]),
  );

  // // const {
  // //   data: pokemon,
  // //   isLoading: isLoadingPokemon,
  // //   isError: isErrorPokemon,
  // // } = useQuery({
  // //   queryKey: ["pokemon", pokemonName],
  // //   queryFn: () => fetchPokemon(pokemonName),
  // //   enabled: !!pokemonName,
  // });

  if (isLoadingFavourite) {
    return <Loader />;
  }

  if (!pokemonName) {
    return <NoFavouritePokemon />;
  }

  // const toggleFavourite = async () => {
  //   await toggleFavouritePokemon(favouritePokemonName ? null : pokemonName);
  // };

  return (
    <PokemonCard
      pokemonName={pokemonName}
      // isLiked={!!favouritePokemonName}
      // toggleFavourite={toggleFavourite}
    />
  );
}
