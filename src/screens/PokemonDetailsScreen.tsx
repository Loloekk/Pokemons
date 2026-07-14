import PokemonCard from "../components/PokemonScreen/PokemonCard";
type PokemonDetailsScreenProps = {
  pokemonName: string;
};

export default function PokemonDetailsScreen({
  pokemonName,
}: PokemonDetailsScreenProps) {
  // const {
  //   // favouritePokemonName,
  //   // isLoading: isLoadingFavourite,
  //   refetch: refetchFavourite,
  //   // toggleFavourite: toggleFavouritePokemon,
  // } = useFavouritePokemonName();

  // const {
  //   data: pokemon,
  //   isLoading: isLoadingPokemon,
  //   isError,
  // } = useQuery({
  //   queryKey: ["pokemon", pokemonName],
  //   queryFn: () => fetchPokemon(pokemonName),
  //   enabled: !!pokemonName,
  // });

  // useFocusEffect(
  //   useCallback(() => {
  //     refetchFavourite();
  //   }, [refetchFavourite]),
  // );

  // if (isLoadingPokemon || isLoadingFavourite) {
  //   return <Loader />;
  // }

  // if (isError || !pokemon) {
  //   return <PokemonFetchFailed />;
  // }

  // const isFavourite = favouritePokemonName === pokemonName;

  // const toggleFavourite = async () => {
  //   await toggleFavouritePokemon(isFavourite ? null : pokemonName);
  // };

  return <PokemonCard pokemonName={pokemonName} />;
}
